import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Hero3DScene } from "./Hero3DScene";

export function HeroSection() {
  return (
    <section className="relative w-full pt-12 pb-20 md:pt-20 md:pb-28 lg:pt-24 lg:pb-36 overflow-hidden bg-background">
      {/* Soft Ambient Backdrop Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Clean, Asymmetric Headline & Decisive Action */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Subtle Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Commercial Route Servicing</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-6">
              SERVICING COMMERCIAL <br />
              <span className="text-accent">
                KITCHEN OIL
              </span>{" "}
              ON-SITE.
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-content-secondary leading-relaxed max-w-lg mb-8">
              We travel to your restaurant or cafe on a set schedule. We filter your cooking oil at operating temperatures, deep clean the vats, and restock fresh oil — before your morning shift starts.
            </p>

            {/* Primary Action Buttons (Side-by-side on mobile & desktop) */}
            <div className="flex flex-row items-center gap-3 w-full sm:w-auto mb-4">
              <a
                href="#quote-calculator"
                className="btn-accent text-sm sm:text-base py-3.5 px-4 sm:px-8 font-bold flex-1 sm:flex-initial text-center justify-center whitespace-nowrap"
              >
                <span>Book a Service</span>
                <ArrowRight className="w-4 h-4 ml-1 hidden sm:inline" />
              </a>
              <a
                href="#pricing"
                className="btn-outline-surface text-sm sm:text-base py-3.5 px-4 sm:px-6 font-medium flex-1 sm:flex-initial text-center justify-center whitespace-nowrap"
              >
                See Pricing
              </a>
            </div>

            {/* Quiet Friction-Reducing Trust Line */}
            <div className="flex items-center gap-2 text-xs text-content-muted mt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No contracts • EPA certified disposal • Fully insured</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Cinematic Visual Scene */}
          <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
            <Hero3DScene />
          </div>

        </div>
      </div>
    </section>
  );
}
