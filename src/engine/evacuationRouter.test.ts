import { describe, expect, it } from "vitest";
import { EvacuationRouter, type EvacuationNode } from "./evacuationRouter";

describe("EvacuationRouter", () => {
  it("routes high-risk population to available capacity shelters", () => {
    const origin: EvacuationNode = {
      id: "zone-coastal",
      name: "Coastal Lowlands",
      population: 15000,
      hazardRisk: 0.85,
      roadAccessScore: 0.7,
      shelterCapacity: 200,
      currentSheltered: 150,
    };

    const shelter: EvacuationNode = {
      id: "zone-highland",
      name: "Highland Safe Center",
      population: 2000,
      hazardRisk: 0.1,
      roadAccessScore: 0.95,
      shelterCapacity: 10000,
      currentSheltered: 1000,
    };

    const routes = EvacuationRouter.planRoutes([origin], [shelter]);

    expect(routes.length).toBe(1);
    expect(routes[0].fromNodeId).toBe("zone-coastal");
    expect(routes[0].toNodeId).toBe("zone-highland");
    expect(routes[0].evacueeCount).toBeGreaterThan(0);
    expect(routes[0].estimatedTransitHours).toBeGreaterThan(0);
    expect(routes[0].safetyScore).toBeGreaterThan(0);
  });

  it("flags bottleneck warnings on degraded road access", () => {
    const origin: EvacuationNode = {
      id: "zone-flooded",
      name: "Flooded Valley",
      population: 5000,
      hazardRisk: 0.9,
      roadAccessScore: 0.25, // severely degraded
      shelterCapacity: 0,
      currentSheltered: 0,
    };

    const shelter: EvacuationNode = {
      id: "zone-haven",
      name: "Inland Haven",
      population: 1000,
      hazardRisk: 0.05,
      roadAccessScore: 0.9,
      shelterCapacity: 5000,
      currentSheltered: 0,
    };

    const routes = EvacuationRouter.planRoutes([origin], [shelter]);
    expect(routes.length).toBe(1);
    expect(routes[0].bottleneckWarning).toBe(true);
  });
});
