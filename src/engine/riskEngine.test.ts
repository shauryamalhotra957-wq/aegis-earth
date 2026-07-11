import { describe, expect, it } from "vitest";
import { regions, signals } from "../data/seed";
import { scoreRegions } from "./riskEngine";

describe("risk engine", () => {
  it("ranks compound high-exposure regions above resilient regions", () => {
    const scores = scoreRegions(regions, signals);
    const ganges = scores.find((score) => score.regionId === "ganges-delta");
    const rhine = scores.find((score) => score.regionId === "rhine-ruhr");

    expect(ganges).toBeDefined();
    expect(rhine).toBeDefined();
    expect(ganges!.totalRisk).toBeGreaterThan(rhine!.totalRisk);
    expect(ganges!.drivers.join(" ")).toContain("high vulnerability");
  });

  it("increases signal pressure when fresh severe reports are added", () => {
    const baseline = scoreRegions(regions, signals).find((score) => score.regionId === "rhine-ruhr")!;
    const withSevereSignal = scoreRegions(regions, [
      ...signals,
      {
        id: "test-severe-rhine",
        regionId: "rhine-ruhr",
        channel: "weather",
        title: "Severe flood confirmation",
        text: "Gauge stations confirm rapidly rising river levels.",
        severity: 0.96,
        confidence: 0.94,
        timestamp: "2026-07-11T23:50:00.000Z",
        tags: ["flood", "infrastructure"]
      }
    ]).find((score) => score.regionId === "rhine-ruhr")!;

    expect(withSevereSignal.signalPressure).toBeGreaterThan(baseline.signalPressure);
    expect(withSevereSignal.totalRisk).toBeGreaterThan(baseline.totalRisk);
  });
});
