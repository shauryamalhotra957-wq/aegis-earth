import { BrainCircuit, Download, ShieldCheck } from "lucide-react";
import { percent } from "../engine/math";
import type { Intervention, OptimizationResult, Region, RiskScore } from "../types/domain";

interface IntelPanelProps {
  selectedRegion: Region;
  selectedRisk: RiskScore;
  plan: OptimizationResult;
  onExportBrief: () => void;
}

const ActionRow = ({ action }: { action: Intervention }) => (
  <article className="action-row">
    <div>
      <strong>{action.resourceLabel}</strong>
      <span>{action.rationale}</span>
    </div>
    <dl>
      <div>
        <dt>Impact</dt>
        <dd>{percent(action.impact)}%</dd>
      </div>
      <div>
        <dt>ETA</dt>
        <dd>{action.timeToEffect}h</dd>
      </div>
    </dl>
  </article>
);

export const IntelPanel = ({
  selectedRegion,
  selectedRisk,
  plan,
  onExportBrief
}: IntelPanelProps) => {
  const localActions = plan.selected.filter((action) => action.regionId === selectedRegion.id);
  const fallbackActions = plan.selected.slice(0, 3);
  const actions = localActions.length > 0 ? localActions : fallbackActions;

  return (
    <section className="panel intel-panel">
      <div className="panel-title">
        <div>
          <p className="eyebrow">Explainable AI cell</p>
          <h2>{selectedRegion.name}</h2>
        </div>
        <button className="icon-button" type="button" onClick={onExportBrief} title="Download brief">
          <Download size={17} aria-hidden="true" />
        </button>
      </div>

      <div className="risk-breakdown">
        {[
          ["Hazard", selectedRisk.baseHazard],
          ["Signals", selectedRisk.signalPressure],
          ["Exposure", selectedRisk.exposure],
          ["Infra", selectedRisk.infrastructureFragility],
          ["Equity", selectedRisk.equityNeed]
        ].map(([label, value]) => (
          <div className="bar-row" key={label as string}>
            <span>{label as string}</span>
            <div className="bar-track">
              <i style={{ width: `${percent(value as number)}%` }} />
            </div>
            <strong>{percent(value as number)}</strong>
          </div>
        ))}
      </div>

      <div className="driver-grid">
        {selectedRisk.drivers.slice(0, 4).map((driver) => (
          <span key={driver}>
            <BrainCircuit size={14} aria-hidden="true" />
            {driver}
          </span>
        ))}
      </div>

      <div className="action-stack">
        <div className="section-label">
          <ShieldCheck size={15} aria-hidden="true" />
          Mission picks
        </div>
        {actions.slice(0, 3).map((action) => (
          <ActionRow action={action} key={action.id} />
        ))}
      </div>
    </section>
  );
};
