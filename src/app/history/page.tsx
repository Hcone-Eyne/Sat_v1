"use client";

import { useState } from "react";
import {
  Search,
  Clock,
  MapPin,
  Satellite,
  Trash2,
  Filter,
  Calendar,
  ArrowUpRight,
} from "lucide-react";

const historyData = [
  {
    id: 1,
    type: "tracking",
    title: "Tracked ISS",
    description: "Followed ISS orbit from Kennedy Space Center to Atlantic Ocean",
    timestamp: "2026-09-17 14:32",
    duration: "45 min",
    icon: Satellite,
    color: "blue",
  },
  {
    id: 2,
    type: "explore",
    title: "Explored Hubble Telescope",
    description: "Viewed details and orbital path of Hubble Space Telescope",
    timestamp: "2026-09-17 12:15",
    duration: "12 min",
    icon: MapPin,
    color: "purple",
  },
  {
    id: 3,
    type: "chat",
    title: "SatQuery: Starlink coverage",
    description: "Asked AI about Starlink satellite coverage in North America",
    timestamp: "2026-09-17 10:45",
    duration: "8 min",
    icon: Clock,
    color: "green",
  },
  {
    id: 4,
    type: "tracking",
    title: "Tracked Tiangong Station",
    description: "Monitored Chinese Space Station over Asian continent",
    timestamp: "2026-09-16 22:10",
    duration: "30 min",
    icon: Satellite,
    color: "blue",
  },
  {
    id: 5,
    type: "explore",
    title: "Explored Mars Rovers",
    description: "Browsed Mars exploration missions and relay satellites",
    timestamp: "2026-09-16 18:30",
    duration: "20 min",
    icon: MapPin,
    color: "purple",
  },
  {
    id: 6,
    type: "saved",
    title: "Saved Weather Station Alpha",
    description: "Added NOAA polar orbit weather satellite to saved places",
    timestamp: "2026-09-16 15:22",
    duration: "5 min",
    icon: Clock,
    color: "yellow",
  },
  {
    id: 7,
    type: "tracking",
    title: "Tracked Starlink Cluster",
    description: "Followed Starlink satellite constellation over US",
    timestamp: "2026-09-15 20:00",
    duration: "55 min",
    icon: Satellite,
    color: "blue",
  },
  {
    id: 8,
    type: "chat",
    title: "SatQuery: ISS next pass",
    description: "Asked AI for next ISS visible pass time and location",
    timestamp: "2026-09-15 16:45",
    duration: "3 min",
    icon: Clock,
    color: "green",
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  purple: "bg-purple-500/20 text-purple-600 dark:text-purple-400",
  green: "bg-green-500/20 text-green-600 dark:text-green-400",
  yellow: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
};

export default function HistoryPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = historyData.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">History</h1>
          <p className="text-sm text-muted mt-1">
            Your recent activity and sessions
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors text-sm">
          <Trash2 className="w-4 h-4" />
          Clear History
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-input-bg rounded-lg px-4 py-2">
          <Search className="w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted outline-none flex-1"
          />
        </div>
        <div className="flex gap-2">
          {["all", "tracking", "explore", "chat", "saved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-input-bg text-muted hover:bg-background"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-card-border" />

        <div className="space-y-4">
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex gap-4 relative">
                {/* Timeline dot */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${colorMap[item.color]}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 bg-card-bg border border-card-border rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <button className="p-1 hover:bg-input-bg rounded transition-colors">
                      <ArrowUpRight className="w-4 h-4 text-muted" />
                    </button>
                  </div>
                  <p className="text-sm text-muted mb-2">{item.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.timestamp}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.duration}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-muted">No history found matching your search.</p>
        </div>
      )}
    </div>
  );
}
