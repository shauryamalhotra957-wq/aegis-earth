# Architecture

## Layers

1. `src/data` contains synthetic regions, signals, logistics hubs, and resource units.
2. `src/engine` contains deterministic decision logic:
   - `riskEngine.ts` computes regional risk and explainable drivers.
   - `signalEngine.ts` scores report trust and deduplicates pressure.
   - `optimizer.ts` ranks interventions and allocates constrained resources.
   - `scenario.ts` simulates the next 72 hours under selected interventions.
   - `safety.ts` validates and sanitizes user-provided scenario values.
3. `src/components` renders the command center: map, panels, scenario lab, signal board, timeline, and exportable brief.
4. `src/hooks` handles optional live feeds and local persistence.

## Design Principles

- Decisions are explainable. Every ranked action includes a rationale and dominant drivers.
- Safety beats spectacle. Demo data is labelled synthetic and text is escaped before export.
- Offline first. The command center works without network data.
- Optional live feeds degrade gracefully. Failed network calls do not break the product.
- Tests cover the highest-risk logic: scoring, allocation, simulation, and sanitization.
