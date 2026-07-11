import type { CrisisSignal, HazardKind, Region, RiskScore, ScoredSignal } from "../types/domain";
import { clamp, round, weightedAverage } from "./math";
import { scoreSignals, signalPressureForRegion } from "./signalEngine";

const hazardLabels: Record<HazardKind, string> = {
  wildfire: "wildfire spread",
  flood: "flood exposure",
  heat: "extreme heat",
  storm: "storm surge",
  quake: "seismic fragility",
  health: "public health stress",
  infrastructure: "infrastructure failure"
};

const topHazards = (region: Region): string[] =>
  Object.entries(region.hazards)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([hazard]) => hazardLabels[hazard as HazardKind]);

export const infrastructureFragility = (region: Region): number => {
  const infra = region.infrastructure;
  const hospitalScore = clamp(1 - infra.hospitalBedsPer10k / 55);
  const shelterScore = clamp(1 - infra.shelterCapacityPer10k / 65);
  return round(
    weightedAverage([
      [hospitalScore, 1.2],
      [shelterScore, 0.9],
      [1 - infra.powerReliability, 1],
      [1 - infra.waterReliability, 1],
      [1 - infra.roadAccess, 1.1],
      [1 - infra.commsReliability, 0.8]
    ]),
    3
  );
};

export const baseHazardScore = (region: Region): number => {
  const values = Object.values(region.hazards);
  const maxHazard = Math.max(...values);
  const averageHazard = values.reduce((sum, value) => sum + value, 0) / values.length;
  const multiHazardPenalty = values.filter((value) => value > 0.65).length * 0.035;
  return clamp(maxHazard * 0.54 + averageHazard * 0.38 + multiHazardPenalty);
};

export const scoreRegions = (
  regions: Region[],
  signals: CrisisSignal[] | ScoredSignal[],
  now = new Date("2026-07-12T00:00:00.000Z")
): RiskScore[] => {
  const scoredSignals = signals.every((signal) => "trustScore" in signal)
    ? (signals as ScoredSignal[])
    : scoreSignals(signals as CrisisSignal[], now);

  return regions
    .map((region) => {
      const signalPressure = signalPressureForRegion(region.id, scoredSignals);
      const baseHazard = baseHazardScore(region);
      const exposure = clamp((Math.log10(region.population) - 5.8) / 2.2);
      const fragility = infrastructureFragility(region);
      const equityNeed = region.vulnerability;
      const readinessGap = 1 - region.governanceReadiness;
      const cascadeRisk = clamp(
        (region.hazards.infrastructure * 0.42 +
          fragility * 0.34 +
          signalPressure * 0.14 +
          readinessGap * 0.1) *
          (region.infrastructure.powerReliability < 0.58 ? 1.08 : 1)
      );
      const totalRisk = clamp(
        baseHazard * 0.29 +
          signalPressure * 0.22 +
          exposure * 0.15 +
          fragility * 0.15 +
          equityNeed * 0.11 +
          cascadeRisk * 0.08
      );

      const regionalSignals = scoredSignals.filter((signal) => signal.regionId === region.id);
      const signalConfidence =
        regionalSignals.length === 0
          ? 0.42
          : regionalSignals.reduce((sum, signal) => sum + signal.trustScore, 0) /
            regionalSignals.length;
      const dataCompleteness = clamp(
        0.36 +
          Object.values(region.hazards).filter((value) => value > 0).length * 0.055 +
          regionalSignals.length * 0.08
      );
      const confidence = clamp(
        signalConfidence * 0.48 +
          dataCompleteness * 0.28 +
          region.governanceReadiness * 0.16 +
          (1 - fragility) * 0.08
      );
      const drivers = [
        ...topHazards(region),
        signalPressure > 0.55 ? "fresh high-trust signals" : "limited live signal pressure",
        fragility > 0.6 ? "fragile infrastructure" : "moderate infrastructure resilience",
        equityNeed > 0.7 ? "high vulnerability population" : "standard vulnerability profile"
      ];

      return {
        regionId: region.id,
        baseHazard: round(baseHazard, 3),
        signalPressure: round(signalPressure, 3),
        exposure: round(exposure, 3),
        infrastructureFragility: fragility,
        equityNeed: round(equityNeed, 3),
        cascadeRisk: round(cascadeRisk, 3),
        totalRisk: round(totalRisk, 3),
        confidence: round(confidence, 3),
        drivers
      };
    })
    .sort((a, b) => b.totalRisk - a.totalRisk);
};
