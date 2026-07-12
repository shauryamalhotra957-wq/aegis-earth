import { ArrowRight, Eye, HeartPulse, Send, ShieldCheck } from "lucide-react";
import { percent } from "../engine/math";
import type { Intervention, Region, RiskScore, ScenarioResult } from "../types/domain";

interface DecisionBriefProps {
  selectedRegion: Region;
  selectedRisk: RiskScore;
  primaryAction?: Intervention;
  scenario: ScenarioResult;
  advanced: boolean;
  onToggleAdvanced: () => void;
}

export const DecisionBrief = ({
  selectedRegion,
  selectedRisk,
  primaryAction,
  scenario,
  advanced,
  onToggleAdvanced
}: DecisionBriefProps) => (
  <section className="decision-brief" aria-label="Decision brief">
    <div className="brief-lead">
      <p className="eyebrow">Decision brief</p>
      <h2>{selectedRegion.name}</h2>
      <span>{selectedRegion.notes}</span>
    </div>

    <div className="brief-step">
      <Eye size={18} aria-hidden="true" />
      <div>
        <span>Watch</span>
        <strong>{percent(selectedRisk.totalRisk)}% risk</strong>
      </div>
    </div>

    <ArrowRight className="brief-arrow" size={18} aria-hidden="true" />

    <div className="brief-step">
      <Send size={18} aria-hidden="true" />
      <div>
        <span>Send</span>
        <strong>{primaryAction?.resourceLabel ?? "Hold response reserve"}</strong>
      </div>
    </div>

    <ArrowRight className="brief-arrow" size={18} aria-hidden="true" />

    <div className="brief-step">
      <HeartPulse size={18} aria-hidden="true" />
      <div>
        <span>Protect</span>
        <strong>{scenario.final.livesProtected.toLocaleString()} people</strong>
      </div>
    </div>

    <button className="brief-toggle" type="button" onClick={onToggleAdvanced}>
      <ShieldCheck size={17} aria-hidden="true" />
      {advanced ? "Focus" : "Full details"}
    </button>
  </section>
);
