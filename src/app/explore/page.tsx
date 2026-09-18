"use client";

import { useState } from "react";
import { Search, Filter, MapPin, Satellite, Globe, Radar, Star, ArrowRight } from "lucide-react";
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

const categories = [
  { id: "all", label: "All", icon: Globe },
  { id: "stations", label: "Space Stations", icon: Satellite },
  { id: "telescopes", label: "Telescopes", icon: Radar },
  { id: "weather", label: "Weather Sats", icon: Globe },
  { id: "comm", label: "Communication", icon: Satellite },
];

const exploreItems = [
  {
    id: 1,
    name: "Urban Change Detection",
    category: "stations",
    description: "AI-powered change detection over city grids with cyan/green overlay highlights identifying infrastructure shifts.",
    image: "/screenshots/change-detection.png",
    rating: 4.9,
    lat: 28.5721,
    lng: -80.6508,
  },
  {
    id: 2,
    name: "Flood Inundation SAR",
    category: "weather",
    description: "Synthetic Aperture Radar combined with optical sensing to map flood water across river deltas and urban channels.",
    image: "/screenshots/flood-sar.png",
    rating: 4.8,
    lat: 29.5,
    lng: -85.0,
  },
  {
    id: 3,
    name: "Airport Infrastructure",
    category: "stations",
    description: "High-resolution overhead imagery of international airport runways, terminals, and taxiway networks.",
    image: "/screenshots/airport.png",
    rating: 4.6,
    lat: 35.0,
    lng: -75.0,
  },
  {
    id: 4,
    name: "Vegetation Canopy Analysis",
    category: "comm",
    description: "Remote sensing forestry map showing lush green riverbank canopy and dense vegetation cover along winding waterways.",
    image: "/screenshots/vegetation.png",
    rating: 4.7,
    lat: 32.1,
    lng: -90.5,
  },
  {
    id: 5,
    name: "Tiangong Station",
    category: "stations",
    description: "Chinese Space Station, permanently crewed since 2022.",
    image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400&h=300&fit=crop",
    rating: 4.7,
    lat: 42.0,
    lng: 100.0,
  },
  {
    id: 6,
    name: "James Webb",
    category: "telescopes",
    description: "Deep space telescope at L2 Lagrange point, 1.5M km from Earth.",
    image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&h=300&fit=crop",
    rating: 4.9,
    lat: 0.0,
    lng: 0.0,
  },
];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = exploreItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Map */}
      <div className="flex-1 p-4">
        <div className="h-full rounded-xl overflow-hidden border border-card-border">
          <MapContainer
            center={[30, -40]}
            zoom={2}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredItems.map((item) => (
              <Marker key={item.id} position={[item.lat, item.lng]} />
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Explore Panel */}
      <div className="w-[420px] border-l border-card-border bg-card-bg flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-card-border">
          <div className="flex items-center gap-2 bg-input-bg rounded-lg px-4 py-2">
            <Search className="w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search satellites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted outline-none flex-1"
            />
            <button className="p-1 hover:bg-background rounded">
              <Filter className="w-4 h-4 text-muted" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 p-4 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-blue-600 text-white"
                  : "bg-input-bg text-muted hover:bg-background"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-background border border-card-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-foreground">{item.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-foreground">{item.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <MapPin className="w-3 h-3" />
                    {item.lat.toFixed(2)}, {item.lng.toFixed(2)}
                  </div>
                  <button className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600">
                    View <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
