import { Boxes, Zap } from "lucide-react";
import type { OptimizationResult } from "../types/domain";
import { percent } from "../engine/math";

export const ResourceBoard = ({ plan }: { plan: OptimizationResult }) => (
  <section className="panel resource-panel">
    <div className="panel-title compact">
      <div>
        <p className="eyebrow">Allocation</p>
        <h2>Resource Stack</h2>
      </div>
      <Boxes size={18} aria-hidden="true" />
    </div>
    <div className="resource-summary">
      <div>
        <span>Budget used</span>
        <strong>{plan.budgetUsed}</strong>
      </div>
      <div>
        <span>Expected reduction</span>
        <strong>{percent(plan.expectedRiskReduction)}%</strong>
      </div>
      <div>
        <span>Fairness coverage</span>
        <strong>{percent(plan.fairnessCoverage)}%</strong>
      </div>
    </div>
    <div className="resource-list">
      {plan.selected.slice(0, 7).map((action) => (
        <article key={action.id}>
          <Zap size={15} aria-hidden="true" />
          <div>
            <strong>{action.resourceLabel}</strong>
            <span>{action.resourceKind} / score {action.score.toFixed(2)}</span>
          </div>
          <b>{action.cost}</b>
        </article>
      ))}
    </div>
  </section>
);
