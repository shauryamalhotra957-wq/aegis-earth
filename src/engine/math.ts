export const clamp = (value: number, min = 0, max = 1): number => {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
};

export const round = (value: number, decimals = 2): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

export const percent = (value: number): number => Math.round(clamp(value) * 100);

export const weightedAverage = (items: Array<[number, number]>): number => {
  const totalWeight = items.reduce((sum, [, weight]) => sum + weight, 0);
  if (totalWeight <= 0) return 0;
  return items.reduce((sum, [value, weight]) => sum + value * weight, 0) / totalWeight;
};

export const haversineKm = (
  a: { lat: number; lon: number },
  b: { lat: number; lon: number }
): number => {
  const radiusKm = 6371;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const latA = toRadians(a.lat);
  const latB = toRadians(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(latA) * Math.cos(latB) * Math.sin(dLon / 2) ** 2;
  return 2 * radiusKm * Math.asin(Math.sqrt(h));
};

export const stableHash = (input: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
};

export const seededNoise = (input: string, amplitude = 0.08): number => {
  const raw = stableHash(input) % 10000;
  return ((raw / 10000) * 2 - 1) * amplitude;
};
