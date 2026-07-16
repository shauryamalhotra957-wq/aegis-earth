import { useCallback, useEffect, useRef, useState } from "react";
import type { CrisisSignal, HazardKind, Region } from "../types/domain";

interface NwsAlertFeature {
  id: string;
  properties: {
    event?: string;
    headline?: string;
    description?: string;
    severity?: string;
    certainty?: string;
    sent?: string;
    uri?: string;
  };
}

interface NwsAlertResponse {
  features?: NwsAlertFeature[];
}

const severityMap: Record<string, number> = {
  Extreme: 0.96,
  Severe: 0.86,
  Moderate: 0.64,
  Minor: 0.42,
  Unknown: 0.38
};

const certaintyMap: Record<string, number> = {
  Observed: 0.9,
  Likely: 0.78,
  Possible: 0.56,
  Unlikely: 0.32,
  Unknown: 0.44
};

const tagsFromEvent = (event = ""): HazardKind[] => {
  const lower = event.toLowerCase();
  const tags = new Set<HazardKind>();
  if (lower.includes("fire") || lower.includes("red flag")) tags.add("wildfire");
  if (lower.includes("flood") || lower.includes("surge")) tags.add("flood");
  if (lower.includes("heat")) tags.add("heat");
  if (lower.includes("storm") || lower.includes("wind") || lower.includes("hurricane")) {
    tags.add("storm");
  }
  if (lower.includes("air") || lower.includes("health")) tags.add("health");
  if (tags.size === 0) tags.add("infrastructure");
  return Array.from(tags);
};

export const useLiveSignals = () => {
  const [signals, setSignals] = useState<CrisisSignal[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "unsupported" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("Local synthetic feed active");
  const latestRequestId = useRef(0);

  useEffect(
    () => () => {
      latestRequestId.current += 1;
    },
    []
  );

  const refresh = useCallback(async (region: Region) => {
    const requestId = ++latestRequestId.current;
    setSignals([]);
    if (!region.country.includes("United States")) {
      setStatus("unsupported");
      setMessage("NWS live alerts cover United States coordinates; local feed remains active.");
      return;
    }

    setStatus("loading");
    setMessage("Requesting NWS active alerts");
    try {
      const response = await fetch(
        `https://api.weather.gov/alerts/active?point=${region.lat.toFixed(4)},${region.lon.toFixed(4)}`,
        { headers: { Accept: "application/geo+json" } }
      );
      if (!response.ok) throw new Error(`NWS ${response.status}`);
      const payload = (await response.json()) as NwsAlertResponse;
      if (requestId !== latestRequestId.current) return;
      const converted =
        payload.features?.slice(0, 8).map((feature, index) => {
          const event = feature.properties.event ?? "Weather alert";
          return {
            id: `nws-${region.id}-${feature.id || index}`,
            regionId: region.id,
            channel: "weather" as const,
            title: feature.properties.headline ?? event,
            text: feature.properties.description ?? event,
            severity: severityMap[feature.properties.severity ?? "Unknown"] ?? 0.5,
            confidence: certaintyMap[feature.properties.certainty ?? "Unknown"] ?? 0.48,
            timestamp: feature.properties.sent ?? new Date().toISOString(),
            tags: tagsFromEvent(event),
            sourceUrl: feature.properties.uri
          };
        }) ?? [];
      setSignals(converted);
      setStatus("ready");
      setMessage(
        converted.length > 0
          ? `${converted.length} NWS alert${converted.length === 1 ? "" : "s"} merged`
          : "No active NWS alerts for this point"
      );
    } catch (error) {
      if (requestId !== latestRequestId.current) return;
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Live feed failed");
    }
  }, []);

  return { signals, status, message, refresh };
};
