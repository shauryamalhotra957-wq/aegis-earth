import type { CrisisSignal, LogisticsHub, Region, ResourceUnit } from "../types/domain";

export const regions: Region[] = [
  {
    id: "la-basin",
    name: "Los Angeles Basin",
    country: "United States",
    lat: 34.05,
    lon: -118.24,
    population: 12900000,
    vulnerability: 0.58,
    governanceReadiness: 0.72,
    hazards: {
      wildfire: 0.86,
      flood: 0.34,
      heat: 0.78,
      storm: 0.38,
      quake: 0.71,
      health: 0.43,
      infrastructure: 0.62
    },
    infrastructure: {
      hospitalBedsPer10k: 18,
      shelterCapacityPer10k: 34,
      powerReliability: 0.71,
      waterReliability: 0.68,
      roadAccess: 0.74,
      commsReliability: 0.82
    },
    notes: "Dense evacuation demand, wildfire edge growth, and water stress create compound risk."
  },
  {
    id: "ganges-delta",
    name: "Ganges Delta",
    country: "Bangladesh / India",
    lat: 22.5,
    lon: 89.5,
    population: 104000000,
    vulnerability: 0.83,
    governanceReadiness: 0.61,
    hazards: {
      wildfire: 0.08,
      flood: 0.93,
      heat: 0.81,
      storm: 0.88,
      quake: 0.36,
      health: 0.66,
      infrastructure: 0.74
    },
    infrastructure: {
      hospitalBedsPer10k: 8,
      shelterCapacityPer10k: 41,
      powerReliability: 0.57,
      waterReliability: 0.52,
      roadAccess: 0.49,
      commsReliability: 0.63
    },
    notes: "Cyclone surge, high population exposure, and medical scarcity demand early triage."
  },
  {
    id: "lagos-coast",
    name: "Lagos Coast",
    country: "Nigeria",
    lat: 6.52,
    lon: 3.38,
    population: 21100000,
    vulnerability: 0.74,
    governanceReadiness: 0.52,
    hazards: {
      wildfire: 0.16,
      flood: 0.84,
      heat: 0.72,
      storm: 0.69,
      quake: 0.08,
      health: 0.71,
      infrastructure: 0.79
    },
    infrastructure: {
      hospitalBedsPer10k: 5,
      shelterCapacityPer10k: 18,
      powerReliability: 0.42,
      waterReliability: 0.46,
      roadAccess: 0.52,
      commsReliability: 0.68
    },
    notes: "Coastal flooding and power instability can cascade into hospital surge risk."
  },
  {
    id: "sao-paulo-corridor",
    name: "Sao Paulo Corridor",
    country: "Brazil",
    lat: -23.55,
    lon: -46.63,
    population: 22400000,
    vulnerability: 0.56,
    governanceReadiness: 0.67,
    hazards: {
      wildfire: 0.41,
      flood: 0.63,
      heat: 0.66,
      storm: 0.53,
      quake: 0.05,
      health: 0.52,
      infrastructure: 0.59
    },
    infrastructure: {
      hospitalBedsPer10k: 21,
      shelterCapacityPer10k: 29,
      powerReliability: 0.69,
      waterReliability: 0.63,
      roadAccess: 0.71,
      commsReliability: 0.79
    },
    notes: "Flooding and heat hazards threaten dense industrial and transit corridors."
  },
  {
    id: "manila-bay",
    name: "Manila Bay",
    country: "Philippines",
    lat: 14.6,
    lon: 120.98,
    population: 24700000,
    vulnerability: 0.71,
    governanceReadiness: 0.64,
    hazards: {
      wildfire: 0.13,
      flood: 0.86,
      heat: 0.73,
      storm: 0.92,
      quake: 0.62,
      health: 0.58,
      infrastructure: 0.68
    },
    infrastructure: {
      hospitalBedsPer10k: 11,
      shelterCapacityPer10k: 37,
      powerReliability: 0.62,
      waterReliability: 0.58,
      roadAccess: 0.55,
      commsReliability: 0.73
    },
    notes: "Typhoon exposure and earthquake risk require flexible shelter and comms staging."
  },
  {
    id: "nile-cairo",
    name: "Greater Cairo",
    country: "Egypt",
    lat: 30.04,
    lon: 31.24,
    population: 22100000,
    vulnerability: 0.62,
    governanceReadiness: 0.59,
    hazards: {
      wildfire: 0.12,
      flood: 0.36,
      heat: 0.91,
      storm: 0.21,
      quake: 0.31,
      health: 0.64,
      infrastructure: 0.66
    },
    infrastructure: {
      hospitalBedsPer10k: 14,
      shelterCapacityPer10k: 21,
      powerReliability: 0.64,
      waterReliability: 0.61,
      roadAccess: 0.58,
      commsReliability: 0.75
    },
    notes: "Extreme heat and water constraints create chronic health-system pressure."
  },
  {
    id: "rhine-ruhr",
    name: "Rhine-Ruhr",
    country: "Germany",
    lat: 51.43,
    lon: 7.66,
    population: 10100000,
    vulnerability: 0.34,
    governanceReadiness: 0.86,
    hazards: {
      wildfire: 0.31,
      flood: 0.69,
      heat: 0.57,
      storm: 0.46,
      quake: 0.12,
      health: 0.34,
      infrastructure: 0.38
    },
    infrastructure: {
      hospitalBedsPer10k: 77,
      shelterCapacityPer10k: 44,
      powerReliability: 0.86,
      waterReliability: 0.83,
      roadAccess: 0.88,
      commsReliability: 0.9
    },
    notes: "High readiness lowers fragility, but floods can disrupt industrial supply chains."
  },
  {
    id: "jakarta-coast",
    name: "Jakarta Coast",
    country: "Indonesia",
    lat: -6.2,
    lon: 106.82,
    population: 33700000,
    vulnerability: 0.77,
    governanceReadiness: 0.58,
    hazards: {
      wildfire: 0.23,
      flood: 0.91,
      heat: 0.79,
      storm: 0.66,
      quake: 0.67,
      health: 0.63,
      infrastructure: 0.76
    },
    infrastructure: {
      hospitalBedsPer10k: 12,
      shelterCapacityPer10k: 23,
      powerReliability: 0.55,
      waterReliability: 0.5,
      roadAccess: 0.48,
      commsReliability: 0.69
    },
    notes: "Flooding, subsidence, and road access constraints intensify evacuation complexity."
  }
];

export const signals: CrisisSignal[] = [
  {
    id: "sig-001",
    regionId: "ganges-delta",
    channel: "weather",
    title: "Storm surge cone expanded",
    text: "Forecast ensembles show surge risk expanding inland, with schools and clinics inside the updated exposure band.",
    severity: 0.92,
    confidence: 0.86,
    timestamp: "2026-07-11T21:00:00.000Z",
    tags: ["storm", "flood"]
  },
  {
    id: "sig-002",
    regionId: "la-basin",
    channel: "satellite",
    title: "Thermal anomalies near wildland edge",
    text: "Remote sensing flags clustered heat anomalies north of the basin and increased dry lightning probability.",
    severity: 0.84,
    confidence: 0.78,
    timestamp: "2026-07-11T22:20:00.000Z",
    tags: ["wildfire", "infrastructure"]
  },
  {
    id: "sig-003",
    regionId: "lagos-coast",
    channel: "hospital",
    title: "Emergency departments at surge threshold",
    text: "Three hospitals report generator fuel below 36 hours and rising respiratory cases after stagnant flood water.",
    severity: 0.88,
    confidence: 0.74,
    timestamp: "2026-07-11T20:30:00.000Z",
    tags: ["health", "flood", "infrastructure"]
  },
  {
    id: "sig-004",
    regionId: "jakarta-coast",
    channel: "responder",
    title: "Arterial road closures",
    text: "Field teams report two evacuation corridors blocked by water depth and stalled vehicles.",
    severity: 0.81,
    confidence: 0.8,
    timestamp: "2026-07-11T19:10:00.000Z",
    tags: ["flood", "infrastructure"]
  },
  {
    id: "sig-005",
    regionId: "manila-bay",
    channel: "weather",
    title: "Rapid intensification watch",
    text: "Ocean heat content and pressure drop support elevated typhoon intensification risk before landfall.",
    severity: 0.9,
    confidence: 0.82,
    timestamp: "2026-07-11T18:40:00.000Z",
    tags: ["storm", "flood"]
  },
  {
    id: "sig-006",
    regionId: "nile-cairo",
    channel: "infrastructure",
    title: "Water pressure disruptions",
    text: "Utility telemetry shows low pressure events near heat-vulnerable districts and backup pump maintenance delays.",
    severity: 0.67,
    confidence: 0.68,
    timestamp: "2026-07-11T17:00:00.000Z",
    tags: ["heat", "health", "infrastructure"]
  },
  {
    id: "sig-007",
    regionId: "sao-paulo-corridor",
    channel: "responder",
    title: "Transit underpass flooding",
    text: "Municipal teams report multiple underpasses impassable and a delayed bus evacuation route.",
    severity: 0.62,
    confidence: 0.71,
    timestamp: "2026-07-11T16:15:00.000Z",
    tags: ["flood", "infrastructure"]
  },
  {
    id: "sig-008",
    regionId: "rhine-ruhr",
    channel: "weather",
    title: "River crest uncertainty",
    text: "Hydrological ensemble spread widened; industrial zones downstream remain sensitive if rainfall persists.",
    severity: 0.58,
    confidence: 0.76,
    timestamp: "2026-07-11T15:20:00.000Z",
    tags: ["flood", "infrastructure"]
  },
  {
    id: "sig-009",
    regionId: "ganges-delta",
    channel: "social",
    title: "Shelter rumor spike",
    text: "Unverified posts claim two shelters are full; responder cross-check requested before rerouting families.",
    severity: 0.55,
    confidence: 0.42,
    timestamp: "2026-07-11T22:50:00.000Z",
    tags: ["storm", "flood"]
  },
  {
    id: "sig-010",
    regionId: "la-basin",
    channel: "infrastructure",
    title: "Transmission line watch",
    text: "Grid operator flags a vulnerable segment where wind, heat, and access limits could delay repair crews.",
    severity: 0.7,
    confidence: 0.69,
    timestamp: "2026-07-11T21:50:00.000Z",
    tags: ["wildfire", "infrastructure"]
  }
];

export const resources: ResourceUnit[] = [
  {
    id: "med-surge-1",
    label: "Mobile Critical Care Unit",
    kind: "medical",
    units: 4,
    capacity: 0.83,
    speed: 0.62,
    cost: 118,
    scarcity: 0.82,
    effects: { health: 0.92, heat: 0.54, flood: 0.32 },
    equityBoost: 0.18
  },
  {
    id: "evac-amphib-1",
    label: "Amphibious Evacuation Fleet",
    kind: "evacuation",
    units: 6,
    capacity: 0.78,
    speed: 0.71,
    cost: 104,
    scarcity: 0.68,
    effects: { flood: 0.88, storm: 0.72, infrastructure: 0.44 },
    equityBoost: 0.2
  },
  {
    id: "shelter-kit-1",
    label: "Rapid Shelter Spine",
    kind: "shelter",
    units: 8,
    capacity: 0.72,
    speed: 0.67,
    cost: 76,
    scarcity: 0.44,
    effects: { storm: 0.58, flood: 0.55, health: 0.36, heat: 0.41 },
    equityBoost: 0.24
  },
  {
    id: "microgrid-1",
    label: "Container Microgrid",
    kind: "power",
    units: 5,
    capacity: 0.74,
    speed: 0.55,
    cost: 96,
    scarcity: 0.57,
    effects: { infrastructure: 0.86, health: 0.42, heat: 0.28 },
    equityBoost: 0.1
  },
  {
    id: "water-lab-1",
    label: "Water Purification Lab",
    kind: "water",
    units: 5,
    capacity: 0.69,
    speed: 0.6,
    cost: 88,
    scarcity: 0.51,
    effects: { health: 0.64, flood: 0.46, heat: 0.5, infrastructure: 0.34 },
    equityBoost: 0.22
  },
  {
    id: "mesh-comms-1",
    label: "Mesh Comms Backbone",
    kind: "comms",
    units: 7,
    capacity: 0.66,
    speed: 0.84,
    cost: 54,
    scarcity: 0.36,
    effects: { infrastructure: 0.58, storm: 0.36, quake: 0.46, wildfire: 0.31 },
    equityBoost: 0.14
  },
  {
    id: "air-recon-1",
    label: "Aerial Recon Swarm",
    kind: "air",
    units: 5,
    capacity: 0.61,
    speed: 0.92,
    cost: 82,
    scarcity: 0.62,
    effects: { wildfire: 0.82, flood: 0.54, quake: 0.38, storm: 0.42 },
    equityBoost: 0.08
  }
];

export const logisticsHubs: LogisticsHub[] = [
  { id: "hub-denver", name: "Denver Resilience Hub", lat: 39.74, lon: -104.99, readiness: 0.78 },
  { id: "hub-dubai", name: "Dubai Global Logistics", lat: 25.2, lon: 55.27, readiness: 0.82 },
  { id: "hub-singapore", name: "Singapore Humanitarian Stack", lat: 1.35, lon: 103.82, readiness: 0.86 },
  { id: "hub-rotterdam", name: "Rotterdam Flood Systems", lat: 51.92, lon: 4.48, readiness: 0.81 },
  { id: "hub-sao-paulo", name: "Sao Paulo Response Grid", lat: -23.55, lon: -46.63, readiness: 0.7 }
];
