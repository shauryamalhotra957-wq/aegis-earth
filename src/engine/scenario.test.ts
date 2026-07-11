import { describe, expect, it } from "vitest";
import { logisticsHubs, regions, resources, signals } from "../data/seed";
import { simulateScenario } from "./scenario";

describe("scenario simulator", () => {
  it("projects stronger outcomes when the mission has more budget and teams", () => {
    const constrained = simulateScenario(regions, signals, resources, logisticsHubs, {
      budget: 140,
      maxTeams: 2,
      ethicalFloor: 0.62,
      climateStress: 0.52,
      infrastructureShock: 0.44,
      publicTrust: 0.62,
      mode: "surge"
    });
    const expanded = simulateScenario(regions, signals, resources, logisticsHubs, {
      budget: 720,
      maxTeams: 10,
      ethicalFloor: 0.62,
      climateStress: 0.52,
      infrastructureShock: 0.44,
      publicTrust: 0.62,
      mode: "surge"
    });

    expect(expanded.final.livesProtected).toBeGreaterThan(constrained.final.livesProtected);
    expect(expanded.final.riskReduced).toBeGreaterThan(constrained.final.riskReduced);
    expect(expanded.steps).toHaveLength(13);
  });
});
