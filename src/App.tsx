import { useMemo, useState } from "react";
import {
  Activity,
  AlertOctagon,
  Globe2,
  HeartPulse,
  LayoutDashboard,
  ListFilter,
  Shield,
  UsersRound
} from "lucide-react";
import { CommandMap } from "./components/CommandMap";
import { DecisionBrief } from "./components/DecisionBrief";
import { EquityGuard } from "./components/EquityGuard";
import { IntelPanel } from "./components/IntelPanel";
import { MetricTile } from "./components/MetricTile";
import { MissionTimeline } from "./components/MissionTimeline";
import { RegionRoster } from "./components/RegionRoster";
import { ResourceBoard } from "./components/ResourceBoard";
import { ScenarioLab } from "./components/ScenarioLab";
import { SignalBoard } from "./components/SignalBoard";
import { logisticsHubs, regions, resources, signals } from "./data/seed";
import { buildExecutiveBrief } from "./engine/brief";
import { createDownload, sanitizeScenarioControls } from "./engine/safety";
import { optimizeResponse } from "./engine/optimizer";
import { percent } from "./engine/math";
import { scoreRegions } from "./engine/riskEngine";
import { scoreSignals } from "./engine/signalEngine";
import { simulateScenario } from "./engine/scenario";
import { useLiveSignals } from "./hooks/useLiveSignals";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { ExecutiveBrief, ScenarioControls } from "./types/domain";
import "./styles.css";

const defaultControls: ScenarioControls = {
  budget: 520,
  maxTeams: 8,
  ethicalFloor: 0.62,
  climateStress: 0.48,
  infrastructureShock: 0.34,
  publicTrust: 0.68,
  mode: "surge"
};

const average = (values: number[]) =>
  values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;

type ViewMode = "focus" | "full";

export default function App() {
  const [controls, setControls] = useLocalStorage<ScenarioControls>(
    "aegis-earth-controls",
    defaultControls
  );
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>("aegis-earth-view-mode", "focus");
  const [selectedRegionId, setSelectedRegionId] = useState(regions[1].id);
  const live = useLiveSignals();

  const safeControls = useMemo(() => sanitizeScenarioControls(controls), [controls]);
  const allSignals = useMemo(() => [...signals, ...live.signals], [live.signals]);
  const scoredSignals = useMemo(() => scoreSignals(allSignals), [allSignals]);
  const risks = useMemo(() => scoreRegions(regions, scoredSignals), [scoredSignals]);
  const plan = useMemo(
    () => optimizeResponse(regions, allSignals, resources, logisticsHubs, safeControls),
    [allSignals, safeControls]
  );
  const scenario = useMemo(
    () => simulateScenario(regions, allSignals, resources, logisticsHubs, safeControls),
    [allSignals, safeControls]
  );

  const selectedRegion =
    regions.find((region) => region.id === selectedRegionId) ??
    regions.find((region) => region.id === risks[0]?.regionId) ??
    regions[0];
  const selectedRisk =
    risks.find((risk) => risk.regionId === selectedRegion.id) ?? risks[0];
  const globalReadiness = average(risks.map((risk) => risk.confidence));
  const globalRisk = average(risks.map((risk) => risk.totalRisk));
  const selectedActions = plan.selected.filter((action) => action.regionId === selectedRegion.id);
  const primaryAction = selectedActions[0] ?? plan.selected[0];
  const isFullView = viewMode === "full";

  const exportBrief = () => {
    const brief: ExecutiveBrief = {
      generatedAt: new Date().toISOString(),
      headline: `${selectedRegion.name} is the active watch focus; ${plan.selected.length} missions reduce projected 72-hour risk by ${percent(
        scenario.final.riskReduced
      )}%.`,
      topRisks: risks,
      plan,
      scenario
    };
    createDownload("aegis-earth-brief.md", buildExecutiveBrief(brief, regions));
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <Shield size={23} aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">Aegis Earth</p>
            <h1>Resilience Command Center</h1>
          </div>
        </div>
        <div className="topbar-actions">
          <div className="view-switch" aria-label="View mode">
            <button
              className={!isFullView ? "is-active" : ""}
              type="button"
              onClick={() => setViewMode("focus")}
            >
              <ListFilter size={15} aria-hidden="true" />
              Focus
            </button>
            <button
              className={isFullView ? "is-active" : ""}
              type="button"
              onClick={() => setViewMode("full")}
            >
              <LayoutDashboard size={15} aria-hidden="true" />
              Full
            </button>
          </div>
          <span className="system-badge">synthetic demo data</span>
          <span className="system-badge strong">AI decision engine online</span>
        </div>
      </header>

      <DecisionBrief
        selectedRegion={selectedRegion}
        selectedRisk={selectedRisk}
        primaryAction={primaryAction}
        scenario={scenario}
        advanced={isFullView}
        onToggleAdvanced={() => setViewMode(isFullView ? "focus" : "full")}
      />

      <section className="metrics-grid" aria-label="Global metrics">
        <MetricTile
          label="Global Risk"
          value={`${percent(globalRisk)}%`}
          detail="weighted across regions"
          icon={Globe2}
          tone="red"
        />
        <MetricTile
          label="Decision Confidence"
          value={`${percent(globalReadiness)}%`}
          detail="signal and data quality"
          icon={Activity}
          tone="green"
        />
        <MetricTile
          label="Missions"
          value={String(plan.selected.length)}
          detail={`${plan.budgetUsed} credits committed`}
          icon={AlertOctagon}
          tone="amber"
        />
        <MetricTile
          label="Lives Protected"
          value={scenario.final.livesProtected.toLocaleString()}
          detail="72-hour projection"
          icon={HeartPulse}
          tone="violet"
        />
        {isFullView && (
          <MetricTile
            label="Sheltered"
            value={scenario.final.peopleSheltered.toLocaleString()}
            detail="evacuated or stabilized"
            icon={UsersRound}
            tone="blue"
          />
        )}
      </section>

      <section className={`operations-grid ${isFullView ? "is-full" : "is-focus"}`}>
        <div className="left-column">
          <RegionRoster
            regions={regions}
            risks={risks}
            selectedRegionId={selectedRegion.id}
            onSelectRegion={setSelectedRegionId}
          />
          {isFullView && <ResourceBoard plan={plan} />}
        </div>

        <div className="center-column">
          <CommandMap
            regions={regions}
            risks={risks}
            selectedRegionId={selectedRegion.id}
            onSelectRegion={setSelectedRegionId}
          />
          <ScenarioLab controls={safeControls} setControls={setControls} result={scenario} />
        </div>

        <div className="right-column">
          <IntelPanel
            selectedRegion={selectedRegion}
            selectedRisk={selectedRisk}
            plan={plan}
            onExportBrief={exportBrief}
          />
          {isFullView && (
            <SignalBoard
              signals={scoredSignals}
              selectedRegion={selectedRegion}
              liveStatus={live.status}
              liveMessage={live.message}
              onRefreshLive={() => live.refresh(selectedRegion)}
            />
          )}
        </div>
      </section>

      {isFullView && (
        <section className="bottom-grid">
          <MissionTimeline result={scenario} />
          <EquityGuard regions={regions} risks={risks} plan={plan} />
        </section>
      )}

      <footer>
        Research demo. Not an official emergency system. Use verified local authorities for real crises.
      </footer>
    </main>
  );
}
