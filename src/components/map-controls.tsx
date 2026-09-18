"use client";

import L from "leaflet";
import { useMap } from "react-leaflet";
import { ZoomIn, ZoomOut, Layers, Navigation, Locate } from "lucide-react";

export default function MapControls() {
  const map = useMap();

  return (
    <div className="absolute right-4 top-4 flex flex-col gap-2 z-[1000]">
      <button
        onClick={() => map.zoomIn()}
        className="pressable w-10 h-10 material-header rounded-lg flex items-center justify-center hover:bg-input-bg transition-colors shadow-sm"
        title="Zoom in"
      >
        <ZoomIn className="w-4 h-4 text-foreground" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="pressable w-10 h-10 material-header rounded-lg flex items-center justify-center hover:bg-input-bg transition-colors shadow-sm"
        title="Zoom out"
      >
        <ZoomOut className="w-4 h-4 text-foreground" />
      </button>
      <button
        onClick={() => map.setView([28.572, -80.650], 15)}
        className="pressable w-10 h-10 material-header rounded-lg flex items-center justify-center hover:bg-input-bg transition-colors shadow-sm"
        title="Reset view"
      >
        <Navigation className="w-4 h-4 text-foreground" />
      </button>
      <button
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                map.setView([pos.coords.latitude, pos.coords.longitude], 13);
              },
              () => {
                map.setView([28.572, -80.650], 15);
              }
            );
          }
        }}
        className="pressable w-10 h-10 material-header rounded-lg flex items-center justify-center hover:bg-input-bg transition-colors shadow-sm"
        title="My location"
      >
        <Locate className="w-4 h-4 text-foreground" />
      </button>
      <button
        onClick={() => {
          map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
              map.removeLayer(layer);
            }
          });
          const currentZoom = map.getZoom();
          if (currentZoom >= 10) {
            L.tileLayer(
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
              { attribution: "Esri" }
            ).addTo(map);
          } else {
            L.tileLayer(
              "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
              { attribution: "OSM" }
            ).addTo(map);
          }
        }}
        className="pressable w-10 h-10 material-header rounded-lg flex items-center justify-center hover:bg-input-bg transition-colors shadow-sm"
        title="Toggle satellite view"
      >
        <Layers className="w-4 h-4 text-foreground" />
      </button>
    </div>
  );
}
