import { Clock3 } from "lucide-react";
import type { ScenarioResult } from "../types/domain";
import { percent } from "../engine/math";

export const MissionTimeline = ({ result }: { result: ScenarioResult }) => (
  <section className="panel timeline-panel">
    <div className="panel-title compact">
      <div>
        <p className="eyebrow">Projection</p>
        <h2>Mission Clock</h2>
      </div>
      <Clock3 size={18} aria-hidden="true" />
    </div>
    <div className="timeline">
      {result.steps
        .filter((step) => step.hour % 12 === 0)
        .map((step) => (
          <div className="timeline-step" key={step.hour}>
            <span>{step.hour}h</span>
            <div className="bar-track">
              <i style={{ width: `${percent(step.riskReduced)}%` }} />
            </div>
            <strong>{percent(step.riskReduced)}%</strong>
          </div>
        ))}
    </div>
    <div className="narrative">
      {result.narrative.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  </section>
);
