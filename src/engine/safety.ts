import type { ScenarioControls } from "../types/domain";
import { clamp } from "./math";

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
  controls: ScenarioControls
): ScenarioControls => ({
  ...controls,
  budget: clampInteger(controls.budget, 120, 900),
  maxTeams: clampInteger(controls.maxTeams, 2, 18),
  ethicalFloor: clamp(controls.ethicalFloor, 0, 1),
  climateStress: clamp(controls.climateStress, 0, 1),
  infrastructureShock: clamp(controls.infrastructureShock, 0, 1),
  publicTrust: clamp(controls.publicTrust, 0, 1),
  mode: controls.mode
});

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
