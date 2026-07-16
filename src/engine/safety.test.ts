import { describe, expect, it } from "vitest";
import { escapeHtml, safeJsonParse, sanitizeScenarioControls } from "./safety";

describe("safety utilities", () => {
  it("escapes markup before text export", () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    );
  });

  it("clamps scenario controls to supported ranges", () => {
    const controls = sanitizeScenarioControls({
      budget: 9999,
      maxTeams: -5,
      ethicalFloor: 2,
      climateStress: -1,
      infrastructureShock: 4,
      publicTrust: 3,
      mode: "shock"
    });

    expect(controls.budget).toBe(900);
    expect(controls.maxTeams).toBe(2);
    expect(controls.ethicalFloor).toBe(1);
    expect(controls.climateStress).toBe(0);
    expect(controls.infrastructureShock).toBe(1);
    expect(controls.publicTrust).toBe(1);
  });

  it("falls back when persisted JSON is malformed", () => {
    expect(safeJsonParse("{bad", { ok: true })).toEqual({ ok: true });
  });

  it("restores safe defaults for missing and non-finite persisted controls", () => {
    const controls = sanitizeScenarioControls({
      budget: Number.NaN,
      maxTeams: Number.POSITIVE_INFINITY,
      mode: "unknown"
    });

    expect(controls).toEqual({
      budget: 520,
      maxTeams: 8,
      ethicalFloor: 0.62,
      climateStress: 0.48,
      infrastructureShock: 0.34,
      publicTrust: 0.68,
      mode: "surge"
    });
    expect(
      Object.values(controls).every(
        (value) => typeof value !== "number" || Number.isFinite(value)
      )
    ).toBe(true);
  });

  it("accepts null persisted controls without crashing", () => {
    expect(sanitizeScenarioControls(null)).toEqual({
      budget: 520,
      maxTeams: 8,
      ethicalFloor: 0.62,
      climateStress: 0.48,
      infrastructureShock: 0.34,
      publicTrust: 0.68,
      mode: "surge"
    });
  });
});
