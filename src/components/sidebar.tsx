"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  Compass,
  Bookmark,
  History,
  Settings,
  MessageCircle,
  Satellite,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Map", icon: Map },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/saved", label: "Saved Places", icon: Bookmark },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/chat", label: "SatQuery AI", icon: MessageCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="material-sidebar w-64 h-screen flex-col fixed left-0 top-0 z-40 hidden lg:flex">
      {/* Logo */}
      <div className="p-6" style={{ borderBottom: "1px solid var(--material-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center pressable-subtle">
            <Satellite className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="heading-card text-foreground">SatFinder</h1>
            <p className="label-text text-muted">Satellite Tracking</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`pressable-subtle flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-muted hover:bg-card-bg hover:text-foreground"
              }`}
              style={{ transition: "background-color var(--duration-normal) var(--ease-out), color var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out)" }}
            >
              <item.icon className="w-5 h-5" />
              <span className="body-text font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4" style={{ borderTop: "1px solid var(--material-border)" }}>
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white label-text font-bold">
            E
          </div>
          <div>
            <p className="body-text font-medium text-foreground">Enoch</p>
            <p className="label-text text-muted">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
