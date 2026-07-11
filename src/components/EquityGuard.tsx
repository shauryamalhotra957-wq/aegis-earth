import { Scale } from "lucide-react";
import type { OptimizationResult, Region, RiskScore } from "../types/domain";
import { percent } from "../engine/math";

interface EquityGuardProps {
  regions: Region[];
  risks: RiskScore[];
  plan: OptimizationResult;
}

export const EquityGuard = ({ regions, risks, plan }: EquityGuardProps) => {
  const riskMap = new Map(risks.map((risk) => [risk.regionId, risk]));
  const coverage = regions
    .map((region) => {
      const planned = plan.selected.filter((action) => action.regionId === region.id);
      const coverageScore = Math.min(
        1,
        planned.reduce((sum, action) => sum + action.impact * action.fairness, 0)
      );
      return {
        region,
        coverageScore,
        risk: riskMap.get(region.id)?.totalRisk ?? 0
      };
    })
    .sort((a, b) => b.region.vulnerability * b.risk - a.region.vulnerability * a.risk)
    .slice(0, 5);

  return (
    <section className="panel equity-panel">
      <div className="panel-title compact">
        <div>
          <p className="eyebrow">Guardrail</p>
          <h2>Equity Check</h2>
        </div>
        <Scale size={18} aria-hidden="true" />
      </div>
      <div className="equity-list">
        {coverage.map(({ region, coverageScore, risk }) => (
          <div className="equity-row" key={region.id}>
            <span>{region.name}</span>
            <div className="bar-track">
              <i style={{ width: `${percent(coverageScore)}%` }} />
            </div>
            <strong>{percent(region.vulnerability * risk)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};
