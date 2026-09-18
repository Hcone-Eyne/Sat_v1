"use client";

import { useState } from "react";
import {
  Search,
  Grid3X3,
  List,
  MapPin,
  Star,
  Trash2,
  ExternalLink,
  Filter,
} from "lucide-react";

const savedPlaces = [
  {
    id: 1,
    name: "ISS Tracking Station",
    location: "Kennedy Space Center, FL",
    coordinates: "28.5721, -80.6508",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop",
    rating: 5,
    savedDate: "2026-09-15",
    tags: ["Space Station", "Active"],
  },
  {
    id: 2,
    name: "Hubble观测点",
    location: "Low Earth Orbit",
    coordinates: "29.5000, -85.0000",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop",
    rating: 5,
    savedDate: "2026-09-14",
    tags: ["Telescope", "Science"],
  },
  {
    id: 3,
    name: "Starlink Constellation",
    location: "LEO - 550km",
    coordinates: "32.1000, -90.5000",
    image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400&h=300&fit=crop",
    rating: 4,
    savedDate: "2026-09-13",
    tags: ["Communication", "Internet"],
  },
  {
    id: 4,
    name: "Weather Station Alpha",
    location: "NOAA Polar Orbit",
    coordinates: "35.0000, -75.0000",
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=300&fit=crop",
    rating: 4,
    savedDate: "2026-09-12",
    tags: ["Weather", "Monitoring"],
  },
  {
    id: 5,
    name: "Tiangong Module",
    location: "Chinese Space Station",
    coordinates: "42.0000, 100.0000",
    image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400&h=300&fit=crop",
    rating: 5,
    savedDate: "2026-09-10",
    tags: ["Space Station", "Crewed"],
  },
  {
    id: 6,
    name: "Mars Rover Relay",
    location: "Jezero Crater",
    coordinates: "18.4446, 77.4509",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=300&fit=crop",
    rating: 5,
    savedDate: "2026-09-08",
    tags: ["Mars", "Exploration"],
  },
];

export default function SavedPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const filtered = savedPlaces
    .filter((place) =>
      place.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rating") return b.rating - a.rating;
      return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
    });

  return (
    <div className="p-6 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Saved Places</h1>
          <p className="text-sm text-muted mt-1">
            {savedPlaces.length} places saved
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${
              viewMode === "grid"
                ? "bg-blue-600 text-white"
                : "bg-input-bg text-muted"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-input-bg text-muted"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-input-bg rounded-lg px-4 py-2">
          <Search className="w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search saved places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted outline-none flex-1"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-input-bg rounded-lg text-sm text-foreground border-none outline-none"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
        </select>
        <button className="p-2 bg-input-bg rounded-lg hover:bg-background transition-colors">
          <Filter className="w-4 h-4 text-muted" />
        </button>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((place) => (
            <div
              key={place.id}
              className="bg-card-bg border border-card-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${place.image})` }}
              >
                <div className="absolute top-3 right-3 flex gap-2">
                  <button className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-black/70">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-red-500/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-1">
                  {place.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-foreground mb-1">{place.name}</h3>
                <p className="text-sm text-muted mb-2">{place.location}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: place.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <MapPin className="w-3 h-3" />
                    {place.coordinates}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filtered.map((place) => (
            <div
              key={place.id}
              className="bg-card-bg border border-card-border rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div
                className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
                style={{ backgroundImage: `url(${place.image})` }}
              />
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{place.name}</h3>
                <p className="text-sm text-muted">{place.location}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: place.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted">{place.savedDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-input-bg rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4 text-muted" />
                </button>
                <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
