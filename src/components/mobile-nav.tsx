"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Compass, Bookmark, History, Settings, MessageCircle } from "lucide-react";

const navItems = [
  { href: "/", label: "Map", icon: Map },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/chat", label: "AI", icon: MessageCircle },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 material-header border-t border-card-border">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`pressable-subtle flex flex-col items-center gap-1 px-2 py-1 rounded-lg min-w-0 ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-muted"
              }`}
              style={{ transition: "color var(--duration-normal) var(--ease-out)" }}
            >
              <item.icon className="w-5 h-5" />
              <span className="label-text">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
