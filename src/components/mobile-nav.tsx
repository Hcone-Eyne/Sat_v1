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
} from "lucide-react";

const navItems = [
  { href: "/", label: "Map", icon: Map },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/chat", label: "Luna AI", icon: MessageCircle },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card-bg border-t border-card-border flex items-center justify-around px-2 py-1 safe-area-bottom">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
              isActive
                ? "text-blue-500"
                : "text-muted hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
