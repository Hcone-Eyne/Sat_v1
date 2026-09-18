"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxImage {
  src: string;
  alt: string;
  label?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex = 0, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  const resetTransform = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale((s) => Math.min(s * 1.5, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((s) => Math.max(s / 1.5, 0.5));
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale((s) => Math.min(s * 1.1, 5));
    } else {
      setScale((s) => Math.max(s / 1.1, 0.5));
    }
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [scale, position]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (scale > 1) {
      resetTransform();
    } else {
      setScale(2.5);
    }
  }, [scale, resetTransform]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      resetTransform();
    }
  }, [currentIndex, resetTransform]);

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((i) => i + 1);
      resetTransform();
    }
  }, [currentIndex, images.length, resetTransform]);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = currentImage.src;
    link.download = currentImage.alt.replace(/\s+/g, "-").toLowerCase() || "satellite-image.png";
    link.click();
  }, [currentImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          handlePrev();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "0":
          resetTransform();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handlePrev, handleNext, handleZoomIn, handleZoomOut, resetTransform]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-10">
        <div className="flex items-center gap-3">
          <span className="text-white/80 text-sm font-medium">
            {currentImage.alt}
          </span>
          {currentImage.label && (
            <span className="text-white/50 text-xs bg-white/10 px-2 py-0.5 rounded">
              {currentImage.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {hasMultiple && (
            <span className="text-white/50 text-xs mr-2">
              {currentIndex + 1} / {images.length}
            </span>
          )}
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Zoom out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Zoom in (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={resetTransform}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Reset (0)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation arrows */}
      {hasMultiple && currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {hasMultiple && currentIndex < images.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white/70 hover:text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Image container */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        style={{ touchAction: "none" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-w-[90vw] max-h-[85vh] object-contain select-none transition-transform duration-100"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
          draggable={false}
          onError={(ev) => {
            const img = ev.target as HTMLImageElement;
            img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%231e293b' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' fill='%2394a3b8' text-anchor='middle' dy='.3em' font-size='14'%3EImage unavailable%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>

      {/* Bottom thumbnails */}
      {hasMultiple && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                resetTransform();
              }}
              className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                i === currentIndex
                  ? "border-blue-500 scale-110"
                  : "border-white/20 opacity-60 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom indicator */}
      {scale !== 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 rounded-full text-white/70 text-xs">
          {Math.round(scale * 100)}%
        </div>
      )}
    </div>
  );
}
