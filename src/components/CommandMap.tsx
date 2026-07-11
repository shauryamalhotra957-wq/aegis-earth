import { useEffect, useMemo, useRef } from "react";
import { Crosshair, MapPin } from "lucide-react";
import type { Region, RiskScore } from "../types/domain";
import { percent } from "../engine/math";

interface CommandMapProps {
  regions: Region[];
  risks: RiskScore[];
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
}

const continentPolygons: Array<Array<[number, number]>> = [
  [
    [-165, 68],
    [-130, 72],
    [-60, 55],
    [-80, 25],
    [-110, 18],
    [-125, 40]
  ],
  [
    [-82, 13],
    [-50, 4],
    [-38, -22],
    [-64, -55],
    [-78, -18]
  ],
  [
    [-20, 36],
    [50, 72],
    [145, 58],
    [156, 18],
    [104, -8],
    [32, -3],
    [-14, 8]
  ],
  [
    [-18, 34],
    [45, 31],
    [50, -30],
    [18, -35],
    [-8, 5]
  ],
  [
    [105, 10],
    [156, 6],
    [152, -44],
    [113, -36]
  ],
  [
    [-180, -62],
    [180, -62],
    [180, -78],
    [-180, -78]
  ]
];

const project = (lon: number, lat: number, width: number, height: number) => ({
  x: ((lon + 180) / 360) * width,
  y: ((90 - lat) / 180) * height
});

export const CommandMap = ({
  regions,
  risks,
  selectedRegionId,
  onSelectRegion
}: CommandMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const riskByRegion = useMemo(() => new Map(risks.map((risk) => [risk.regionId, risk])), [risks]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    let frame = 0;
    let animation = 0;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const { width, height } = rect;
      context.clearRect(0, 0, width, height);

      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(0.42, "#122119");
      gradient.addColorStop(1, "#2b1f18");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      context.strokeStyle = "rgba(255,255,255,0.08)";
      context.lineWidth = 1;
      for (let lon = -150; lon <= 150; lon += 30) {
        const x = project(lon, 0, width, height).x;
        context.beginPath();
        context.moveTo(x, 18);
        context.lineTo(x, height - 18);
        context.stroke();
      }
      for (let lat = -60; lat <= 60; lat += 30) {
        const y = project(0, lat, width, height).y;
        context.beginPath();
        context.moveTo(18, y);
        context.lineTo(width - 18, y);
        context.stroke();
      }

      context.fillStyle = "rgba(226,232,240,0.16)";
      context.strokeStyle = "rgba(226,232,240,0.22)";
      continentPolygons.forEach((polygon) => {
        context.beginPath();
        polygon.forEach(([lon, lat], index) => {
          const point = project(lon, lat, width, height);
          if (index === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        });
        context.closePath();
        context.fill();
        context.stroke();
      });

      regions.forEach((region) => {
        const risk = riskByRegion.get(region.id)?.totalRisk ?? 0;
        const point = project(region.lon, region.lat, width, height);
        const pulse = Math.sin(frame / 18 + risk * Math.PI) * 0.5 + 0.5;
        const radius = 12 + risk * 28 + pulse * 8;
        const color =
          risk > 0.72
            ? "239,68,68"
            : risk > 0.58
              ? "245,158,11"
              : risk > 0.44
                ? "59,130,246"
                : "34,197,94";
        const radial = context.createRadialGradient(point.x, point.y, 2, point.x, point.y, radius);
        radial.addColorStop(0, `rgba(${color},0.72)`);
        radial.addColorStop(0.45, `rgba(${color},0.24)`);
        radial.addColorStop(1, `rgba(${color},0)`);
        context.fillStyle = radial;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = selectedRegionId === region.id ? "#f8fafc" : `rgb(${color})`;
        context.beginPath();
        context.arc(point.x, point.y, selectedRegionId === region.id ? 5 : 3.5, 0, Math.PI * 2);
        context.fill();
      });

      frame += 1;
      animation = window.requestAnimationFrame(draw);
    };

    draw();
    return () => window.cancelAnimationFrame(animation);
  }, [regions, riskByRegion, selectedRegionId]);

  return (
    <section className="panel map-panel">
      <div className="panel-title">
        <div>
          <p className="eyebrow">Global operations layer</p>
          <h2>Planetary Risk Map</h2>
        </div>
        <span className="status-pill">
          <Crosshair size={14} aria-hidden="true" /> live model
        </span>
      </div>
      <div className="map-stage">
        <canvas ref={canvasRef} aria-label="Animated world risk map" />
        {regions.map((region) => {
          const risk = riskByRegion.get(region.id)?.totalRisk ?? 0;
          const style = {
            left: `${((region.lon + 180) / 360) * 100}%`,
            top: `${((90 - region.lat) / 180) * 100}%`
          };
          return (
            <button
              key={region.id}
              className={`map-marker ${selectedRegionId === region.id ? "is-selected" : ""}`}
              data-region-id={region.id}
              data-testid={`map-marker-${region.id}`}
              style={style}
              type="button"
              onClick={() => onSelectRegion(region.id)}
              title={`${region.name}: ${percent(risk)}% risk`}
            >
              <MapPin size={15} aria-hidden="true" />
              <span>{percent(risk)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
