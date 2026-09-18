"use client";

import dynamic from "next/dynamic";
import { Popup } from "react-leaflet";

const Rectangle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Rectangle),
  { ssr: false }
);

const CENTER_LAT = 28.572;
const CENTER_LNG = -80.650;
const HALF = 0.00225 / 2;
const HALF_LNG = 0.0027 / 2;

const bounds: [[number, number], [number, number]] = [
  [CENTER_LAT - HALF, CENTER_LNG - HALF_LNG],
  [CENTER_LAT + HALF, CENTER_LNG + HALF_LNG],
];

export default function RegionHighlight() {
  return (
    <Rectangle
      bounds={bounds}
      pathOptions={{
        color: "#3b82f6",
        weight: 2,
        fillColor: "#93c5fd",
        fillOpacity: 0.15,
      }}
    >
      <Popup>
        <div className="text-sm">
          <strong>Study Region — 250×250m</strong>
        </div>
      </Popup>
    </Rectangle>
  );
}
