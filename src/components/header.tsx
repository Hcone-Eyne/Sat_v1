"use client";

import { Sun, Moon, Bell, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="h-16 border-b border-card-border bg-card-bg flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center gap-2 bg-input-bg rounded-lg px-4 py-2 w-96">
        <Search className="w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search satellites, locations..."
          className="bg-transparent text-sm text-foreground placeholder:text-muted outline-none flex-1"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-input-bg transition-colors">
          <Bell className="w-5 h-5 text-muted" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-input-bg transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-muted" />
            ) : (
              <Moon className="w-5 h-5 text-muted" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}
