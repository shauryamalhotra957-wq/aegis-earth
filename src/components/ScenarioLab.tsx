import { Activity, Gauge, RadioTower } from "lucide-react";
import type { ScenarioControls, ScenarioMode, ScenarioResult } from "../types/domain";
import { percent } from "../engine/math";

interface ScenarioLabProps {
  controls: ScenarioControls;
  setControls: (controls: ScenarioControls) => void;
  result: ScenarioResult;
}

const modes: Array<{ id: ScenarioMode; label: string }> = [
  { id: "baseline", label: "Baseline" },
  { id: "surge", label: "Surge" },
  { id: "shock", label: "Shock" }
];

export const ScenarioLab = ({ controls, setControls, result }: ScenarioLabProps) => {
  const setNumber = (key: keyof ScenarioControls, value: number) =>
    setControls({ ...controls, [key]: value });

  return (
    <section className="panel scenario-panel">
      <div className="panel-title">
        <div>
          <p className="eyebrow">72-hour model</p>
          <h2>Scenario Lab</h2>
        </div>
        <div className="segmented" aria-label="Scenario mode">
          {modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={controls.mode === mode.id ? "is-active" : ""}
              onClick={() => setControls({ ...controls, mode: mode.id })}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="slider-grid">
        <label>
          <span>
            <Gauge size={15} aria-hidden="true" /> Budget
          </span>
          <input
            type="range"
            min="120"
            max="900"
            step="10"
            value={controls.budget}
            onChange={(event) => setNumber("budget", Number(event.currentTarget.value))}
          />
          <strong>{controls.budget}</strong>
        </label>
        <label>
          <span>
            <Activity size={15} aria-hidden="true" /> Climate Stress
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={controls.climateStress}
            onChange={(event) => setNumber("climateStress", Number(event.currentTarget.value))}
          />
          <strong>{percent(controls.climateStress)}%</strong>
        </label>
        <label>
          <span>
            <RadioTower size={15} aria-hidden="true" /> Public Trust
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={controls.publicTrust}
            onChange={(event) => setNumber("publicTrust", Number(event.currentTarget.value))}
          />
          <strong>{percent(controls.publicTrust)}%</strong>
        </label>
      </div>

      <div className="scenario-stats">
        <div>
          <span>Lives protected</span>
          <strong>{result.final.livesProtected.toLocaleString()}</strong>
        </div>
        <div>
          <span>Sheltered</span>
          <strong>{result.final.peopleSheltered.toLocaleString()}</strong>
        </div>
        <div>
          <span>Risk reduced</span>
          <strong>{percent(result.final.riskReduced)}%</strong>
        </div>
        <div>
          <span>Unmet need</span>
          <strong>{percent(result.final.unmetNeed)}%</strong>
        </div>
      </div>
    </section>
  );
};
