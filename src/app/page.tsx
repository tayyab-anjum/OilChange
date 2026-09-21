import React from "react";
import { StickyNav } from "@/components/layout/StickyNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProcessRow } from "@/components/landing/ProcessRow";
import { PricingCards } from "@/components/landing/PricingCards";
import { TrustStats } from "@/components/landing/TrustStats";
import { QuotationEngine } from "@/components/booking/QuotationEngine";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Footer } from "@/components/layout/Footer";
import { PhoneCall, ShieldCheck, Mail, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Sticky Navigation */}
      <StickyNav />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Hero Section with Interactive 3D Perspective Viewport */}
        <HeroSection />

        {/* 3-Step Process Row */}
        <ProcessRow />

        {/* Pricing Cards Comparison */}
        <PricingCards />

        {/* Trust Signals & Verified Operational Metrics */}
        <TrustStats />

        {/* Dynamic Interactive Booking & Route Quotation Engine */}
        <section
          id="quote-calculator"
          className="py-20 md:py-32 bg-background border-t border-surface-border scroll-mt-24"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="badge-accent mb-3">Instant Route Dispatch</span>
              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                CALCULATE YOUR ROUTE SERVICE RATE
              </h2>
              <p className="text-content-secondary text-base">
                Configure your kitchen type, vat count, and preferred schedule. Pricing recalculates live with zero hidden fees.
              </p>
            </div>

            {/* Quotation Engine Form */}
            <QuotationEngine />
          </div>
        </section>

        {/* Contact & Enquiry Section */}
        <section
          id="contact"
          className="py-20 md:py-32 bg-[#15171A] border-t border-surface-border scroll-mt-24"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="badge-accent mb-3">Direct Technician Dispatch</span>
              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                GET IN TOUCH WITH OUR ROUTE LEAD
              </h2>
              <p className="text-content-secondary text-base">
                Have custom multi-location fleet requirements, emergency boil-out questions, or need a callback? Send us a direct dispatch message.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 4-Columns: Quick Contact Info */}
              <div className="lg:col-span-4 space-y-4">
                <div className="surface-panel p-6 rounded-card border-surface-border">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mb-4">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <h4 className="font-headline text-lg font-bold text-white mb-1">
                    Direct Van Phone
                  </h4>
                  <p className="text-xs text-content-muted mb-3">
                    Fast operator response during active route hours.
                  </p>
                  <a
                    href="tel:1800379372"
                    className="font-headline text-xl font-bold text-accent hover:underline block"
                  >
                    (800) 379-3722
                  </a>
                </div>

                <div className="surface-panel p-6 rounded-card border-surface-border">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h4 className="font-headline text-lg font-bold text-white mb-1">
                    Route Dispatch Email
                  </h4>
                  <p className="text-xs text-content-muted mb-3">
                    Send floor plans, kitchen specs, or RFPs.
                  </p>
                  <a
                    href="mailto:dispatch@fryercare.com"
                    className="text-sm font-semibold text-white hover:text-accent transition-colors"
                  >
                    dispatch@fryercare.com
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-surface-elevated/60 border border-surface-border text-xs text-content-muted flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Licensed & certified used cooking oil transporter. Full EPA manifest provided.</span>
                </div>
              </div>

              {/* Right 8-Columns: Interactive Enquiry Form */}
              <div className="lg:col-span-8">
                <EnquiryForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
