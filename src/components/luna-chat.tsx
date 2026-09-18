"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, Loader2, MapPin } from "lucide-react";
import { askLuna, type LunaResponse } from "@/lib/luna-ai";
import { LUNA_GREETING } from "@/lib/mock-data";
import AnalysisResult from "./analysis-result";

interface Message {
  id: string;
  role: "user" | "luna";
  content: string;
  response?: LunaResponse;
}

interface LunaChatProps {
  selectedLocation: { lat: number; lng: number } | null;
}

function SafeMarkdown({ content, className }: { content: string; className?: string }) {
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return (
    <p className={className}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part.split("\n").map((line, j, arr) => (
          <span key={`${i}-${j}`}>
            {line}
            {j < arr.length - 1 && <br />}
          </span>
        ));
      })}
    </p>
  );
}

export default function LunaChat({ selectedLocation }: LunaChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "greeting", role: "luna", content: LUNA_GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedLocation) {
      inputRef.current?.focus();
    }
  }, [selectedLocation]);

  const handleSend = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;

    if (!selectedLocation) {
      setMessages((prev) => [
        ...prev,
        {
          id: `u-${Date.now()}`,
          role: "user",
          content: q,
        },
        {
          id: `l-${Date.now()}`,
          role: "luna",
          content: "Please click on the map first to select a location, then ask me about it.",
          response: { type: "error" },
        },
      ]);
      setInput("");
      return;
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: q,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await askLuna(q, selectedLocation.lat, selectedLocation.lng);
      const lunaMsg: Message = {
        id: `l-${Date.now()}`,
        role: "luna",
        content: response.result?.summary || "I couldn't analyze that.",
        response,
      };
      setMessages((prev) => [...prev, lunaMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `l-${Date.now()}`,
          role: "luna",
          content: "Something went wrong. Try again.",
          response: { type: "error" },
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, selectedLocation]);

  const suggestions = [
    "Is there water here?",
    "What changed here?",
    "Are there buildings?",
    "What about vegetation?",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 material-header border-b border-card-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h2 className="heading-card text-foreground">Luna</h2>
            <p className="label-text text-muted">Satellite AI Assistant</p>
          </div>
        </div>
      </div>

      {/* Location indicator */}
      {selectedLocation && (
        <div className="shrink-0 px-4 py-2 bg-blue-500/5 border-b border-card-border flex items-center gap-2">
          <MapPin className="w-3 h-3 text-blue-500" />
          <span className="label-text text-muted">
            {selectedLocation.lat.toFixed(4)}°N, {Math.abs(selectedLocation.lng).toFixed(4)}°W
          </span>
        </div>
      )}
      {!selectedLocation && (
        <div className="shrink-0 px-4 py-2 bg-yellow-500/5 border-b border-card-border flex items-center gap-2">
          <MapPin className="w-3 h-3 text-yellow-500" />
          <span className="label-text text-yellow-600 dark:text-yellow-400">
            Click on the map to select a location
          </span>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 rubber-band">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-card-bg border border-card-border"
              }`}
            >
              {msg.role === "luna" && msg.response?.type === "analysis" && msg.response.result ? (
                <AnalysisResult result={msg.response.result} />
              ) : (
                <SafeMarkdown
                  content={msg.content}
                  className={`body-text whitespace-pre-wrap ${
                    msg.role === "user" ? "text-white" : "text-foreground"
                  }`}
                />
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-card-bg border border-card-border rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              <span className="label-text text-muted">Analyzing satellite data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && selectedLocation && (
        <div className="shrink-0 px-4 pb-2">
          <p className="label-text text-muted mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setInput(s);
                  inputRef.current?.focus();
                }}
                className="pressable-subtle text-xs px-3 py-1.5 rounded-full border border-card-border bg-card-bg text-muted hover:text-foreground hover:border-blue-300 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 p-4 border-t border-card-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedLocation
                ? "Ask Luna about this location..."
                : "Click on the map first..."
            }
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-input-bg border border-card-border text-foreground placeholder:text-muted body-text focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="pressable w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
