"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import LunaChat from "@/components/luna-chat";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const RegionHighlight = dynamic(
  () => import("@/components/region-highlight"),
  { ssr: false }
);
const MapClickHandler = dynamic(
  () => import("@/components/map-click-handler"),
  { ssr: false }
);
const MapControls = dynamic(
  () => import("@/components/map-controls"),
  { ssr: false }
);

const satelliteData = [
  {
    id: 1,
    name: "ISS (ZARYA)",
    lat: 28.5721,
    lng: -80.6508,
    altitude: "408 km",
    speed: "27,600 km/h",
    status: "Active",
  },
  {
    id: 2,
    name: "Hubble Space Telescope",
    lat: 29.5,
    lng: -85.0,
    altitude: "547 km",
    speed: "27,000 km/h",
    status: "Active",
  },
  {
    id: 3,
    name: "Starlink-1007",
    lat: 32.1,
    lng: -90.5,
    altitude: "550 km",
    speed: "27,500 km/h",
    status: "Active",
  },
];

const routePath: [number, number][] = [
  [28.5721, -80.6508],
  [30.5, -82.0],
  [32.0, -84.0],
  [33.5, -86.0],
  [35.0, -88.0],
  [36.5, -90.0],
];

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const markerIcon = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const L = require("leaflet");
    return new L.Icon({
      iconUrl: "/marker-icon.png",
      iconRetinaUrl: "/marker-icon-2x.png",
      shadowUrl: "/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] min-w-0">
      {/* Map Area */}
      <div className="flex-1 p-4 min-w-0">
        <div className="h-full rounded-xl overflow-hidden border border-card-border relative scale-in">
          <MapContainer
            center={[28.572, -80.650]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onLocationSelect={setSelectedLocation} />
            <MapControls />
            <RegionHighlight />
            {selectedLocation && markerIcon && (
              <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={markerIcon}>
                <Popup>
                  <div className="text-sm">
                    <strong>Selected Location</strong>
                    <br />
                    {selectedLocation.lat.toFixed(4)}°N, {Math.abs(selectedLocation.lng).toFixed(4)}°W
                  </div>
                </Popup>
              </Marker>
            )}
            {satelliteData.map((sat) => (
              <Marker key={sat.id} position={[sat.lat, sat.lng]} icon={markerIcon}>
                <Popup>
                  <div className="text-sm">
                    <strong>{sat.name}</strong>
                    <br />
                    Altitude: {sat.altitude}
                  </div>
                </Popup>
              </Marker>
            ))}
            <Polyline
              positions={routePath}
              pathOptions={{ color: "#3b82f6", weight: 3, dashArray: "10, 10" }}
            />
          </MapContainer>

          {/* Study Region Label */}
          <div className="absolute left-4 bottom-12 z-[1000] material-header rounded-lg px-3 py-2 shadow-sm">
            <p className="label-text text-foreground font-medium">SIH26167 Study Area</p>
            <p className="text-[10px] text-muted">Kennedy Space Center — 250×250m</p>
          </div>

          {/* Selection indicator */}
          {selectedLocation && (
            <div className="absolute left-4 top-4 z-[1000] material-header rounded-lg px-3 py-2 shadow-sm">
              <p className="label-text text-foreground font-medium">Location Selected</p>
              <p className="text-[10px] text-blue-500">
                {selectedLocation.lat.toFixed(4)}°N, {Math.abs(selectedLocation.lng).toFixed(4)}°W
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Luna Chat Panel */}
      <div className="w-96 shrink-0 border-l border-card-border bg-card-bg flex flex-col h-full overflow-hidden max-lg:hidden">
        <LunaChat selectedLocation={selectedLocation} />
      </div>
    </div>
  );
}
