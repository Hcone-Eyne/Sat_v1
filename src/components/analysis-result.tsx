"use client";

import { useState, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Brain,
  MapPin,
  Maximize2,
} from "lucide-react";
import type { AnalysisResult as AnalysisResultType } from "@/lib/mock-data";
import BeforeAfter from "./before-after";
import ExecutionSummary from "./execution-summary";
import Lightbox from "./lightbox";

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.min(100, Math.round(confidence * 100));
  const color =
    pct >= 90
      ? "text-green-500 bg-green-500/10"
      : pct >= 75
        ? "text-blue-500 bg-blue-500/10"
        : "text-yellow-500 bg-yellow-500/10";

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {pct >= 90 ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : pct >= 75 ? (
        <Brain className="w-3 h-3" />
      ) : (
        <AlertCircle className="w-3 h-3" />
      )}
      {pct}% confidence
    </span>
  );
}

function SpecialistBadge({ specialist }: { specialist: string }) {
  const labels: Record<string, string> = {
    "change-detection": "Change Detection",
    "flood-analysis": "Water Analysis",
    "object-detection": "Building Detection",
    "vegetation-analysis": "Vegetation Analysis",
    "optical-sar-fusion": "Optical + SAR Fusion",
    "visual-qa": "Visual QA",
  };

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500">
      {labels[specialist] || specialist}
    </span>
  );
}

export default function AnalysisResult({ result }: { result: AnalysisResultType }) {
  const [showDetails, setShowDetails] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleEvidenceClick = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const lightboxImages = result.evidence.map((e) => ({
    src: e.tileUrl,
    alt: e.label,
    label: `${result.specialist} analysis`,
  }));

  return (
    <div className="space-y-3 min-w-[260px] max-w-[320px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <SpecialistBadge specialist={result.specialist} />
        <ConfidenceBadge confidence={result.confidence} />
      </div>

      {/* Location */}
      {result.lat !== 0 && result.lng !== 0 && (
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <MapPin className="w-3 h-3" />
          {Math.abs(result.lat).toFixed(4)}°{result.lat >= 0 ? "N" : "S"}, {Math.abs(result.lng).toFixed(4)}°{result.lng >= 0 ? "E" : "W"}
        </div>
      )}

      {/* Summary */}
      <p className="body-text text-foreground">{result.summary}</p>

      {/* Findings */}
      <div className="space-y-1.5">
        {result.findings.map((f, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
            <span className="label-text text-foreground">{f}</span>
          </div>
        ))}
      </div>

      {/* Evidence — real satellite tiles */}
      {result.evidence.length > 0 && (
        <div className="space-y-1.5">
          <p className="label-text text-muted">Evidence — Satellite Imagery</p>
          <div className="flex gap-2">
            {result.evidence.map((e, i) => (
              <div
                key={i}
                tabIndex={0}
                role="button"
                aria-label={`View ${e.label} full size`}
                className="flex-1 h-20 rounded-lg border border-card-border overflow-hidden relative bg-gray-200 dark:bg-gray-800 cursor-pointer group"
                onClick={() => handleEvidenceClick(i)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleEvidenceClick(i); } }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={e.tileUrl}
                  alt={e.label}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  onError={(ev) => {
                    const img = ev.target as HTMLImageElement;
                    img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23374151' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' fill='%239ca3af' text-anchor='middle' dy='.3em' font-size='10'%3ETile unavailable%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-black/60 rounded">
                    <Maximize2 className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-end p-1.5 bg-gradient-to-t from-black/50 to-transparent">
                  <span className="label-text text-[10px] text-white px-1.5 py-0.5 rounded">
                    {e.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="pressable-subtle flex items-center gap-1 label-text text-blue-500 hover:text-blue-600"
      >
        {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {showDetails ? "Hide details" : "View full analysis"}
      </button>

      {/* Expanded details */}
      {showDetails && (
        <div className="space-y-3 pt-2 border-t border-card-border">
          {/* Before/After */}
          {result.beforeAfter && (
            <div>
              <p className="label-text text-muted mb-2">Before / After Comparison</p>
              <BeforeAfter
                beforeLabel={result.beforeAfter.beforeLabel}
                afterLabel={result.beforeAfter.afterLabel}
                beforeTileUrl={result.beforeAfter.beforeTileUrl}
                afterTileUrl={result.beforeAfter.afterTileUrl}
                findings={result.beforeAfter.findings}
              />
            </div>
          )}

          {/* Execution Summary */}
          <div>
            <p className="label-text text-muted mb-2">Execution Summary</p>
            <ExecutionSummary
              models={result.modelsUsed}
              totalDuration={result.totalDuration}
            />
          </div>
        </div>
      )}

      {lightboxIndex !== null && lightboxImages.length > 0 && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
