import type {
  CrisisSignal,
  LogisticsHub,
  Region,
  ResourceUnit,
  ScenarioControls,
  ScenarioResult,
  ScenarioStep
} from "../types/domain";
import { clamp, round } from "./math";
import { optimizeResponse } from "./optimizer";
import { scoreRegions } from "./riskEngine";
import { sanitizeScenarioControls } from "./safety";

export const simulateScenario = (
  regions: Region[],
  signals: CrisisSignal[],
  resources: ResourceUnit[],
  hubs: LogisticsHub[],
  controls: ScenarioControls
): ScenarioResult => {
  const safeControls = sanitizeScenarioControls(controls);
  const adjustedRegions = regions.map((region) => ({
    ...region,
    hazards: {
      ...region.hazards,
      flood: clamp(region.hazards.flood + safeControls.climateStress * 0.08),
      heat: clamp(region.hazards.heat + safeControls.climateStress * 0.1),
      storm: clamp(region.hazards.storm + safeControls.climateStress * 0.07),
      infrastructure: clamp(region.hazards.infrastructure + safeControls.infrastructureShock * 0.12)
    },
    infrastructure: {
      ...region.infrastructure,
      powerReliability: clamp(
        region.infrastructure.powerReliability - safeControls.infrastructureShock * 0.12
      ),
      roadAccess: clamp(region.infrastructure.roadAccess - safeControls.infrastructureShock * 0.1),
      commsReliability: clamp(
        region.infrastructure.commsReliability - safeControls.infrastructureShock * 0.08
      )
    }
  }));

  const plan = optimizeResponse(adjustedRegions, signals, resources, hubs, safeControls);
  const riskScores = scoreRegions(adjustedRegions, signals);
  const totalPopulationAtRisk = adjustedRegions.reduce((sum, region) => {
    const risk = riskScores.find((item) => item.regionId === region.id)?.totalRisk ?? 0;
    return sum + region.population * risk * 0.018;
  }, 0);
  const totalRisk = riskScores.reduce((sum, risk) => sum + risk.totalRisk, 0);
  const selectedImpact = plan.selected.reduce((sum, intervention) => sum + intervention.impact, 0);
  const trustMultiplier = 0.72 + safeControls.publicTrust * 0.42;
  const stressPenalty = 1 + safeControls.climateStress * 0.34 + safeControls.infrastructureShock * 0.3;

  const steps: ScenarioStep[] = Array.from({ length: 13 }, (_, index) => {
    const hour = index * 6;
    const ramp = 1 - Math.exp(-hour / 26);
    const responseEffect = selectedImpact * ramp * trustMultiplier;
    const riskReduced = clamp((responseEffect * 0.12) / Math.max(0.2, totalRisk) / stressPenalty);
    const livesProtected = Math.round(totalPopulationAtRisk * riskReduced * (0.82 + ramp * 0.2));
    const peopleSheltered = Math.round(
      plan.selected
        .filter((intervention) => intervention.resourceKind === "shelter" || intervention.resourceKind === "evacuation")
        .reduce((sum, intervention) => sum + intervention.impact * 78000, 0) *
        ramp *
        trustMultiplier
    );
    const systemsRestored = clamp(
      plan.selected
        .filter((intervention) => ["power", "water", "comms"].includes(intervention.resourceKind))
        .reduce((sum, intervention) => sum + intervention.impact * 0.14, 0) * ramp
    );
    const unmetNeed = clamp(1 - riskReduced * 1.8 - systemsRestored * 0.4 + safeControls.infrastructureShock * 0.12);
    return {
      hour,
      livesProtected,
      peopleSheltered,
      systemsRestored: round(systemsRestored, 3),
      unmetNeed: round(unmetNeed, 3),
      riskReduced: round(riskReduced, 3)
    };
  });

  const final = steps[steps.length - 1];
  const topRegion = riskScores[0];
  const regionName =
    adjustedRegions.find((region) => region.id === topRegion?.regionId)?.name ?? "the highest-risk region";
  const narrative = [
    `${regionName} remains the first decision point because its compound risk is highest.`,
    `${plan.selected.length} interventions use ${plan.budgetUsed} credits and are constrained mainly by ${plan.bindingConstraint}.`,
    `The 72-hour simulation projects ${final.livesProtected.toLocaleString()} lives protected and ${Math.round(
      final.riskReduced * 100
    )}% aggregate risk reduction under current assumptions.`
  ];

  return {
    steps,
    final,
    narrative
  };
};
