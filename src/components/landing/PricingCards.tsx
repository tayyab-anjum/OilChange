"use client";

import React from "react";
import { Check, Flame, ArrowRight, Zap, Clock, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PricingCards() {
  const scrollToCalculator = (planType: "subscription" | "one_time") => {
    const el = document.querySelector("#quote-calculator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      // Custom event to update calculator if needed
      window.dispatchEvent(
        new CustomEvent("fryercare:set-plan", { detail: { planType } })
      );
    }
  };

  return (
    <section
      id="pricing"
      className="relative py-20 md:py-32 bg-background scroll-mt-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="badge-accent mb-3">Transparent Commercial Rates</span>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-content-primary tracking-tight mb-4">
            PREDICTABLE PRICING. ZERO SURPRISES.
          </h2>
          <p className="text-content-secondary text-base">
            Choose regular scheduled maintenance for maximum oil lifespan, or book an on-demand deep clean when your kitchen needs it most.
          </p>
        </div>

        {/* Dual Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* CARD 1: Scheduled Subscription (RECOMMENDED) */}
          <div className="relative rounded-cardLg border-2 border-accent bg-gradient-to-b from-[#252A2F] via-surface to-[#1F2327] p-8 md:p-10 flex flex-col justify-between shadow-accent-glow transition-all duration-300 hover:shadow-accent-glow-lg group">
            {/* Top Pill Highlight */}
            <div className="absolute -top-4 left-8">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-pill bg-accent text-white font-extrabold text-xs uppercase tracking-wider shadow-md">
                <Flame className="w-3.5 h-3.5 fill-white" />
                RECOMMENDED ROUTE PLAN
              </span>
            </div>

            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-4 pt-2">
                <div>
                  <h3 className="font-headline text-3xl font-bold text-white mb-1">
                    Scheduled Subscription
                  </h3>
                  <p className="text-content-muted text-sm">
                    Automated weekly, bi-weekly, or monthly route visits.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-accent font-bold uppercase block">
                    Equivalent To
                  </span>
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="font-headline text-4xl md:text-5xl font-black text-white">
                      $3.50
                    </span>
                    <span className="text-content-muted text-xs">/day/vat</span>
                  </div>
                  <span className="text-[11px] text-content-subtle block">Billed $49/visit baseline</span>
                </div>
              </div>

              {/* Value Banner */}
              <div className="bg-accent/10 border border-accent/25 rounded-xl p-3.5 mb-6 flex items-center gap-3 text-xs text-amber-200">
                <Zap className="w-4 h-4 text-accent shrink-0" />
                <span>Extends cooking oil lifespan by up to 50% — cutting your monthly oil spend.</span>
              </div>

              {/* Checklist */}
              <ul className="space-y-3.5 mb-8 text-sm text-content-secondary">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>High-Temp Micro-Filtration</strong> (removes micro-crumbs & carbon)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Full Used Cooking Oil Containment</strong> & certified EPA recycling</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Priority Route Dispatch</strong> & zero-notice emergency callouts</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Automated Digital Compliance Manifests</strong> for health inspectors</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Free Fresh Oil Delivery</strong> alongside filtration pass</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div>
              <button
                type="button"
                onClick={() => scrollToCalculator("subscription")}
                className="btn-accent w-full py-4 text-base font-bold flex items-center justify-center gap-2"
              >
                <span>Start Scheduled Service</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-center text-[11px] text-content-muted mt-2.5">
                No long-term contracts • Pause or cancel with 48 hours notice
              </p>
            </div>
          </div>

          {/* CARD 2: One-Time Service */}
          <div className="relative rounded-cardLg border border-surface-border bg-surface p-8 md:p-10 flex flex-col justify-between shadow-elevation-card transition-all duration-300 hover:border-surface-border/80 hover:bg-surface-elevated">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-headline text-3xl font-bold text-white mb-1">
                    One-Time Service
                  </h3>
                  <p className="text-content-muted text-sm">
                    On-demand emergency recovery or deep-clean boil-out.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-content-muted uppercase block">
                    Starting At
                  </span>
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="font-headline text-4xl md:text-5xl font-black text-white">
                      $85
                    </span>
                    <span className="text-content-muted text-xs">/visit</span>
                  </div>
                  <span className="text-[11px] text-content-subtle block">Flat base + $25/vat</span>
                </div>
              </div>

              {/* Sub-banner */}
              <div className="bg-background-subtle border border-surface-border rounded-xl p-3.5 mb-6 flex items-center gap-3 text-xs text-content-secondary">
                <Clock className="w-4 h-4 text-content-muted shrink-0" />
                <span>Perfect for pre-inspection cleans or sudden kitchen staffing shortages.</span>
              </div>

              {/* Checklist */}
              <ul className="space-y-3.5 mb-8 text-sm text-content-secondary">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-surface-elevated border border-surface-border flex items-center justify-center text-content-primary shrink-0">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span><strong>Complete Vat Drain & Boil-Out</strong> tank scrub</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-surface-elevated border border-surface-border flex items-center justify-center text-content-primary shrink-0">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span><strong>Immediate Used Oil Evacuation</strong> into mobile sealed tank</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-surface-elevated border border-surface-border flex items-center justify-center text-content-primary shrink-0">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span><strong>Heating Element Degreasing</strong> & crumb trap flush</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-surface-elevated border border-surface-border flex items-center justify-center text-content-primary shrink-0">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span><strong>Certified Waste Manifest</strong> for regulatory records</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-surface-elevated border border-surface-border flex items-center justify-center text-content-primary shrink-0">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span><strong>Fresh Oil Fill-Up (Optional)</strong> or customer oil restock</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div>
              <button
                type="button"
                onClick={() => scrollToCalculator("one_time")}
                className="btn-outline-surface w-full py-4 text-base font-semibold flex items-center justify-center gap-2 hover:border-accent"
              >
                <span>Get One-Time Quote</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-center text-[11px] text-content-muted mt-2.5">
                Calculates instantly based on your exact vat count
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
