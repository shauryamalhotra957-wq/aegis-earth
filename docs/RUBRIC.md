# Evaluation Rubric

Use this rubric to present or judge the project.

| Category | Evidence |
| --- | --- |
| Technical depth | Typed domain model, deterministic risk engine, optimizer, scenario simulator, tests |
| Real-world relevance | Disaster response, public-good framing, optional public alert feed |
| Explainability | Drivers, confidence, intervention rationale, equity coverage |
| Safety | Synthetic default data, no secrets, sanitized brief export, documented limitations |
| Product polish | Responsive command-center layout, map animation, icons, export flow, demo script |
| Verification | `npm test`, `npm run build`, `npm audit --audit-level=moderate` |

## Suggested Professor Questions

### How is risk calculated?

Risk combines base hazard, signal pressure, exposure, infrastructure fragility, equity need, and cascade risk. The weights are explicit in `src/engine/riskEngine.ts`.

### Why is the optimizer credible?

It generates candidate interventions, scores them by impact, speed, fairness, cost, and resource scarcity, then selects a plan under budget, team, and duplicate-resource constraints.

### How do you prevent hallucinated emergency claims?

The shipped dataset is synthetic and labelled. Optional live data is limited to public weather alerts and failure falls back to local synthetic signals. The UI and docs state that this is not an official emergency system.

### What would production need?

Verified agency feeds, identity, audit logs, role-based permissions, human approval gates, adversarial testing, and formal emergency-management validation.
