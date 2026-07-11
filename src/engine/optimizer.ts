import type {
  CrisisSignal,
  Intervention,
  LogisticsHub,
  OptimizationOptions,
  OptimizationResult,
  Region,
  ResourceUnit,
  RiskScore
} from "../types/domain";
import { clamp, haversineKm, round, seededNoise } from "./math";
import { scoreRegions } from "./riskEngine";

const modeMultiplier = {
  baseline: 1,
  surge: 1.13,
  shock: 1.28
} as const;

const nearestHubTravelHours = (region: Region, hubs: LogisticsHub[], resource: ResourceUnit) => {
  const best = hubs
    .map((hub) => {
      const distance = haversineKm(region, hub);
      const velocity = 260 + resource.speed * 560;
      const readinessFactor = 1 / Math.max(0.35, hub.readiness);
      return distance / velocity + readinessFactor * 2.4;
    })
    .sort((a, b) => a - b)[0];
  return best ?? 18;
};

const efficacyForRegion = (region: Region, resource: ResourceUnit): number => {
  const entries = Object.entries(resource.effects);
  const weighted = entries.reduce((sum, [hazard, effect]) => {
    const hazardValue = region.hazards[hazard as keyof typeof region.hazards];
    return sum + hazardValue * (effect ?? 0);
  }, 0);
  const denominator = entries.reduce((sum, [, effect]) => sum + (effect ?? 0), 0);
  return denominator === 0 ? 0 : clamp(weighted / denominator);
};

export const generateInterventions = (
  regions: Region[],
  riskScores: RiskScore[],
  resources: ResourceUnit[],
  hubs: LogisticsHub[],
  options: OptimizationOptions
): Intervention[] => {
  const riskByRegion = new Map(riskScores.map((score) => [score.regionId, score]));
  return regions.flatMap((region) => {
    const risk = riskByRegion.get(region.id);
    if (!risk) return [];
    return resources.map((resource) => {
      const efficacy = efficacyForRegion(region, resource);
      const travelHours = nearestHubTravelHours(region, hubs, resource);
      const timeToEffect = clamp(
        travelHours / (resource.kind === "air" ? 18 : 30),
        0.12,
        1
      );
      const fairness = clamp(
        0.62 +
          region.vulnerability * 0.22 +
          resource.equityBoost +
          (risk.equityNeed >= options.ethicalFloor ? 0.08 : -0.04)
      );
      const readinessPenalty = clamp(1 - region.governanceReadiness * 0.28, 0.72, 1);
      const impact = clamp(
        risk.totalRisk *
          efficacy *
          resource.capacity *
          modeMultiplier[options.mode] *
          readinessPenalty *
          (1 + resource.units / 18) +
          seededNoise(`${region.id}-${resource.id}`, 0.025)
      );
      const scarcityPenalty = 1 + resource.scarcity * 0.28;
      const score =
        (impact * (0.72 + fairness * 0.28) * (0.65 + resource.speed * 0.35)) /
        Math.max(18, resource.cost * scarcityPenalty * Math.sqrt(timeToEffect + 0.36));
      return {
        id: `${region.id}:${resource.id}`,
        regionId: region.id,
        resourceId: resource.id,
        resourceLabel: resource.label,
        resourceKind: resource.kind,
        impact: round(impact, 3),
        cost: resource.cost,
        fairness: round(fairness, 3),
        timeToEffect: round(timeToEffect * 24, 1),
        score: round(score * 100, 3),
        rationale: `${resource.label} targets ${region.name}'s ${risk.drivers
          .slice(0, 2)
          .join(" and ")} while preserving fairness coverage.`
      };
    });
  });
};

export const optimizeResponse = (
  regions: Region[],
  signals: CrisisSignal[],
  resources: ResourceUnit[],
  hubs: LogisticsHub[],
  options: OptimizationOptions
): OptimizationResult => {
  const riskScores = scoreRegions(regions, signals);
  const candidates = generateInterventions(regions, riskScores, resources, hubs, options).sort(
    (a, b) => b.score - a.score
  );
  const selected: Intervention[] = [];
  const rejected: Intervention[] = [];
  const usedRegionKinds = new Set<string>();
  let budgetUsed = 0;

  for (const candidate of candidates) {
    const duplicateKey = `${candidate.regionId}:${candidate.resourceKind}`;
    const wouldExceedBudget = budgetUsed + candidate.cost > options.budget;
    const wouldExceedTeams = selected.length >= options.maxTeams;
    const duplicateKind = usedRegionKinds.has(duplicateKey);
    if (wouldExceedBudget || wouldExceedTeams || duplicateKind || candidate.impact < 0.08) {
      rejected.push(candidate);
      continue;
    }
    selected.push(candidate);
    usedRegionKinds.add(duplicateKey);
    budgetUsed += candidate.cost;
  }

  const expectedRiskReduction = clamp(
    selected.reduce((sum, intervention) => sum + intervention.impact * 0.085, 0)
  );
  const vulnerableRegions = new Set(
    regions.filter((region) => region.vulnerability >= options.ethicalFloor).map((region) => region.id)
  );
  const coveredVulnerable = new Set(
    selected
      .filter((intervention) => vulnerableRegions.has(intervention.regionId))
      .map((intervention) => intervention.regionId)
  );
  const fairnessCoverage =
    vulnerableRegions.size === 0 ? 1 : coveredVulnerable.size / vulnerableRegions.size;
  const bindingConstraint =
    selected.length >= options.maxTeams
      ? "team capacity"
      : budgetUsed >= options.budget * 0.9
        ? "response budget"
        : "risk threshold";

  return {
    selected,
    rejected,
    budgetUsed,
    expectedRiskReduction: round(expectedRiskReduction, 3),
    fairnessCoverage: round(fairnessCoverage, 3),
    bindingConstraint
  };
};
