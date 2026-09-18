"use client";

import { useMap } from "react-leaflet";
import { useEffect } from "react";

interface MapClickHandlerProps {
  onLocationSelect: (loc: { lat: number; lng: number }) => void;
}

export default function MapClickHandler({ onLocationSelect }: MapClickHandlerProps) {
  const map = useMap();

  useEffect(() => {
    const handler = (e: { latlng: { lat: number; lng: number } }) => {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    };
    map.on("click", handler);
    return () => {
      map.off("click", handler);
    };
  }, [map, onLocationSelect]);

  return null;
}
