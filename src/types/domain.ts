export type HazardKind =
  | "wildfire"
  | "flood"
  | "heat"
  | "storm"
  | "quake"
  | "health"
  | "infrastructure";

export type SignalChannel =
  | "satellite"
  | "weather"
  | "responder"
  | "hospital"
  | "social"
  | "infrastructure"
  | "simulation";

export type ResourceKind =
  | "medical"
  | "evacuation"
  | "shelter"
  | "power"
  | "water"
  | "comms"
  | "air";

export type ScenarioMode = "baseline" | "surge" | "shock";

export type HazardProfile = Record<HazardKind, number>;

export interface InfrastructureProfile {
  hospitalBedsPer10k: number;
  shelterCapacityPer10k: number;
  powerReliability: number;
  waterReliability: number;
  roadAccess: number;
  commsReliability: number;
}

export interface Region {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  population: number;
  vulnerability: number;
  governanceReadiness: number;
  hazards: HazardProfile;
  infrastructure: InfrastructureProfile;
  notes: string;
}

export interface CrisisSignal {
  id: string;
  regionId: string;
  channel: SignalChannel;
  title: string;
  text: string;
  severity: number;
  confidence: number;
  timestamp: string;
  tags: HazardKind[];
  sourceUrl?: string;
}

export interface ScoredSignal extends CrisisSignal {
  trustScore: number;
  ageHours: number;
  signalWeight: number;
  reasons: string[];
}

export interface ResourceUnit {
  id: string;
  label: string;
  kind: ResourceKind;
  units: number;
  capacity: number;
  speed: number;
  cost: number;
  scarcity: number;
  effects: Partial<Record<HazardKind, number>>;
  equityBoost: number;
}

export interface LogisticsHub {
  id: string;
  name: string;
  lat: number;
  lon: number;
  readiness: number;
}

export interface RiskScore {
  regionId: string;
  baseHazard: number;
  signalPressure: number;
  exposure: number;
  infrastructureFragility: number;
  equityNeed: number;
  cascadeRisk: number;
  totalRisk: number;
  confidence: number;
  drivers: string[];
}

export interface Intervention {
  id: string;
  regionId: string;
  resourceId: string;
  resourceLabel: string;
  resourceKind: ResourceKind;
  impact: number;
  cost: number;
  fairness: number;
  timeToEffect: number;
  score: number;
  rationale: string;
}

export interface OptimizationOptions {
  budget: number;
  maxTeams: number;
  ethicalFloor: number;
  mode: ScenarioMode;
}

export interface OptimizationResult {
  selected: Intervention[];
  rejected: Intervention[];
  budgetUsed: number;
  expectedRiskReduction: number;
  fairnessCoverage: number;
  bindingConstraint: string;
}

export interface ScenarioControls extends OptimizationOptions {
  climateStress: number;
  infrastructureShock: number;
  publicTrust: number;
}

export interface ScenarioStep {
  hour: number;
  livesProtected: number;
  peopleSheltered: number;
  systemsRestored: number;
  unmetNeed: number;
  riskReduced: number;
}

export interface ScenarioResult {
  steps: ScenarioStep[];
  final: ScenarioStep;
  narrative: string[];
}

export interface ExecutiveBrief {
  generatedAt: string;
  headline: string;
  topRisks: RiskScore[];
  plan: OptimizationResult;
  scenario: ScenarioResult;
}
