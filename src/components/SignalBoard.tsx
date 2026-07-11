import { AlertTriangle, CheckCircle2, ExternalLink, Radio } from "lucide-react";
import type { Region, ScoredSignal } from "../types/domain";
import { percent } from "../engine/math";

interface SignalBoardProps {
  signals: ScoredSignal[];
  selectedRegion: Region;
  liveStatus: string;
  liveMessage: string;
  onRefreshLive: () => void;
}

export const SignalBoard = ({
  signals,
  selectedRegion,
  liveStatus,
  liveMessage,
  onRefreshLive
}: SignalBoardProps) => {
  const regionalSignals = signals
    .filter((signal) => signal.regionId === selectedRegion.id)
    .slice(0, 5);
  const visible = regionalSignals.length > 0 ? regionalSignals : signals.slice(0, 5);

  return (
    <section className="panel signal-panel">
      <div className="panel-title">
        <div>
          <p className="eyebrow">Signal fusion</p>
          <h2>Trust Feed</h2>
        </div>
        <button
          className={`text-button ${liveStatus === "loading" ? "is-loading" : ""}`}
          type="button"
          onClick={onRefreshLive}
        >
          <Radio size={15} aria-hidden="true" />
          Refresh
        </button>
      </div>
      <p className="feed-message">{liveMessage}</p>
      <div className="signal-list">
        {visible.map((signal) => (
          <article className="signal-row" key={signal.id}>
            <div className="signal-icon">
              {signal.trustScore > 0.68 ? (
                <CheckCircle2 size={17} aria-hidden="true" />
              ) : (
                <AlertTriangle size={17} aria-hidden="true" />
              )}
            </div>
            <div>
              <strong>{signal.title}</strong>
              <span>{signal.text}</span>
              <small>
                {signal.channel} / trust {percent(signal.trustScore)}% / age {signal.ageHours}h
                {signal.sourceUrl ? (
                  <a href={signal.sourceUrl} target="_blank" rel="noreferrer" title="Open source">
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                ) : null}
              </small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
