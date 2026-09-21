import React from "react";
import Link from "next/link";
import { Flame, ShieldCheck, Phone, Mail, MapPin, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#121416] border-t border-surface-border text-content-secondary pt-16 pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-4 group"
              aria-label="FryerCare Homepage"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent text-white shadow-accent-glow">
                <Flame className="w-5 h-5 fill-white" />
              </div>
              <span className="font-headline text-2xl font-bold tracking-tight text-white">
                FRYERCARE
              </span>
            </Link>
            <p className="text-sm text-content-muted leading-relaxed mb-6 max-w-sm">
              Dedicated mobile commercial kitchen oil servicing, micro-filtration, and eco-certified recycling. Eliminating kitchen hazards and extending oil life for hospitality operators.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-pill">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>EPA Licensed Used Cooking Oil Transporter</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-headline text-base font-bold text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#pricing" className="hover:text-accent transition-colors">
                  Weekly Route Service
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-accent transition-colors">
                  Bi-Weekly Filtration
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-accent transition-colors">
                  One-Time Deep Boil-Out
                </a>
              </li>
              <li>
                <a href="#quote-calculator" className="hover:text-accent transition-colors">
                  Emergency Drain & Restock
                </a>
              </li>
            </ul>
          </div>

          {/* Service Areas */}
          <div className="lg:col-span-3">
            <h4 className="font-headline text-base font-bold text-white uppercase tracking-wider mb-4">
              Operational Corridors
            </h4>
            <ul className="space-y-2.5 text-sm text-content-muted">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>Downtown & Metro Hospitality Hubs</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>North & East Suburbs Commercial Strip</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>South Corridor Food Courts & Cafes</span>
              </li>
              <li className="text-xs text-content-subtle pt-1">
                Dispatch Window: 5:00 AM – 11:00 PM Daily
              </li>
            </ul>
          </div>

          {/* Solo Operator Dispatch Hotline */}
          <div className="lg:col-span-3">
            <h4 className="font-headline text-base font-bold text-white uppercase tracking-wider mb-4">
              Direct Route Dispatch
            </h4>
            <div className="surface-panel p-4 rounded-xl border-surface-border mb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-content-subtle uppercase block">Direct Van Line</span>
                  <a href="tel:1800379372" className="text-sm font-bold text-white hover:text-accent">
                    (800) 379-3722
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-content-secondary">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-content-subtle uppercase block">Route Coordination</span>
                  <a href="mailto:dispatch@fryercare.com" className="text-xs text-content-secondary hover:text-white">
                    dispatch@fryercare.com
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-content-subtle">
          <p>© {new Date().getFullYear()} FryerCare Services. All rights reserved. Commercial Trade Operations.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-content-muted hover:text-accent font-mono transition-colors flex items-center gap-1"
            >
              <span>Operator Portal Access</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
