"use client";

import { Sun, Moon, Bell, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setSpinning(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setSpinning(false), 350);
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="material-header h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center gap-2 bg-input-bg rounded-lg px-3 lg:px-4 py-2 flex-1 lg:flex-none lg:w-96">
        <Search className="w-4 h-4 text-muted shrink-0" />
        <input
          type="text"
          placeholder="Search satellites, locations..."
          className="bg-transparent body-text text-foreground placeholder:text-muted outline-none flex-1 min-w-0"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          className="pressable-subtle relative p-2 rounded-lg hover:bg-input-bg"
          style={{ transition: "background-color var(--duration-normal) var(--ease-out)" }}
        >
          <Bell className="w-5 h-5 text-muted" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        {mounted && (
          <button
            onClick={toggleTheme}
            className="pressable-subtle p-2 rounded-lg hover:bg-input-bg"
            style={{ transition: "background-color var(--duration-normal) var(--ease-out)" }}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span
              className="theme-toggle-icon inline-block"
              style={{
                transition: "transform var(--duration-normal) var(--ease-out)",
                transform: spinning ? "rotate(360deg)" : "rotate(0deg)",
              }}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-muted" />
              ) : (
                <Moon className="w-5 h-5 text-muted" />
              )}
            </span>
          </button>
        )}
      </div>
    </header>
  );
}
