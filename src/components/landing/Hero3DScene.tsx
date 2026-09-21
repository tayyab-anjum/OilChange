"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

export function Hero3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || prefersReducedMotion) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  // Smooth subtle 3D perspective tilt
  const transformStyle = prefersReducedMotion
    ? "none"
    : `perspective(1000px) rotateY(${mousePos.x * 5}deg) rotateX(${-mousePos.y * 4}deg) scale3d(${
        isHovered ? 1.015 : 1
      }, ${isHovered ? 1.015 : 1}, 1)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[16/10] max-w-[620px] rounded-2xl overflow-hidden border border-surface-border bg-[#141618] shadow-2xl transition-all duration-300 group"
      style={{
        transform: transformStyle,
        transformStyle: "preserve-3d",
        transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease",
      }}
      aria-label="Commercial oil service scene: FryerCare technician and custom filtration van at restaurant back entrance"
      role="img"
    >
      {/* High-Resolution Photorealistic Image */}
      <Image
        src="/images/hero-service-van.jpg"
        alt="FryerCare technician servicing a commercial restaurant back entrance"
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 620px"
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Clean, Subtle Vignette & Warm Amber Horizon Reflection */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />

      {/* Minimal Live Status Badge (Single, quiet indicator) */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/85 backdrop-blur-md border border-white/10 text-xs text-white shadow-lg pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold tracking-wide">Route Unit #01 Active</span>
      </div>

      {/* Subtle Caption Bar at the Bottom */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-content-secondary px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-md border border-white/5 pointer-events-none">
        <span>On-Site Commercial Hot Micro-Filtration</span>
        <span className="text-accent font-mono">Zero Downtime</span>
      </div>
    </div>
  );
}
