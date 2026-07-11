import type { ExecutiveBrief, Region } from "../types/domain";
import { percent } from "./math";
import { escapeHtml } from "./safety";

export const buildExecutiveBrief = (brief: ExecutiveBrief, regions: Region[]): string => {
  const regionName = (regionId: string) =>
    regions.find((region) => region.id === regionId)?.name ?? regionId;
  const topRisks = brief.topRisks
    .slice(0, 5)
    .map(
      (risk, index) =>
        `${index + 1}. ${escapeHtml(regionName(risk.regionId))} - ${percent(
          risk.totalRisk
        )}% risk, ${percent(risk.confidence)}% confidence. Drivers: ${risk.drivers
          .slice(0, 3)
          .map(escapeHtml)
          .join(", ")}.`
    )
    .join("\n");
  const actions = brief.plan.selected
    .slice(0, 8)
    .map(
      (action, index) =>
        `${index + 1}. ${escapeHtml(action.resourceLabel)} to ${escapeHtml(
          regionName(action.regionId)
        )}: impact ${percent(action.impact)}%, ETA ${action.timeToEffect}h, cost ${action.cost}.`
    )
    .join("\n");
  const narrative = brief.scenario.narrative.map(escapeHtml).join("\n");

  return `# Aegis Earth Executive Brief

Generated: ${escapeHtml(brief.generatedAt)}

## Headline

${escapeHtml(brief.headline)}

## Top Risks

${topRisks}

## Recommended Actions

${actions}

## 72-Hour Projection

- Lives protected: ${brief.scenario.final.livesProtected.toLocaleString()}
- People sheltered or evacuated: ${brief.scenario.final.peopleSheltered.toLocaleString()}
- Systems restored: ${percent(brief.scenario.final.systemsRestored)}%
- Remaining unmet need: ${percent(brief.scenario.final.unmetNeed)}%

${narrative}

## Safety

This is a research demo using synthetic data and optional public alert feeds. Use official emergency channels for real crises.
`;
};
