"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  VENUE_TYPES,
  SERVICE_FREQUENCIES,
  AVAILABLE_ADDONS,
  calculateQuotePrice,
  type VenueType,
  type ServiceFrequency,
} from "@/lib/pricing";
import {
  Building2,
  Flame,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  PhoneCall,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export function QuotationEngine() {
  // Mobile step state: 1 = Service Config, 2 = Venue Contact & Confirm
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // State for quote parameters
  const [venueType, setVenueType] = useState<VenueType>("restaurant");
  const [fryerCount, setFryerCount] = useState<number>(2);
  const [frequency, setFrequency] = useState<ServiceFrequency | "">("weekly");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // State for contact & schedule details
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDay, setPreferredDay] = useState("monday");
  const [preferredTimeWindow, setPreferredTimeWindow] = useState("morning_pre_open");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // UI / Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [bookingSuccess, setBookingSuccess] = useState<{
    referenceCode: string;
    estimatedPrice: number;
    isSubscription: boolean;
  } | null>(null);

  // Listen for custom external events from pricing cards
  useEffect(() => {
    const handleSetPlan = (e: Event) => {
      const customEvent = e as CustomEvent<{ planType: "subscription" | "one_time" }>;
      if (customEvent.detail?.planType === "subscription") {
        setFrequency("weekly");
      } else if (customEvent.detail?.planType === "one_time") {
        setFrequency("one_time");
      }
      // Scroll smoothly to quote engine
      document.querySelector("#quote-calculator")?.scrollIntoView({ behavior: "smooth" });
    };
    window.addEventListener("fryercare:set-plan", handleSetPlan);
    return () => window.removeEventListener("fryercare:set-plan", handleSetPlan);
  }, []);

  // Reactive price calculation
  const calculation = useMemo(() => {
    return calculateQuotePrice({
      venueType,
      fryerCount,
      frequency,
      selectedAddonIds: selectedAddons,
    });
  }, [venueType, fryerCount, frequency, selectedAddons]);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleFryerChange = (delta: number) => {
    setFryerCount((prev) => Math.max(1, Math.min(20, prev + delta)));
  };

  const validateStep1 = () => {
    if (!frequency) {
      setServerError("Please choose a service frequency (Weekly, Bi-Weekly, Monthly, or One-Time).");
      return false;
    }
    setServerError(null);
    return true;
  };

  const handleProceedToStep2 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      // Smooth scroll up to top of calculator on mobile
      const el = document.querySelector("#quote-calculator");
      if (el && window.innerWidth < 1024) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});

    if (!frequency) {
      setServerError("Please select a service frequency option.");
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          contactName,
          email,
          phone,
          address,
          venueType,
          fryerCount,
          frequency,
          selectedAddonIds: selectedAddons,
          preferredDay,
          preferredTimeWindow,
          specialInstructions,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.fieldErrors) {
          setFieldErrors(json.fieldErrors);
        }
        setServerError(json.error || "Failed to submit booking. Please verify required fields.");
      } else {
        setBookingSuccess({
          referenceCode: json.referenceCode,
          estimatedPrice: json.estimatedPrice,
          isSubscription: json.isSubscription,
        });
      }
    } catch {
      setServerError("Network connection issue. Please check your internet or call dispatch directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Booking Confirmation Screen */}
      {bookingSuccess ? (
        <div className="surface-panel p-6 sm:p-10 text-center rounded-2xl border-2 border-accent bg-gradient-to-b from-surface via-[#202428] to-background shadow-accent-glow animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="badge-accent mb-2">Booking Scheduled</span>
          <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-white mb-2">
            ROUTE DISPATCH LOGGED
          </h3>
          <p className="text-content-secondary text-xs sm:text-sm max-w-md mx-auto mb-6">
            Our route technician will arrive during your designated morning window.
          </p>

          <div className="max-w-sm mx-auto surface-panel p-4 rounded-xl border border-surface-border text-left mb-6 space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-surface-border">
              <span className="text-content-muted font-mono uppercase text-[10px]">Reference</span>
              <span className="font-headline text-lg font-bold text-accent">{bookingSuccess.referenceCode}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-surface-border">
              <span className="text-content-muted font-mono uppercase text-[10px]">Venue</span>
              <span className="font-bold text-white truncate max-w-[180px]">{businessName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-content-muted font-mono uppercase text-[10px]">Rate</span>
              <span className="font-headline text-xl font-black text-white">${bookingSuccess.estimatedPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setBookingSuccess(null);
                setCurrentStep(1);
              }}
              className="btn-accent w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold"
            >
              Book Another Service
            </button>
            <a
              href="tel:1800379372"
              className="btn-outline-surface w-full sm:w-auto px-5 py-3 text-xs sm:text-sm flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4 text-accent" />
              <span>Call Dispatch</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          
          {/* STEP PROGRESS INDICATOR (Compact on Mobile) */}
          <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-surface border border-surface-border">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === 1
                    ? "bg-accent text-white shadow-sm"
                    : "bg-surface-elevated text-content-muted hover:text-white"
                }`}
              >
                1
              </button>
              <span className={`text-xs font-bold ${currentStep === 1 ? "text-white" : "text-content-muted"}`}>
                Configure Kitchen
              </span>
            </div>

            <div className="h-0.5 w-12 sm:w-24 bg-surface-border" />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => validateStep1() && setCurrentStep(2)}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === 2
                    ? "bg-accent text-white shadow-sm"
                    : "bg-surface-elevated text-content-muted hover:text-white"
                }`}
              >
                2
              </button>
              <span className={`text-xs font-bold ${currentStep === 2 ? "text-white" : "text-content-muted"}`}>
                Location & Schedule
              </span>
            </div>
          </div>

          {/* STEP 1: SERVICE & VAT CONFIGURATION (Streamlined & Compact) */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Frequency Selector (Horizontal Chips) */}
              <div className="surface-panel p-5 sm:p-6 rounded-xl border border-surface-border">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent block mb-1">
                  Service Cadence
                </span>
                <h3 className="font-headline text-lg sm:text-xl font-bold text-white mb-3">
                  How Often Do You Need Service?
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SERVICE_FREQUENCIES.map((f) => {
                    const isSelected = frequency === f.id;
                    return (
                      <button
                        type="button"
                        key={f.id}
                        onClick={() => setFrequency(f.id)}
                        className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                          isSelected
                            ? "bg-accent/20 border-accent text-white ring-1 ring-accent"
                            : "bg-background-deep border-surface-border text-content-secondary hover:bg-surface-elevated"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-headline text-sm font-bold leading-tight">
                              {f.name.split(" ")[0]}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
                          </div>
                          {f.badge && (
                            <span className="text-[9px] font-bold text-accent bg-accent/15 px-1.5 py-0.5 rounded block w-fit mb-1">
                              {f.badge.includes("20%") ? "20% OFF" : f.badge.includes("15%") ? "15% OFF" : "10% OFF"}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-content-muted block mt-1">
                          ${f.basePrice} base
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fryer Vat Stepper (Compact One-Line Controller) */}
              <div className="surface-panel p-5 sm:p-6 rounded-xl border border-surface-border">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent block mb-0.5">
                      Fryer Capacity
                    </span>
                    <h3 className="font-headline text-lg sm:text-xl font-bold text-white">
                      Fryer Vat Count
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleFryerChange(-1)}
                      disabled={fryerCount <= 1}
                      className="w-11 h-11 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-center text-white hover:border-accent disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-headline text-2xl font-black text-white w-8 text-center">
                      {fryerCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleFryerChange(1)}
                      disabled={fryerCount >= 20}
                      className="w-11 h-11 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-center text-white hover:border-accent disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Venue Type (Compact Horizontal Selectors) */}
              <div className="surface-panel p-5 sm:p-6 rounded-xl border border-surface-border">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent block mb-1">
                  Kitchen Venue
                </span>
                <h3 className="font-headline text-lg sm:text-xl font-bold text-white mb-3">
                  Venue Category
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {VENUE_TYPES.map((v) => {
                    const isSelected = venueType === v.id;
                    return (
                      <button
                        type="button"
                        key={v.id}
                        onClick={() => setVenueType(v.id)}
                        className={`px-3 py-2.5 rounded-lg border text-center text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-accent/20 border-accent text-white"
                            : "bg-background-deep border-surface-border text-content-secondary hover:bg-surface-elevated"
                        }`}
                      >
                        {v.name.split("/")[0].trim()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add-ons (Compact Checklist) */}
              <div className="surface-panel p-5 sm:p-6 rounded-xl border border-surface-border">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent block mb-1">
                  Optional Add-Ons
                </span>
                <h3 className="font-headline text-lg sm:text-xl font-bold text-white mb-3">
                  Service Add-Ons
                </h3>

                <div className="space-y-2">
                  {AVAILABLE_ADDONS.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    const displayPrice = addon.perFryer ? addon.price * fryerCount : addon.price;
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer select-none text-xs transition-colors ${
                          isChecked
                            ? "bg-accent/15 border-accent text-white"
                            : "bg-background-deep border-surface-border text-content-secondary hover:bg-surface-elevated"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              isChecked ? "bg-accent border-accent text-white" : "border-surface-border bg-surface"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <span className="font-semibold text-content-primary block">{addon.name}</span>
                            <span className="text-[10px] text-content-muted hidden sm:inline">{addon.description}</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-accent shrink-0 ml-2">
                          +${displayPrice}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 1 Continue CTA with Live Price Preview */}
              <div className="surface-panel p-4 rounded-xl border border-surface-border flex items-center justify-between bg-surface-elevated">
                <div>
                  <span className="text-[10px] font-mono text-content-muted uppercase block">
                    Estimated Route Rate
                  </span>
                  <span className="font-headline text-2xl sm:text-3xl font-black text-white">
                    ${calculation.totalEstimatedPrice.toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  className="btn-accent px-6 py-3 font-bold text-xs sm:text-sm flex items-center gap-1.5"
                >
                  <span>Continue to Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: LOCATION, CONTACT & CONFIRMATION */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Back Button */}
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1.5 text-xs text-content-muted hover:text-white font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Kitchen Configuration</span>
              </button>

              <div className="surface-panel p-5 sm:p-8 rounded-xl border border-surface-border space-y-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent block mb-1">
                  Step 2 • Location & Contact
                </span>
                <h3 className="font-headline text-xl sm:text-2xl font-bold text-white mb-4">
                  Where Should the Van Arrive?
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-content-secondary mb-1 block">
                      Restaurant / Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Harbor View Cafe"
                      className="w-full h-11 px-3.5 rounded-lg bg-background-deep border border-surface-border text-base md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    {fieldErrors.businessName && (
                      <span className="text-xs text-red-400 mt-1 block">{fieldErrors.businessName}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-content-secondary mb-1 block">
                      Manager / Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Marcus Vance"
                      className="w-full h-11 px-3.5 rounded-lg bg-background-deep border border-surface-border text-base md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    {fieldErrors.contactName && (
                      <span className="text-xs text-red-400 mt-1 block">{fieldErrors.contactName}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-content-secondary mb-1 block">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      inputMode="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="manager@venue.com"
                      className="w-full h-11 px-3.5 rounded-lg bg-background-deep border border-surface-border text-base md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    {fieldErrors.email && (
                      <span className="text-xs text-red-400 mt-1 block">{fieldErrors.email}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-content-secondary mb-1 block">
                      Direct Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full h-11 px-3.5 rounded-lg bg-background-deep border border-surface-border text-base md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    {fieldErrors.phone && (
                      <span className="text-xs text-red-400 mt-1 block">{fieldErrors.phone}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-content-secondary mb-1 block">
                    Kitchen Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Culinary Way, Suite 100"
                    className="w-full h-11 px-3.5 rounded-lg bg-background-deep border border-surface-border text-base md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  {fieldErrors.address && (
                    <span className="text-xs text-red-400 mt-1 block">{fieldErrors.address}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-content-secondary mb-1 block">
                      Preferred Service Day
                    </label>
                    <select
                      value={preferredDay}
                      onChange={(e) => setPreferredDay(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg bg-background-deep border border-surface-border text-base md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-content-secondary mb-1 block">
                      Arrival Window
                    </label>
                    <select
                      value={preferredTimeWindow}
                      onChange={(e) => setPreferredTimeWindow(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg bg-background-deep border border-surface-border text-base md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="morning_pre_open">Early Morning (05:00 AM – 09:00 AM)</option>
                      <option value="afternoon_shift_gap">Afternoon Shift Gap (02:00 PM – 04:30 PM)</option>
                      <option value="night_post_close">Late Night (10:00 PM – 01:00 AM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-content-secondary mb-1 block">
                    Alley Access Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Back door delivery bell #2, parking in rear loading bay"
                    className="w-full h-11 px-3.5 rounded-lg bg-background-deep border border-surface-border text-base md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Order Summary & Final Submit Action */}
              <div className="surface-panel p-5 sm:p-6 rounded-xl border border-accent/40 bg-surface shadow-accent-glow space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-surface-border text-xs">
                  <span className="font-mono text-content-muted uppercase">Summary</span>
                  <span className="font-bold text-accent uppercase">{frequency} • {fryerCount} Vats</span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-content-secondary">Total Estimated Route Rate:</span>
                  <span className="font-headline text-3xl sm:text-4xl font-black text-white">
                    ${calculation.totalEstimatedPrice.toFixed(2)}
                  </span>
                </div>

                {serverError && (
                  <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-accent w-full py-4 text-sm sm:text-base font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Securing Route Stop...
                    </span>
                  ) : (
                    <>
                      <span>Confirm & Book Route Service</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-content-muted">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>No upfront payment required • Pay upon service completion</span>
                </div>
              </div>

            </div>
          )}

        </form>
      )}
    </div>
  );
}
