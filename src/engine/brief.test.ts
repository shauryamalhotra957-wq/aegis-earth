import { describe, expect, it } from "vitest";
import { regions, signals, resources, logisticsHubs } from "../data/seed";
import { optimizeResponse } from "./optimizer";
import { scoreRegions } from "./riskEngine";
import { simulateScenario } from "./scenario";
import { buildExecutiveBrief } from "./brief";

describe("executive brief", () => {
  it("generates sanitized markdown from the current plan", () => {
    const controls = {
      budget: 520,
      maxTeams: 8,
      ethicalFloor: 0.62,
      climateStress: 0.48,
      infrastructureShock: 0.34,
      publicTrust: 0.68,
      mode: "surge" as const
    };
    const plan = optimizeResponse(regions, signals, resources, logisticsHubs, controls);
    const scenario = simulateScenario(regions, signals, resources, logisticsHubs, controls);
    const text = buildExecutiveBrief(
      {
        generatedAt: "2026-07-12T00:00:00.000Z",
        headline: "Risk update <b>critical</b>",
        topRisks: scoreRegions(regions, signals),
        plan,
        scenario
      },
      regions
    );

    expect(text).toContain("Aegis Earth Executive Brief");
    expect(text).toContain("&lt;b&gt;critical&lt;/b&gt;");
    expect(text).not.toContain("<b>critical</b>");
  });
});
