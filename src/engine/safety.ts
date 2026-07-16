import type { ScenarioControls, ScenarioMode } from "../types/domain";
import { clamp } from "./math";

export const DEFAULT_SCENARIO_CONTROLS: ScenarioControls = {
  budget: 520,
  maxTeams: 8,
  ethicalFloor: 0.62,
  climateStress: 0.48,
  infrastructureShock: 0.34,
  publicTrust: 0.68,
  mode: "surge"
};

const scenarioModes = new Set<ScenarioMode>(["baseline", "surge", "shock"]);

const finiteNumber = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

type PersistedScenarioControls = {
  [Key in keyof ScenarioControls]?: unknown;
};

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const clampInteger = (value: number, min: number, max: number): number =>
  Math.round(clamp(value, min, max));

export const sanitizeScenarioControls = (
  controls: PersistedScenarioControls | null | undefined
): ScenarioControls => {
  const candidate = controls ?? {};
  const mode = scenarioModes.has(candidate.mode as ScenarioMode)
    ? (candidate.mode as ScenarioMode)
    : DEFAULT_SCENARIO_CONTROLS.mode;

  return {
    budget: clampInteger(
      finiteNumber(candidate.budget, DEFAULT_SCENARIO_CONTROLS.budget),
      120,
      900
    ),
    maxTeams: clampInteger(
      finiteNumber(candidate.maxTeams, DEFAULT_SCENARIO_CONTROLS.maxTeams),
      2,
      18
    ),
    ethicalFloor: clamp(
      finiteNumber(candidate.ethicalFloor, DEFAULT_SCENARIO_CONTROLS.ethicalFloor),
      0,
      1
    ),
    climateStress: clamp(
      finiteNumber(candidate.climateStress, DEFAULT_SCENARIO_CONTROLS.climateStress),
      0,
      1
    ),
    infrastructureShock: clamp(
      finiteNumber(candidate.infrastructureShock, DEFAULT_SCENARIO_CONTROLS.infrastructureShock),
      0,
      1
    ),
    publicTrust: clamp(
      finiteNumber(candidate.publicTrust, DEFAULT_SCENARIO_CONTROLS.publicTrust),
      0,
      1
    ),
    mode
  };
};

export const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as unknown;
    return parsed as T;
  } catch {
    return fallback;
  }
};

export const createDownload = (filename: string, text: string): void => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
