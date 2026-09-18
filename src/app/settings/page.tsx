"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Key,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  Check,
} from "lucide-react";

const settingSections = [
  {
    id: "account",
    label: "Account",
    icon: User,
    description: "Manage your profile and preferences",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Configure alert preferences",
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    description: "Customize the look and feel",
  },
  {
    id: "privacy",
    label: "Privacy & Security",
    icon: Shield,
    description: "Manage your data and security",
  },
  {
    id: "language",
    label: "Language & Region",
    icon: Globe,
    description: "Set language and time zone",
  },
  {
    id: "data",
    label: "Data & Storage",
    icon: Database,
    description: "Manage cached data and storage",
  },
  {
    id: "api",
    label: "API Keys",
    icon: Key,
    description: "Manage API integrations",
  },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("appearance");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    satelliteAlerts: true,
    passReminders: true,
  });

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Settings Nav */}
      <div className="w-72 border-r border-card-border bg-card-bg p-4">
        <h2 className="text-lg font-bold text-foreground mb-4 px-4">Settings</h2>
        <nav className="space-y-1">
          {settingSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                activeSection === section.id
                  ? "bg-blue-600 text-white"
                  : "text-muted hover:bg-input-bg hover:text-foreground"
              }`}
            >
              <section.icon className="w-5 h-5" />
              <div>
                <p className="text-sm font-medium">{section.label}</p>
                <p
                  className={`text-xs ${
                    activeSection === section.id
                      ? "text-white/70"
                      : "text-muted"
                  }`}
                >
                  {section.description}
                </p>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeSection === "appearance" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-2">Appearance</h2>
            <p className="text-muted mb-8">
              Customize how SatFinder looks on your device
            </p>

            {/* Theme Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Theme
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "light", label: "Light", icon: Sun },
                  { value: "dark", label: "Dark", icon: Moon },
                  { value: "system", label: "System", icon: Monitor },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      mounted && theme === option.value
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-card-border hover:border-blue-300"
                    }`}
                  >
                    <option.icon className="w-6 h-6 text-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {option.label}
                    </span>
                    {mounted && theme === option.value && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Accent Color
              </h3>
              <div className="flex gap-3">
                {[
                  "bg-blue-500",
                  "bg-purple-500",
                  "bg-green-500",
                  "bg-orange-500",
                  "bg-pink-500",
                  "bg-teal-500",
                ].map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full ${color} ring-2 ring-offset-2 ${
                      color === "bg-blue-500"
                        ? "ring-blue-500"
                        : "ring-transparent hover:ring-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "notifications" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Notifications
            </h2>
            <p className="text-muted mb-8">
              Configure how you receive alerts and updates
            </p>

            <div className="space-y-4">
              {[
                {
                  key: "email",
                  label: "Email Notifications",
                  description: "Receive updates via email",
                },
                {
                  key: "push",
                  label: "Push Notifications",
                  description: "Browser push notifications",
                },
                {
                  key: "sms",
                  label: "SMS Alerts",
                  description: "Critical alerts via text message",
                },
                {
                  key: "satelliteAlerts",
                  label: "Satellite Pass Alerts",
                  description: "Notify when tracked satellites pass overhead",
                },
                {
                  key: "passReminders",
                  label: "Pass Reminders",
                  description: "Remind 15 min before satellite pass",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-card-bg border border-card-border rounded-xl"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted">{item.description}</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof prev],
                      }))
                    }
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications]
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        notifications[item.key as keyof typeof notifications]
                          ? "translate-x-6"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "account" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-2">Account</h2>
            <p className="text-muted mb-8">
              Manage your profile and account settings
            </p>

            <div className="bg-card-bg border border-card-border rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  E
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">Enoch</h3>
                  <p className="text-muted">enoch@example.com</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                    Pro Plan
                  </span>
                </div>
              </div>
              <button className="w-full py-2 border border-card-border rounded-lg text-sm text-foreground hover:bg-input-bg transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        )}

        {activeSection === "privacy" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Privacy & Security
            </h2>
            <p className="text-muted mb-8">
              Manage your data and security settings
            </p>
            <div className="space-y-4">
              {[
                "Two-Factor Authentication",
                "Session Management",
                "Data Export",
                "Delete Account",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-4 bg-card-bg border border-card-border rounded-xl"
                >
                  <span className="font-medium text-foreground">{item}</span>
                  <ChevronRight className="w-5 h-5 text-muted" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "language" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Language & Region
            </h2>
            <p className="text-muted mb-8">
              Set your preferred language and time zone
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-card-bg border border-card-border rounded-xl">
                <label className="text-sm font-medium text-foreground block mb-2">
                  Language
                </label>
                <select className="w-full p-2 bg-input-bg rounded-lg text-foreground border-none outline-none">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Japanese</option>
                </select>
              </div>
              <div className="p-4 bg-card-bg border border-card-border rounded-xl">
                <label className="text-sm font-medium text-foreground block mb-2">
                  Time Zone
                </label>
                <select className="w-full p-2 bg-input-bg rounded-lg text-foreground border-none outline-none">
                  <option>UTC (Coordinated Universal Time)</option>
                  <option>EST (Eastern Standard Time)</option>
                  <option>PST (Pacific Standard Time)</option>
                  <option>CET (Central European Time)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeSection === "data" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Data & Storage
            </h2>
            <p className="text-muted mb-8">
              Manage cached data and storage usage
            </p>
            <div className="bg-card-bg border border-card-border rounded-xl p-6">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">Cache Usage</span>
                  <span className="text-muted">245 MB / 1 GB</span>
                </div>
                <div className="w-full h-2 bg-input-bg rounded-full">
                  <div className="w-1/4 h-2 bg-blue-600 rounded-full" />
                </div>
              </div>
              <button className="w-full py-2 border border-card-border rounded-lg text-sm text-foreground hover:bg-input-bg transition-colors">
                Clear Cache
              </button>
            </div>
          </div>
        )}

        {activeSection === "api" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-2">API Keys</h2>
            <p className="text-muted mb-8">
              Manage API integrations and keys
            </p>
            <div className="space-y-4">
              {[
                { name: "CelesTrak API", status: "Connected" },
                { name: "OpenStreetMap", status: "Connected" },
                { name: "Weather API", status: "Not configured" },
              ].map((api) => (
                <div
                  key={api.name}
                  className="flex items-center justify-between p-4 bg-card-bg border border-card-border rounded-xl"
                >
                  <div>
                    <p className="font-medium text-foreground">{api.name}</p>
                    <p
                      className={`text-sm ${
                        api.status === "Connected"
                          ? "text-green-500"
                          : "text-muted"
                      }`}
                    >
                      {api.status}
                    </p>
                  </div>
                  <button className="px-4 py-2 border border-card-border rounded-lg text-sm text-foreground hover:bg-input-bg transition-colors">
                    Configure
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
