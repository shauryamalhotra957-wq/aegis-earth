import type { LucideIcon } from "lucide-react";

interface MetricTileProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "green" | "amber" | "red" | "blue" | "violet";
}

export const MetricTile = ({ label, value, detail, icon: Icon, tone = "blue" }: MetricTileProps) => (
  <section className={`metric metric-${tone}`}>
    <div className="metric-icon">
      <Icon size={18} aria-hidden="true" />
    </div>
    <div>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </div>
  </section>
);
