import React from "react";
import { Navigation, AlertTriangle, ShieldCheck, Clock, Users, ArrowRight } from "lucide-react";
import { EvacuationRouter, type EvacuationNode, type EvacuationRouteResult } from "../engine/evacuationRouter";
import type { Region, LogisticsHub } from "../types/domain";

interface EvacuationPanelProps {
  regions: Region[];
  logisticsHubs: LogisticsHub[];
}

export const EvacuationPanel: React.FC<EvacuationPanelProps> = ({ regions, logisticsHubs }) => {
  const originNodes: EvacuationNode[] = regions.map((r) => ({
    id: r.id,
    name: r.name,
    population: r.population,
    hazardRisk: r.vulnerability,
    roadAccessScore: r.infrastructure.roadAccess,
    shelterCapacity: 5000,
    currentSheltered: 1200,
  }));

  const shelterNodes: EvacuationNode[] = logisticsHubs.map((h) => ({
    id: h.id,
    name: h.name,
    population: 0,
    hazardRisk: 0.1,
    roadAccessScore: 0.9,
    shelterCapacity: h.capacity || 25000,
    currentSheltered: 4000,
  }));

  const routes: EvacuationRouteResult[] = EvacuationRouter.planRoutes(originNodes, shelterNodes, 40);

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Dynamic Evacuation Corridors & Shelters</h3>
            <p className="text-xs text-slate-400">Hazard-weighted transit planning, bottleneck detection, and shelter staging.</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          {routes.length} Active Corridors
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routes.map((route, idx) => {
          const fromNode = originNodes.find((n) => n.id === route.fromNodeId);
          const toNode = shelterNodes.find((n) => n.id === route.toNodeId);

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border space-y-3 bg-slate-950/60 ${
                route.bottleneckWarning
                  ? "border-amber-500/40 hover:border-amber-500"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-white">
                  <span>{fromNode?.name || route.fromNodeId}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-cyan-300">{toNode?.name || route.toNodeId}</span>
                </div>
                {route.bottleneckWarning ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>Bottleneck Risk</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Corridor Clear</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-900">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Evacuees</span>
                  <span className="font-bold text-white flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-indigo-400 inline" />
                    <span>{route.evacueeCount.toLocaleString()}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Est. Transit</span>
                  <span className="font-bold text-slate-200 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 inline" />
                    <span>{route.estimatedTransitHours}h</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Safety Score</span>
                  <span className="font-bold text-emerald-400">{(route.safetyScore * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
