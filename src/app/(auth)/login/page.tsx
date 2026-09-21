"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Flame, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, KeyRound } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("operator@fryercare.com");
  const [password, setPassword] = useState("FryerCareMaster2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFillDemo = () => {
    setEmail("operator@fryercare.com");
    setPassword("FryerCareMaster2026!");
    setErrorMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Authentication failed. Please verify credentials.");
      } else {
        router.push(redirectPath);
        router.refresh();
      }
    } catch {
      setErrorMessage("Network error during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="surface-panel p-8 sm:p-10 rounded-cardLg border border-surface-border relative shadow-2xl bg-surface">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mx-auto mb-4 shadow-accent-glow">
          <Lock className="w-6 h-6" />
        </div>
        <span className="badge-accent mb-2">Solo Operator Portal</span>
        <h1 className="font-headline text-3xl font-extrabold text-white tracking-tight">
          OPERATOR LOG IN
        </h1>
        <p className="text-xs text-content-muted mt-1.5">
          Access your daily dispatch route, customer records, and lead queue.
        </p>
      </div>

      {/* Quick Demo Autofill Pill */}
      <div className="mb-6 p-3 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-content-secondary">
          <KeyRound className="w-4 h-4 text-accent shrink-0" />
          <span>Demo Credentials Loaded</span>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="text-[11px] font-bold text-accent hover:underline"
        >
          Reset
        </button>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-content-secondary mb-1.5 block">
            Operator Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-content-subtle absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@fryercare.com"
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-background-deep border border-surface-border text-base md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-content-secondary mb-1.5 block">
            Access Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-content-subtle absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-11 pl-10 pr-11 rounded-lg bg-background-deep border border-surface-border text-base md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-content-subtle hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-accent w-full py-3.5 font-bold flex items-center justify-center gap-2 mt-6 shadow-lg disabled:opacity-50"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Verifying Operator Access...
            </span>
          ) : (
            <>
              <span>Sign In to Operator Hub</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Security Badge */}
      <div className="mt-8 pt-4 border-t border-surface-border/60 flex items-center justify-center gap-2 text-[11px] text-content-subtle">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Encrypted Operator Session • 256-Bit SSL</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Ambient Spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Link */}
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Back to FryerCare Homepage"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-accent text-white shadow-accent-glow">
            <Flame className="w-4 h-4 fill-white" />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight text-white">
            FRYERCARE
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-content-muted hover:text-white transition-colors"
        >
          ← Back to Main Site
        </Link>
      </div>

      {/* Center Auth Card wrapped in Suspense */}
      <div className="w-full max-w-md mx-auto my-auto py-12">
        <Suspense fallback={<div className="surface-panel p-8 rounded-card text-center text-xs text-content-muted">Loading login portal...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-content-subtle">
        © {new Date().getFullYear()} FryerCare Internal Dispatch Infrastructure.
      </div>
    </div>
  );
}
