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
    // Fix Leaflet default marker icons in Next.js
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/marker-icon-2x.png",
        iconUrl: "/marker-icon.png",
        shadowUrl: "/marker-shadow.png",
      });
    });
    setMapReady(true);
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] min-w-0">
      {/* Map Area */}
      <div className="flex-1 min-w-0 p-4">
        <div className="h-full rounded-xl overflow-hidden border border-card-border relative scale-in">
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
          <div className="absolute right-3 top-3 flex flex-col gap-1.5 z-[1000]">
            <button className="pressable w-9 h-9 material-header rounded-lg flex items-center justify-center hover:bg-input-bg shadow-sm">
              <ZoomIn className="w-4 h-4 text-foreground" />
            </button>
            <button className="pressable w-9 h-9 material-header rounded-lg flex items-center justify-center hover:bg-input-bg shadow-sm">
              <ZoomOut className="w-4 h-4 text-foreground" />
            </button>
            <button className="pressable w-9 h-9 material-header rounded-lg flex items-center justify-center hover:bg-input-bg shadow-sm">
              <Layers className="w-4 h-4 text-foreground" />
            </button>
            <button className="pressable w-9 h-9 material-header rounded-lg flex items-center justify-center hover:bg-input-bg shadow-sm">
              <Navigation className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="w-72 lg:w-80 max-w-[45vw] material-sidebar p-4 lg:p-6 overflow-y-auto rubber-band shrink-0">
        <h2 className="heading-section text-foreground mb-4">Satellite Info</h2>

        <div className="space-y-4 stagger-in">
          {satelliteData.map((sat) => (
            <div
              key={sat.id}
              onClick={() => setSelectedSat(sat)}
              className={`card-hover pressable-subtle p-4 rounded-xl border cursor-pointer ${
                selectedSat.id === sat.id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-card-border hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="heading-card text-foreground">{sat.name}</h3>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-600 dark:text-green-400 label-text rounded-full">
                  {sat.status}
                </span>
              </div>
              <div className="space-y-1 label-text text-muted">
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
            <span className="body-text font-medium text-foreground">Live Tracking</span>
          </div>
          <p className="label-text text-muted">
            Satellite positions update every 5 seconds. Data sourced from TLE orbital elements.
          </p>
        </div>
      </div>
    </div>
  );
}
