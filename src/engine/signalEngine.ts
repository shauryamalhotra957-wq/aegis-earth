import type { CrisisSignal, ScoredSignal, SignalChannel } from "../types/domain";
import { clamp, round } from "./math";

const channelTrust: Record<SignalChannel, number> = {
  satellite: 0.82,
  weather: 0.86,
  responder: 0.78,
  hospital: 0.8,
  social: 0.42,
  infrastructure: 0.73,
  simulation: 0.58
};

export const getAgeHours = (timestamp: string, now = new Date()): number => {
  const time = new Date(timestamp).getTime();
  if (Number.isNaN(time)) return 72;
  return Math.max(0, (now.getTime() - time) / 36e5);
};

export const scoreSignals = (
  signals: CrisisSignal[],
  now = new Date("2026-07-12T00:00:00.000Z")
): ScoredSignal[] =>
  signals
    .map((signal) => {
      const ageHours = getAgeHours(signal.timestamp, now);
      const recency = Math.exp(-ageHours / 36);
      const corroboration =
        signals.filter(
          (other) =>
            other.id !== signal.id &&
            other.regionId === signal.regionId &&
            other.tags.some((tag) => signal.tags.includes(tag))
        ).length > 0
          ? 0.08
          : 0;
      const socialPenalty = signal.channel === "social" && signal.confidence < 0.55 ? -0.12 : 0;
      const trustScore = clamp(
        channelTrust[signal.channel] * 0.38 +
          signal.confidence * 0.42 +
          recency * 0.14 +
          corroboration +
          socialPenalty
      );
      const signalWeight = clamp(signal.severity * trustScore * (0.72 + recency * 0.28));
      const reasons: string[] = [
        `${signal.channel} channel`,
        `${Math.round(signal.confidence * 100)}% source confidence`
      ];
      if (corroboration > 0) reasons.push("corroborated by nearby signal");
      if (socialPenalty < 0) reasons.push("unverified social report discounted");
      return {
        ...signal,
        trustScore: round(trustScore, 3),
        ageHours: round(ageHours, 1),
        signalWeight: round(signalWeight, 3),
        reasons
      };
    })
    .sort((a, b) => b.signalWeight - a.signalWeight);

export const signalPressureForRegion = (
  regionId: string,
  scoredSignals: ScoredSignal[]
): number => {
  const relevant = scoredSignals.filter((signal) => signal.regionId === regionId);
  if (relevant.length === 0) return 0;
  const pressure = relevant.reduce((sum, signal) => sum + signal.signalWeight, 0);
  return clamp(pressure / 1.55);
};
