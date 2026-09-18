"use client";

import { useState, useCallback } from "react";
import {
  Layers,
  Building2,
  Droplets,
  Plane,
  TreePine,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import dynamic from "next/dynamic";

const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Polygon = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polygon),
  { ssr: false }
);
const ImageOverlay = dynamic(
  () => import("react-leaflet").then((mod) => mod.ImageOverlay),
  { ssr: false }
);

interface AnalysisLayer {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const analysisLayers: AnalysisLayer[] = [
  {
    id: "change-detection",
    name: "Change Detection",
    icon: Building2,
    color: "#06b6d4",
    description: "Urban infrastructure shifts highlighted in cyan/green",
  },
  {
    id: "flood-analysis",
    name: "Flood Analysis",
    icon: Droplets,
    color: "#3b82f6",
    description: "Water inundation zones mapped via SAR radar",
  },
  {
    id: "airport-infrastructure",
    name: "Airport Infrastructure",
    icon: Plane,
    color: "#f59e0b",
    description: "Runways, terminals, and taxiway networks",
  },
  {
    id: "vegetation-analysis",
    name: "Vegetation Analysis",
    icon: TreePine,
    color: "#22c55e",
    description: "Canopy coverage and vegetation health index",
  },
];

function LayerMarkers({ layerId, visible }: { layerId: string; visible: boolean }) {
  if (!visible) return null;

  switch (layerId) {
    case "change-detection":
      return (
        <>
          {/* City grid change zones */}
          <CircleMarker
            center={[28.572, -80.650]}
            radius={200}
            pathOptions={{
              color: "#06b6d4",
              fillColor: "#06b6d4",
              fillOpacity: 0.15,
              weight: 2,
              dashArray: "5, 5",
            }}
          >
            <div className="text-xs p-1">
              <strong>Change Zone A</strong><br />
              Infrastructure shift detected
            </div>
          </CircleMarker>
          <CircleMarker
            center={[28.574, -80.648]}
            radius={150}
            pathOptions={{
              color: "#22c55e",
              fillColor: "#22c55e",
              fillOpacity: 0.12,
              weight: 2,
              dashArray: "5, 5",
            }}
          >
            <div className="text-xs p-1">
              <strong>Change Zone B</strong><br />
              Vegetation recovery area
            </div>
          </CircleMarker>
          <CircleMarker
            center={[28.570, -80.652]}
            radius={180}
            pathOptions={{
              color: "#06b6d4",
              fillColor: "#06b6d4",
              fillOpacity: 0.1,
              weight: 1,
            }}
          >
            <div className="text-xs p-1">
              <strong>Change Zone C</strong><br />
              Construction activity
            </div>
          </CircleMarker>
        </>
      );

    case "flood-analysis":
      return (
        <>
          {/* Flood inundation polygons */}
          <Polygon
            positions={[
              [28.568, -80.655],
              [28.570, -80.650],
              [28.569, -80.645],
              [28.567, -80.648],
            ]}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.25,
              weight: 2,
            }}
          >
            <div className="text-xs p-1">
              <strong>Flood Zone 1</strong><br />
              High inundation risk
            </div>
          </Polygon>
          <Polygon
            positions={[
              [28.575, -80.658],
              [28.577, -80.653],
              [28.576, -80.649],
              [28.574, -80.652],
            ]}
            pathOptions={{
              color: "#60a5fa",
              fillColor: "#60a5fa",
              fillOpacity: 0.2,
              weight: 2,
            }}
          >
            <div className="text-xs p-1">
              <strong>Flood Zone 2</strong><br />
              Moderate inundation risk
            </div>
          </Polygon>
          <CircleMarker
            center={[28.571, -80.651]}
            radius={120}
            pathOptions={{
              color: "#1d4ed8",
              fillColor: "#1d4ed8",
              fillOpacity: 0.3,
              weight: 2,
            }}
          >
            <div className="text-xs p-1">
              <strong>Water Body</strong><br />
              Permanent water detection
            </div>
          </CircleMarker>
        </>
      );

    case "airport-infrastructure":
      return (
        <>
          {/* Airport runway markers */}
          <CircleMarker
            center={[28.572, -80.650]}
            radius={8}
            pathOptions={{
              color: "#f59e0b",
              fillColor: "#f59e0b",
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <div className="text-xs p-1">
              <strong>Runway 1</strong><br />
              Active — 3,000m
            </div>
          </CircleMarker>
          <CircleMarker
            center={[28.573, -80.649]}
            radius={8}
            pathOptions={{
              color: "#f59e0b",
              fillColor: "#f59e0b",
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <div className="text-xs p-1">
              <strong>Runway 2</strong><br />
              Active — 2,800m
            </div>
          </CircleMarker>
          <CircleMarker
            center={[28.5715, -80.6505]}
            radius={12}
            pathOptions={{
              color: "#ef4444",
              fillColor: "#ef4444",
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <div className="text-xs p-1">
              <strong>Terminal</strong><br />
              Passenger capacity: 2,000
            </div>
          </CircleMarker>
          <CircleMarker
            center={[28.5725, -80.6495]}
            radius={6}
            pathOptions={{
              color: "#a855f7",
              fillColor: "#a855f7",
              fillOpacity: 0.8,
              weight: 2,
            }}
          >
            <div className="text-xs p-1">
              <strong>Taxiway</strong><br />
              Connected to runway 1
            </div>
          </CircleMarker>
        </>
      );

    case "vegetation-analysis":
      return (
        <>
          {/* Vegetation health zones */}
          <CircleMarker
            center={[28.574, -80.653]}
            radius={250}
            pathOptions={{
              color: "#22c55e",
              fillColor: "#22c55e",
              fillOpacity: 0.15,
              weight: 2,
            }}
          >
            <div className="text-xs p-1">
              <strong>Dense Canopy</strong><br />
              NDVI: 0.6–0.8
            </div>
          </CircleMarker>
          <CircleMarker
            center={[28.570, -80.647]}
            radius={200}
            pathOptions={{
              color: "#86efac",
              fillColor: "#86efac",
              fillOpacity: 0.12,
              weight: 2,
            }}
          >
            <div className="text-xs p-1">
              <strong>Mixed Vegetation</strong><br />
              NDVI: 0.3–0.5
            </div>
          </CircleMarker>
          <CircleMarker
            center={[28.573, -80.651]}
            radius={100}
            pathOptions={{
              color: "#fbbf24",
              fillColor: "#fbbf24",
              fillOpacity: 0.1,
              weight: 1,
              dashArray: "3, 3",
            }}
          >
            <div className="text-xs p-1">
              <strong>Stressed Vegetation</strong><br />
              NDVI: 0.1–0.2
            </div>
          </CircleMarker>
        </>
      );

    default:
      return null;
  }
}

export default function AnalysisLayers() {
  const [expanded, setExpanded] = useState(false);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set());

  const toggleLayer = useCallback((layerId: string) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layerId)) {
        next.delete(layerId);
      } else {
        next.add(layerId);
      }
      return next;
    });
  }, []);

  return (
    <>
      {/* Layer markers on map */}
      {analysisLayers.map((layer) => (
        <LayerMarkers
          key={layer.id}
          layerId={layer.id}
          visible={activeLayers.has(layer.id)}
        />
      ))}

      {/* Layer panel */}
      <div className="absolute right-4 bottom-4 z-[1000] material-header rounded-xl shadow-lg overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-3 py-2.5 hover:bg-input-bg transition-colors w-full"
        >
          <Layers className="w-4 h-4 text-foreground" />
          <span className="label-text text-foreground font-medium">Analysis Layers</span>
          {activeLayers.size > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-blue-500 text-white text-[10px] rounded-full font-medium">
              {activeLayers.size}
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-3 h-3 text-muted ml-auto" />
          ) : (
            <ChevronDown className="w-3 h-3 text-muted ml-auto" />
          )}
        </button>

        {expanded && (
          <div className="border-t border-card-border p-2 space-y-1 max-h-64 overflow-y-auto">
            {analysisLayers.map((layer) => {
              const isActive = activeLayers.has(layer.id);
              const Icon = layer.icon;
              return (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg transition-colors text-left ${
                    isActive
                      ? "bg-input-bg"
                      : "hover:bg-input-bg/50"
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: isActive ? `${layer.color}20` : "transparent",
                      border: `1.5px solid ${isActive ? layer.color : "var(--card-border)"}`,
                    }}
                  >
                    <Icon
                      className="w-3.5 h-3.5"
                      style={{ color: isActive ? layer.color : "var(--muted)" }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="label-text text-foreground font-medium truncate">{layer.name}</p>
                    <p className="text-[10px] text-muted truncate">{layer.description}</p>
                  </div>
                  <div
                    className="ml-auto w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      borderColor: isActive ? layer.color : "var(--card-border)",
                      backgroundColor: isActive ? layer.color : "transparent",
                    }}
                  >
                    {isActive && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
