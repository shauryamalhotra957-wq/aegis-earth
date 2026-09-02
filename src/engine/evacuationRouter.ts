import { clamp, round } from "./math";

export interface EvacuationNode {
  id: string;
  name: string;
  population: number;
  hazardRisk: number; // 0.0 to 1.0
  roadAccessScore: number; // 0.0 (blocked) to 1.0 (clear)
  shelterCapacity: number;
  currentSheltered: number;
}

export interface EvacuationRouteResult {
  fromNodeId: string;
  toNodeId: string;
  evacueeCount: number;
  estimatedTransitHours: number;
  safetyScore: number;
  bottleneckWarning: boolean;
}

export class EvacuationRouter {
  /**
   * Plans optimal, hazard-weighted evacuation allocations from high-risk zones to available shelters.
   */
  static planRoutes(
    originNodes: EvacuationNode[],
    shelterNodes: EvacuationNode[],
    avgSpeedKmh = 45,
    distanceMatrix: Record<string, Record<string, number>> = {}
  ): EvacuationRouteResult[] {
    const results: EvacuationRouteResult[] = [];

    // Filter origins with high hazard or population needing relocation
    const criticalOrigins = [...originNodes].sort((a, b) => b.hazardRisk - a.hazardRisk);

    for (const origin of criticalOrigins) {
      if (origin.hazardRisk < 0.4) continue;

      const peopleToEvacuate = Math.round(origin.population * origin.hazardRisk * 0.4);
      if (peopleToEvacuate <= 0) continue;

      // Find available shelter node with capacity and highest safety score
      const availableShelters = shelterNodes
        .filter((s) => s.shelterCapacity - s.currentSheltered > 0 && s.id !== origin.id)
        .sort((a, b) => {
          const capA = a.shelterCapacity - a.currentSheltered;
          const capB = b.shelterCapacity - b.currentSheltered;
          return capB - capA;
        });

      if (availableShelters.length === 0) continue;

      const targetShelter = availableShelters[0];
      const capacityRemaining = targetShelter.shelterCapacity - targetShelter.currentSheltered;
      const allocatedEvacuees = Math.min(peopleToEvacuate, capacityRemaining);

      targetShelter.currentSheltered += allocatedEvacuees;

      const dist = distanceMatrix[origin.id]?.[targetShelter.id] || 35;
      const adjustedSpeed = Math.max(10, avgSpeedKmh * origin.roadAccessScore * (1 - origin.hazardRisk * 0.3));
      const transitHours = round(dist / adjustedSpeed, 2);

      const safetyScore = clamp(
        (1 - origin.hazardRisk * 0.5) * origin.roadAccessScore * (1 - targetShelter.hazardRisk * 0.4)
      );

      const bottleneckWarning = origin.roadAccessScore < 0.45 || allocatedEvacuees > 5000;

      results.push({
        fromNodeId: origin.id,
        toNodeId: targetShelter.id,
        evacueeCount: allocatedEvacuees,
        estimatedTransitHours: transitHours,
        safetyScore: round(safetyScore, 3),
        bottleneckWarning,
      });
    }

    return results;
  }
}
