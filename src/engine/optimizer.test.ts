import { describe, expect, it } from "vitest";
import { logisticsHubs, regions, resources, signals } from "../data/seed";
import { optimizeResponse } from "./optimizer";

describe("response optimizer", () => {
  it("respects budget and team constraints", () => {
    const plan = optimizeResponse(regions, signals, resources, logisticsHubs, {
      budget: 220,
      maxTeams: 2,
      ethicalFloor: 0.62,
      mode: "surge"
    });

    expect(plan.selected.length).toBeLessThanOrEqual(2);
    expect(plan.budgetUsed).toBeLessThanOrEqual(220);
    expect(plan.selected.length).toBeGreaterThan(0);
  });

  it("prioritizes vulnerable regions when the ethical floor is high", () => {
    const plan = optimizeResponse(regions, signals, resources, logisticsHubs, {
      budget: 620,
      maxTeams: 7,
      ethicalFloor: 0.7,
      mode: "surge"
    });
    const protectedRegions = new Set(plan.selected.map((action) => action.regionId));

    expect(protectedRegions.has("ganges-delta")).toBe(true);
    expect(plan.fairnessCoverage).toBeGreaterThanOrEqual(0.5);
  });
});
