export type SpecialistType =
  | "change-detection"
  | "object-detection"
  | "flood-analysis"
  | "vegetation-analysis"
  | "optical-sar-fusion"
  | "visual-qa"
  | "general";

export interface ModelUsed {
  name: string;
  type: string;
  duration: string;
  status: "success" | "partial";
}

export interface AnalysisResult {
  id: string;
  specialist: SpecialistType;
  question: string;
  lat: number;
  lng: number;
  summary: string;
  findings: string[];
  confidence: number;
  evidence: {
    label: string;
    tileUrl: string;
    coords: [number, number];
    zoom: number;
  }[];
  beforeAfter?: {
    beforeLabel: string;
    afterLabel: string;
    beforeTileUrl: string;
    afterTileUrl: string;
    beforeCoords: [number, number];
    afterCoords: [number, number];
    findings: string[];
  };
  modelsUsed: ModelUsed[];
  totalDuration: string;
}

export const STUDY_REGION = {
  center: [28.572, -80.650] as [number, number],
  bounds: [
    [28.570875, -80.65135],
    [28.573125, -80.64865],
  ] as [[number, number], [number, number]],
  label: "Kennedy Space Center — Study Area",
  size: "250x250m",
};

export function satTile(z: number, lat: number, lng: number): string {
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, z));
  const y = Math.floor(
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) /
      2) *
      Math.pow(2, z)
  );
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
}

export interface LocationProfile {
  name: string;
  region: string;
  terrain: "coastal" | "urban" | "agricultural" | "forest" | "desert" | "wetland" | "mountain" | "industrial";
  hasWater: boolean;
  hasBuildings: boolean;
  hasVegetation: boolean;
  recentChange: boolean;
  description: string;
}

export function detectLocation(lat: number, lng: number): LocationProfile {
  if (lat > 28.5 && lat < 28.6 && lng > -80.7 && lng < -80.6) {
    return {
      name: "Kennedy Space Center",
      region: "Florida Coast",
      terrain: "coastal",
      hasWater: true,
      hasBuildings: true,
      hasVegetation: true,
      recentChange: true,
      description: "Coastal launch facility with wetlands, water bodies, and industrial structures",
    };
  }
  if (lat > 25.7 && lat < 25.9 && lng > -80.3 && lng < -80.1) {
    return {
      name: "Miami Metro",
      region: "South Florida",
      terrain: "urban",
      hasWater: true,
      hasBuildings: true,
      hasVegetation: true,
      recentChange: true,
      description: "Dense urban area with Biscayne Bay, residential zones, and tropical vegetation",
    };
  }
  if (lat > 40.6 && lat < 40.9 && lng > -74.1 && lng < -73.7) {
    return {
      name: "New York City",
      region: "Northeast US",
      terrain: "urban",
      hasWater: true,
      hasBuildings: true,
      hasVegetation: false,
      recentChange: true,
      description: "Major metropolitan area with harbors, dense buildings, limited green space",
    };
  }
  if (lat > 29.0 && lat < 30.0 && lng > -92.0 && lng < -89.0) {
    return {
      name: "Louisiana Wetlands",
      region: "Gulf Coast",
      terrain: "wetland",
      hasWater: true,
      hasBuildings: false,
      hasVegetation: true,
      recentChange: true,
      description: "Coastal wetlands with water channels, marsh vegetation, and erosion patterns",
    };
  }
  if (lat > 41.0 && lat < 46.0 && lng > -90.0 && lng < -82.0) {
    return {
      name: "Great Lakes Region",
      region: "Midwest US",
      terrain: "coastal",
      hasWater: true,
      hasBuildings: false,
      hasVegetation: true,
      recentChange: false,
      description: "Large freshwater lake shoreline with forested areas and seasonal changes",
    };
  }
  if (lat > 35.0 && lat < 36.0 && lng > -106.0 && lng < -104.0) {
    return {
      name: "New Mexico Desert",
      region: "Southwest US",
      terrain: "desert",
      hasWater: false,
      hasBuildings: false,
      hasVegetation: false,
      recentChange: false,
      description: "Arid desert terrain with sparse vegetation and exposed rock formations",
    };
  }
  if (lat > 47.0 && lat < 48.0 && lng > -123.0 && lng < -122.0) {
    return {
      name: "Pacific Northwest Forest",
      region: "Washington State",
      terrain: "forest",
      hasWater: true,
      hasBuildings: false,
      hasVegetation: true,
      recentChange: false,
      description: "Dense coniferous forest with river systems and mountain terrain",
    };
  }
  return {
    name: `Area at ${lat.toFixed(3)}°, ${lng.toFixed(3)}°`,
    region: "Scanned Region",
    terrain: "agricultural",
    hasWater: Math.random() > 0.6,
    hasBuildings: Math.random() > 0.5,
    hasVegetation: Math.random() > 0.3,
    recentChange: Math.random() > 0.5,
    description: "Mixed terrain area with varied land cover detected by satellite sensors",
  };
}

export function specialistForQuestion(question: string): SpecialistType {
  const q = question.toLowerCase();
  if (q.includes("water") || q.includes("flood") || q.includes("wet") || q.includes("river") || q.includes("lake")) return "flood-analysis";
  if (q.includes("change") || q.includes("before") || q.includes("after") || q.includes("new") || q.includes("construction") || q.includes("diff")) return "change-detection";
  if (q.includes("building") || q.includes("structure") || q.includes("house") || q.includes("tower")) return "object-detection";
  if (q.includes("vegetation") || q.includes("tree") || q.includes("green") || q.includes("plant") || q.includes("crop") || q.includes("forest")) return "vegetation-analysis";
  if (q.includes("sar") || q.includes("radar") || q.includes("optical")) return "optical-sar-fusion";
  return "visual-qa";
}

export function getMockResult(specialist: SpecialistType): AnalysisResult {
  return {
    id: `${specialist}-fallback`,
    specialist,
    question: "",
    lat: 0,
    lng: 0,
    summary: "Fallback result",
    findings: [],
    confidence: 0.8,
    evidence: [],
    modelsUsed: [],
    totalDuration: "1.0s",
  };
}

export const LUNA_GREETING = `Hey! I'm **Luna** — your satellite intelligence assistant.

Click anywhere on the map to select a location, then ask me about it.

Try something like:
- "Is there water here?"
- "What changed here?"
- "Are there buildings?"
- "What about vegetation?"`;
