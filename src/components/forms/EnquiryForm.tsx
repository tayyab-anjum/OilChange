"use client";

import React, { useState } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Clock,
  RefreshCw,
} from "lucide-react";

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Multi-Location Pricing",
  "Emergency Callout",
  "EPA Compliance Manifest",
  "Other Question",
];

export function EnquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successData, setSuccessData] = useState<{
    referenceCode: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});

    if (message.trim().length < 15) {
      setFieldErrors({
        message: "Please provide at least 15 characters describing your kitchen requirement.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          businessName,
          subject,
          message,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.fieldErrors) {
          setFieldErrors(json.fieldErrors);
        }
        setServerError(
          json.error || "Unable to send message. Please verify the required fields."
        );
      } else {
        setSuccessData({
          referenceCode: json.referenceCode,
          message: json.message,
        });
      }
    } catch {
      setServerError(
        "Network communication failure. Please call dispatch directly at (800) 379-3722."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setName("");
    setEmail("");
    setPhone("");
    setBusinessName("");
    setSubject(SUBJECT_OPTIONS[0]);
    setMessage("");
    setServerError(null);
    setFieldErrors({});
  };

  if (successData) {
    return (
      <div className="surface-panel p-6 sm:p-10 text-center rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-[#1C2521] via-surface to-background shadow-elevation-card animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="badge-accent mb-2">Message Transmitted</span>
        <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-white mb-2">
          INQUIRY LOGGED
        </h3>
        <p className="text-content-secondary text-xs sm:text-sm max-w-sm mx-auto mb-4">
          {successData.message}
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-surface-elevated border border-surface-border text-xs font-mono text-accent mb-6">
          <span>Tracking:</span>
          <span className="font-bold text-white">{successData.referenceCode}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="btn-accent text-xs sm:text-sm py-3 px-6"
          >
            Send Another Message
          </button>
          <a
            href="tel:1800379372"
            className="btn-outline-surface text-xs sm:text-sm py-3 px-5 flex items-center justify-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4 text-accent" />
            <span>(800) 379-3722</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="surface-panel p-5 sm:p-8 rounded-2xl border border-surface-border space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-xs font-semibold text-content-secondary mb-1 block">
            Your Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Maria Torres"
            className="w-full h-11 px-3.5 rounded-lg bg-background-deep border border-surface-border text-base md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {fieldErrors.name && (
            <span className="text-xs text-red-400 mt-1 block">{fieldErrors.name}</span>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-content-secondary mb-1 block">
            Restaurant / Venue Name *
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-xs font-semibold text-content-secondary mb-1 block">
            Email Address *
          </label>
          <input
            type="email"
            required
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="maria@venue.com"
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
        <label className="text-xs font-semibold text-content-secondary mb-1.5 block">
          Inquiry Subject
        </label>
        <div className="flex flex-wrap gap-1.5">
          {SUBJECT_OPTIONS.map((sub) => (
            <button
              type="button"
              key={sub}
              onClick={() => setSubject(sub)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                subject === sub
                  ? "bg-accent text-white font-bold"
                  : "bg-background-deep border border-surface-border text-content-secondary hover:text-white"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-content-secondary mb-1 block">
          Your Message * (Min 15 chars)
        </label>
        <textarea
          required
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your kitchen setup, questions, or schedule requirements..."
          className="w-full px-3.5 py-2.5 rounded-lg bg-background-deep border border-surface-border text-base md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent resize-y min-h-[90px]"
        />
        {fieldErrors.message && (
          <span className="text-xs text-red-400 mt-1 block">{fieldErrors.message}</span>
        )}
      </div>

      {serverError && (
        <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-accent w-full sm:w-auto py-3.5 px-7 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Sending...
            </span>
          ) : (
            <>
              <span>Send Message</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="flex items-center gap-1.5 text-[11px] text-content-muted">
          <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
          <span>Operator replies within 2 hours</span>
        </div>
      </div>
    </form>
  );
}
