"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { GripVertical, CheckCircle2, Maximize2 } from "lucide-react";
import Lightbox from "./lightbox";

interface BeforeAfterProps {
  beforeLabel: string;
  afterLabel: string;
  beforeTileUrl: string;
  afterTileUrl: string;
  findings: string[];
}

export default function BeforeAfter({
  beforeLabel,
  afterLabel,
  beforeTileUrl,
  afterTileUrl,
  findings,
}: BeforeAfterProps) {
  const [split, setSplit] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);
  const [lightboxSide, setLightboxSide] = useState<"before" | "after" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    setContainerWidth(el.offsetWidth);
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onPointerDown = useCallback(() => {
    dragging.current = true;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSplit(pct);
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div className="space-y-3">
      {/* Split view with real satellite tiles */}
      <div
        ref={containerRef}
        className="relative w-full h-48 rounded-xl overflow-hidden border border-card-border select-none cursor-col-resize"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* After (full width) */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterTileUrl}
            alt={afterLabel}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            onError={(ev) => {
              const img = ev.target as HTMLImageElement;
              img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23374151' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' fill='%239ca3af' text-anchor='middle' dy='.3em' font-size='12'%3ETile unavailable%3C/text%3E%3C/svg%3E";
            }}
          />
          <div className="absolute bottom-2 right-2 label-text text-[10px] text-white bg-black/50 px-2 py-0.5 rounded">
            {afterLabel}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxSide("after");
            }}
            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-lg transition-colors opacity-0 hover:opacity-100"
          >
            <Maximize2 className="w-3 h-3 text-white" />
          </button>
        </div>

        {/* Before (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${split}%` }}
        >
          <div className="relative h-full" style={{ width: containerWidth ? `${containerWidth}px` : "100%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={beforeTileUrl}
              alt={beforeLabel}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onError={(ev) => {
                const img = ev.target as HTMLImageElement;
                img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23374151' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' fill='%239ca3af' text-anchor='middle' dy='.3em' font-size='12'%3ETile unavailable%3C/text%3E%3C/svg%3E";
              }}
            />
            <div className="absolute bottom-2 left-2 label-text text-[10px] text-white bg-black/50 px-2 py-0.5 rounded">
              {beforeLabel}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxSide("before");
              }}
              className="absolute top-2 left-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-lg transition-colors opacity-0 hover:opacity-100"
            >
              <Maximize2 className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 flex items-center z-10"
          style={{ left: `${split}%`, transform: "translateX(-50%)" }}
          onPointerDown={onPointerDown}
        >
          <div className="w-0.5 h-full bg-white/80" />
          <div className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-card-border">
            <GripVertical className="w-4 h-4 text-muted" />
          </div>
        </div>
      </div>

      {/* Findings */}
      {findings.length > 0 && (
        <div className="space-y-1.5">
          {findings.map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
              <span className="label-text text-foreground">{f}</span>
            </div>
          ))}
        </div>
      )}

      {lightboxSide && (
        <Lightbox
          images={[
            { src: beforeTileUrl, alt: beforeLabel, label: "Before" },
            { src: afterTileUrl, alt: afterLabel, label: "After" },
          ]}
          initialIndex={lightboxSide === "before" ? 0 : 1}
          onClose={() => setLightboxSide(null)}
        />
      )}
    </div>
  );
}
