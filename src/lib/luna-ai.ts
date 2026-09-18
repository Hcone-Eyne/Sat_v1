import {
  detectLocation,
  specialistForQuestion,
  satTile,
  type AnalysisResult,
  type SpecialistType,
  type LocationProfile,
} from "./mock-data";

export interface LunaResponse {
  type: "greeting" | "analysis" | "error";
  specialist?: SpecialistType;
  result?: AnalysisResult;
  profile?: LocationProfile;
  message?: string;
}

const THINKING_DELAY_MIN = 800;
const THINKING_DELAY_MAX = 1800;

function randomDelay(): Promise<void> {
  const ms = Math.floor(
    Math.random() * (THINKING_DELAY_MAX - THINKING_DELAY_MIN) + THINKING_DELAY_MIN
  );
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDuration(): string {
  return `${(Math.random() * 2 + 0.3).toFixed(1)}s`;
}

function randomConfidence(): number {
  return Math.round((Math.random() * 0.25 + 0.72) * 100) / 100;
}

const SCREENSHOT_EVIDENCE: Record<SpecialistType, string> = {
  "change-detection": "/screenshots/change-detection.png",
  "flood-analysis": "/screenshots/flood-sar.png",
  "object-detection": "/screenshots/airport.png",
  "vegetation-analysis": "/screenshots/vegetation.png",
  "optical-sar-fusion": "/screenshots/flood-sar.png",
  "visual-qa": "/screenshots/change-detection.png",
  general: "/screenshots/change-detection.png",
};

function buildResult(
  specialist: SpecialistType,
  question: string,
  lat: number,
  lng: number,
  profile: LocationProfile
): AnalysisResult {
  const z = 16;
  const confidence = randomConfidence();
  const pct = Math.round(confidence * 100);

  const modelsByType: Record<string, Array<{ name: string; type: string }>> = {
    "change-detection": [
      { name: "ChangeFormer v3", type: "Change Detection" },
      { name: "Segment Anything 2", type: "Segmentation" },
      { name: "GPT-4 Vision", type: "Summary" },
    ],
    "flood-analysis": [
      { name: "WaterNet", type: "Water Segmentation" },
      { name: "SAR-Optical Fusion", type: "Multi-Modal" },
      { name: "Depth Estimator", type: "Height Analysis" },
    ],
    "object-detection": [
      { name: "YOLO-v8 Satellite", type: "Object Detection" },
      { name: "SAM 2", type: "Instance Segmentation" },
      { name: "Footprint Extractor", type: "Building Analysis" },
    ],
    "vegetation-analysis": [
      { name: "NDVI Calculator", type: "Spectral Analysis" },
      { name: "Vegetation Classifier", type: "Classification" },
    ],
    "optical-sar-fusion": [
      { name: "SAR Encoder", type: "Radar Processing" },
      { name: "Optical Encoder", type: "Visual Processing" },
      { name: "Fusion Transformer", type: "Multi-Modal" },
    ],
    "visual-qa": [
      { name: "SatCLIP", type: "Scene Understanding" },
      { name: "Grounding DINO", type: "Object Grounding" },
      { name: "LLaVA-Mega", type: "Captioning" },
    ],
  };

  const models = (modelsByType[specialist] || modelsByType["visual-qa"]).map((m) => ({
    ...m,
    duration: randomDuration(),
    status: (Math.random() > 0.2 ? "success" : "partial") as "success" | "partial",
  }));

  const findings = buildFindings(specialist, profile, pct);

  const beforeAfter = profile.recentChange
    ? {
        beforeLabel: "Before — Jan 2024",
        afterLabel: "After — Current",
        beforeTileUrl:
          specialist === "change-detection"
            ? "/screenshots/change-detection.png"
            : specialist === "vegetation-analysis"
              ? "/screenshots/vegetation.png"
              : satTile(14, lat + 0.002, lng - 0.002),
        afterTileUrl: satTile(14, lat, lng),
        beforeCoords: [lat + 0.002, lng - 0.002] as [number, number],
        afterCoords: [lat, lng] as [number, number],
        findings: findings.slice(0, 3),
      }
    : undefined;

  return {
    id: `${specialist}-${Date.now()}`,
    specialist,
    question,
    lat,
    lng,
    summary: `Analysis of ${profile.name} (${profile.region}). ${profile.description}. ${pct}% confidence in detection results.`,
    findings,
    confidence,
    evidence: [
      { label: "Satellite — Current", tileUrl: satTile(z, lat, lng), coords: [lat, lng], zoom: z },
      { label: "AI Analysis Overlay", tileUrl: SCREENSHOT_EVIDENCE[specialist], coords: [lat, lng], zoom: z },
      { label: "Satellite — Overview", tileUrl: satTile(14, lat, lng), coords: [lat, lng], zoom: 14 },
    ],
    beforeAfter,
    modelsUsed: models,
    totalDuration: `${(Math.random() * 3 + 1).toFixed(1)}s`,
  };
}

function buildFindings(specialist: SpecialistType, profile: LocationProfile, pct: number): string[] {
  switch (specialist) {
    case "flood-analysis":
      return profile.hasWater
        ? [
            `Water body detected at analyzed coordinates`,
            `Water type: ${profile.terrain === "wetland" ? "marsh/wetland system" : profile.terrain === "coastal" ? "coastal water body" : "open water"}`,
            `Estimated water area: ${Math.floor(Math.random() * 8000 + 1000)} m²`,
            `Water depth estimate: ${(Math.random() * 3 + 0.2).toFixed(1)}m`,
            `Surrounding terrain: ${profile.terrain}`,
            `SAR backscatter confirms water surface reflectance`,
          ]
        : [
            `No significant water bodies detected at this location`,
            `Surface moisture: ${Math.random() > 0.5 ? "moderate" : "low"}`,
            `Terrain classification: ${profile.terrain}`,
            `Optical analysis shows dry terrain consistent with region profile`,
          ];

    case "change-detection":
      return profile.recentChange
        ? [
            `Land cover change detected within analysis window`,
            `Change type: ${profile.terrain} → developed area`,
            `Vegetation index decreased by ${Math.floor(Math.random() * 30 + 10)}%`,
            `New structural footprint: ~${Math.floor(Math.random() * 2000 + 200)} m²`,
            `Temporal baseline: 12-month comparison`,
          ]
        : [
            `No significant changes detected in the analysis window`,
            `Land cover remains consistent with historical baseline`,
            `Minor seasonal variations observed (within normal range)`,
          ];

    case "object-detection":
      return profile.hasBuildings
        ? [
            `${Math.floor(Math.random() * 10 + 2)} structures detected in the study area`,
            `Building footprints: ${Math.floor(Math.random() * 2000 + 100)}–${Math.floor(Math.random() * 5000 + 1000)} m² range`,
            `Structure type: ${profile.terrain === "urban" ? "residential/commercial mix" : "industrial/agricultural"}`,
            `Height estimate: ${Math.floor(Math.random() * 20 + 3)}m (${Math.floor(Math.random() * 5 + 1)} stories)`,
            `All structures confirmed via optical + SAR cross-validation`,
          ]
        : [
            `No permanent structures detected at this location`,
            `Terrain is primarily ${profile.terrain}`,
            `Analysis area appears to be undeveloped land`,
          ];

    case "vegetation-analysis":
      return profile.hasVegetation
        ? [
            `NDVI range: ${(Math.random() * 0.3 + 0.3).toFixed(2)}–${(Math.random() * 0.3 + 0.5).toFixed(2)}`,
            `Vegetation health: ${Math.random() > 0.5 ? "moderate to healthy" : "stressed in some areas"}`,
            `Canopy coverage: ${Math.floor(Math.random() * 40 + 30)}% of study area`,
            `Dominant type: ${profile.terrain === "wetland" ? "aquatic/marsh" : profile.terrain === "forest" ? "dense canopy" : "mixed grassland"}`,
            `Seasonal trend: ${Math.random() > 0.5 ? "growing season active" : "dormant period"}`,
          ]
        : [
            `Limited vegetation detected at this location`,
            `NDVI values below 0.2 — sparse or absent plant cover`,
            `Terrain dominated by ${profile.terrain} features`,
          ];

    case "optical-sar-fusion":
      return [
        `Optical analysis: ${profile.description}`,
        `SAR backscatter: ${profile.hasWater ? "high reflectance from water surfaces" : "consistent with dry terrain"}`,
        `Fusion result: Multi-modal analysis confirms ${profile.terrain} classification`,
        `Cross-validation: optical and SAR agree on ${pct}% of detected features`,
      ];

    case "visual-qa":
    default:
      return [
        `Scene classification: ${profile.terrain}`,
        `Dominant features: ${[
          profile.hasWater ? "water" : null,
          profile.hasBuildings ? "structures" : null,
          profile.hasVegetation ? "vegetation" : null,
        ]
          .filter(Boolean)
          .join(", ") || "open terrain"}`,
        `Land use: ${profile.description}`,
        `Anomalies: ${profile.recentChange ? "possible recent changes detected" : "no significant anomalies"}`,
      ];
  }
}

export async function askLuna(
  question: string,
  lat: number,
  lng: number
): Promise<LunaResponse> {
  await randomDelay();

  const trimmed = question.trim();
  if (!trimmed) {
    return { type: "error", message: "Please ask me something about the selected location." };
  }

  const profile = detectLocation(lat, lng);
  const specialist = specialistForQuestion(trimmed);
  const result = buildResult(specialist, trimmed, lat, lng, profile);

  return {
    type: "analysis",
    specialist,
    result,
    profile,
  };
}
