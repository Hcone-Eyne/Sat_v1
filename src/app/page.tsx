"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut, Info } from "lucide-react";
import dynamic from "next/dynamic";

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
  const [selectedSat, setSelectedSat] = useState(satelliteData[0]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Map Area */}
      <div className="flex-1 p-4">
        <div className="h-full rounded-xl overflow-hidden border border-card-border relative">
          {mapReady && (
            <MapContainer
              center={[30.0, -85.0]}
              zoom={6}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {satelliteData.map((sat) => (
                <Marker
                  key={sat.id}
                  position={[sat.lat, sat.lng]}
                  eventHandlers={{
                    click: () => setSelectedSat(sat),
                  }}
                >
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
          )}

          {/* Map Controls */}
          <div className="absolute right-4 top-4 flex flex-col gap-2 z-[1000]">
            <button className="w-10 h-10 bg-card-bg border border-card-border rounded-lg flex items-center justify-center hover:bg-input-bg transition-colors shadow-sm">
              <ZoomIn className="w-4 h-4 text-foreground" />
            </button>
            <button className="w-10 h-10 bg-card-bg border border-card-border rounded-lg flex items-center justify-center hover:bg-input-bg transition-colors shadow-sm">
              <ZoomOut className="w-4 h-4 text-foreground" />
            </button>
            <button className="w-10 h-10 bg-card-bg border border-card-border rounded-lg flex items-center justify-center hover:bg-input-bg transition-colors shadow-sm">
              <Layers className="w-4 h-4 text-foreground" />
            </button>
            <button className="w-10 h-10 bg-card-bg border border-card-border rounded-lg flex items-center justify-center hover:bg-input-bg transition-colors shadow-sm">
              <Navigation className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="w-96 border-l border-card-border bg-card-bg p-6 overflow-y-auto">
        <h2 className="text-lg font-bold text-foreground mb-4">Satellite Info</h2>

        <div className="space-y-4">
          {satelliteData.map((sat) => (
            <div
              key={sat.id}
              onClick={() => setSelectedSat(sat)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedSat.id === sat.id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-card-border hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground text-sm">{sat.name}</h3>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-full">
                  {sat.status}
                </span>
              </div>
              <div className="space-y-1 text-xs text-muted">
                <div className="flex justify-between">
                  <span>Altitude</span>
                  <span className="text-foreground">{sat.altitude}</span>
                </div>
                <div className="flex justify-between">
                  <span>Speed</span>
                  <span className="text-foreground">{sat.speed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Position</span>
                  <span className="text-foreground">
                    {sat.lat.toFixed(2)}, {sat.lng.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-input-bg rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-muted" />
            <span className="text-sm font-medium text-foreground">Live Tracking</span>
          </div>
          <p className="text-xs text-muted">
            Satellite positions update every 5 seconds. Data sourced from TLE orbital elements.
          </p>
        </div>
      </div>
    </div>
  );
}
