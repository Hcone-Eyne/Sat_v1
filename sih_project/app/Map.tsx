"use client";

import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initMap() {
      setOptions({
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        v: "weekly",
      });

      const { Map: GoogleMap } = (await importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;

      if (!mapRef.current) return;

      new GoogleMap(mapRef.current, {
        center: {
          lat: 20.5937,
          lng: 78.9629,
        },
        zoom: 5,
      });
    }

    initMap();
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "calc(100vh - 40px)",
      }}
    />
  );
}