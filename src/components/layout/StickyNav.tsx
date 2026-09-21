"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Menu, X, ArrowRight, ShieldCheck, PhoneCall, Calendar } from "lucide-react";

export function StickyNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          isScrolled || mobileMenuOpen
            ? "bg-[#1A1D20] border-b border-surface-border shadow-elevation-sticky py-3"
            : "bg-[#1A1D20]/95 backdrop-blur-md border-b border-surface-border/50 py-4.5"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-accent rounded-md"
            aria-label="FryerCare Homepage"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-accent text-white shadow-accent-glow transition-transform duration-200 group-hover:scale-105">
              <Flame className="w-6 h-6 fill-white" />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-background" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-2xl font-bold tracking-tight text-white leading-none">
                FRYERCARE
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted font-bold">
                B2B Oil Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-8 text-sm font-medium text-content-secondary"
            aria-label="Main navigation"
          >
            <a
              href="#process"
              onClick={(e) => handleScrollTo(e, "#process")}
              className="hover:text-accent transition-colors duration-150 py-1"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              onClick={(e) => handleScrollTo(e, "#pricing")}
              className="hover:text-accent transition-colors duration-150 py-1"
            >
              Pricing & Plans
            </a>
            <a
              href="#quote-calculator"
              onClick={(e) => handleScrollTo(e, "#quote-calculator")}
              className="hover:text-accent transition-colors duration-150 py-1"
            >
              Route Calculator
            </a>
            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, "#contact")}
              className="hover:text-accent transition-colors duration-150 py-1"
            >
              Contact
            </a>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-content-secondary hover:text-white px-3 py-2 transition-colors rounded-md focus-visible:ring-2 focus-visible:ring-accent"
            >
              Log in
            </Link>
            <a
              href="#quote-calculator"
              onClick={(e) => handleScrollTo(e, "#quote-calculator")}
              className="btn-accent text-sm"
            >
              Book a Service
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </a>
          </div>

          {/* Mobile Actions: Log in + Hamburger Button */}
          <div className="flex items-center gap-2.5 md:hidden">
            <Link
              href="/login"
              className="text-xs font-semibold text-content-secondary hover:text-white px-3 py-2 bg-surface border border-surface-border rounded-lg"
            >
              Log in
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-11 h-11 rounded-lg border border-surface-border bg-surface text-content-primary hover:bg-surface-elevated focus-visible:ring-2 focus-visible:ring-accent active:scale-95 transition-transform"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-accent" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* FULL SOLID MOBILE OVERLAY DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[61px] bottom-0 z-40 bg-[#16181B] border-t border-surface-border overflow-y-auto flex flex-col justify-between p-6 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2 text-base font-semibold">
            <div className="text-xs font-mono uppercase tracking-wider text-accent font-bold px-3 py-2">
              Route Navigation
            </div>
            
            <a
              href="#process"
              onClick={(e) => handleScrollTo(e, "#process")}
              className="px-4 py-3.5 rounded-xl bg-surface border border-surface-border text-white hover:border-accent hover:text-accent transition-all flex items-center justify-between shadow-sm"
            >
              <span>How It Works</span>
              <ArrowRight className="w-4 h-4 text-accent" />
            </a>

            <a
              href="#pricing"
              onClick={(e) => handleScrollTo(e, "#pricing")}
              className="px-4 py-3.5 rounded-xl bg-surface border border-surface-border text-white hover:border-accent hover:text-accent transition-all flex items-center justify-between shadow-sm"
            >
              <span>Pricing & Plans</span>
              <ArrowRight className="w-4 h-4 text-accent" />
            </a>

            <a
              href="#quote-calculator"
              onClick={(e) => handleScrollTo(e, "#quote-calculator")}
              className="px-4 py-3.5 rounded-xl bg-surface border border-surface-border text-white hover:border-accent hover:text-accent transition-all flex items-center justify-between shadow-sm"
            >
              <span>Route Calculator</span>
              <ArrowRight className="w-4 h-4 text-accent" />
            </a>

            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, "#contact")}
              className="px-4 py-3.5 rounded-xl bg-surface border border-surface-border text-white hover:border-accent hover:text-accent transition-all flex items-center justify-between shadow-sm"
            >
              <span>Contact & Dispatch</span>
              <ArrowRight className="w-4 h-4 text-accent" />
            </a>
          </nav>

          {/* Bottom Actions & Support in Mobile Menu */}
          <div className="pt-6 pb-4 border-t border-surface-border flex flex-col gap-3 mt-6">
            <a
              href="#quote-calculator"
              onClick={(e) => handleScrollTo(e, "#quote-calculator")}
              className="btn-accent w-full py-4 text-center text-base font-bold shadow-lg"
            >
              Book a Service Now
            </a>

            <a
              href="tel:1800379372"
              className="w-full py-3.5 rounded-pill bg-surface border border-surface-border text-center text-sm font-semibold text-content-primary flex items-center justify-center gap-2 hover:border-accent"
            >
              <PhoneCall className="w-4 h-4 text-accent" />
              <span>Call Dispatch: (800) 379-3722</span>
            </a>

            <div className="flex items-center justify-center gap-2 text-xs text-content-muted pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Dedicated Solo Operator • Licensed & Insured</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
