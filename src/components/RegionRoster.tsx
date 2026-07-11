import { ChevronRight } from "lucide-react";
import { percent } from "../engine/math";
import type { Region, RiskScore } from "../types/domain";

interface RegionRosterProps {
  regions: Region[];
  risks: RiskScore[];
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
}

export const RegionRoster = ({
  regions,
  risks,
  selectedRegionId,
  onSelectRegion
}: RegionRosterProps) => {
  const regionById = new Map(regions.map((region) => [region.id, region]));
  return (
    <section className="panel roster-panel">
      <div className="panel-title compact">
        <div>
          <p className="eyebrow">Triage</p>
          <h2>Regions</h2>
        </div>
      </div>
      <div className="roster-list">
        {risks.map((risk, index) => {
          const region = regionById.get(risk.regionId);
          if (!region) return null;
          return (
            <button
              key={region.id}
              className={`region-row ${selectedRegionId === region.id ? "is-active" : ""}`}
              data-region-id={region.id}
              data-testid={`region-row-${region.id}`}
              type="button"
              onClick={() => onSelectRegion(region.id)}
            >
              <span className="rank">{String(index + 1).padStart(2, "0")}</span>
              <span className="region-copy">
                <strong>{region.name}</strong>
                <small>{region.country}</small>
              </span>
              <span className="risk-chip">{percent(risk.totalRisk)}%</span>
              <ChevronRight size={15} aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </section>
  );
};
