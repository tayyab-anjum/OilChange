"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, LogOut, ShieldCheck, Phone, Navigation, RefreshCw } from "lucide-react";

export function DashboardHeader({ onRefresh }: { onRefresh?: () => void }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 w-full bg-[#16181B] border-b border-surface-border shadow-md py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Brand & Route Status */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent text-white shadow-accent-glow">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-headline text-xl font-bold tracking-tight text-white block leading-none">
                FRYERCARE
              </span>
              <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider">
                Solo Operator Dispatch
              </span>
            </div>
          </Link>

          {/* Active Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-pill bg-surface border border-surface-border text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-content-secondary font-medium">Van Unit #01 Live</span>
            <span className="text-content-subtle font-mono text-[10px]">| {todayFormatted}</span>
          </div>
        </div>

        {/* Right Actions: Hotline, Refresh & Sign Out */}
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <div className="flex items-center gap-2 text-xs text-content-muted bg-surface px-3 py-1.5 rounded-lg border border-surface-border">
            <Phone className="w-3.5 h-3.5 text-accent" />
            <span className="font-mono font-bold text-white">(800) 379-3722</span>
          </div>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="p-2 rounded-lg bg-surface border border-surface-border text-content-secondary hover:text-white hover:border-accent transition-colors"
              title="Refresh Route Data"
              aria-label="Refresh route data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isLoggingOut ? "Exiting..." : "Sign Out"}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
