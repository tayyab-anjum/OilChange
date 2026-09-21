import React from "react";
import { Repeat, Calendar, CheckCircle, MapPin } from "lucide-react";

export interface SubscriptionRecord {
  id: string;
  venueId: string;
  frequency: string;
  status: string;
  baseRate: string | number;
  preferredDay?: string | null;
  preferredTimeWindow?: string | null;
  startDate: string | Date;
  nextServiceDate?: string | Date | null;
  venue?: {
    businessName: string;
    contactName: string;
    phone: string;
    address: string;
    fryerCount: number;
  } | null;
}

export function SubscriptionsDataTable({
  subscriptions,
}: {
  subscriptions: SubscriptionRecord[];
}) {
  return (
    <div className="surface-panel rounded-card border border-surface-border overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-surface-border bg-[#181B1E] flex items-center justify-between">
        <div>
          <h3 className="font-headline text-xl sm:text-2xl font-bold text-white leading-tight">
            ACTIVE RECURRING CONTRACTS ({subscriptions.length})
          </h3>
          <p className="text-[11px] text-content-muted hidden sm:block">
            Weekly and monthly recurring route accounts.
          </p>
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <div className="p-8 text-center text-content-muted text-xs">
          No recurring subscription accounts active.
        </div>
      ) : (
        <>
          {/* MOBILE VIEW (<768px): STACKED RECURRING CARDS (Zero Horizontal Scroll) */}
          <div className="md:hidden divide-y divide-surface-border/60 p-3 space-y-3">
            {subscriptions.map((s) => (
              <div
                key={s.id}
                className="surface-panel p-4 rounded-xl border border-surface-border bg-surface-elevated/40 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-accent uppercase">
                    {s.frequency} Route
                  </span>
                  <span className="px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </div>

                <div>
                  <h4 className="font-headline text-lg font-bold text-white leading-tight">
                    {s.venue?.businessName || "Venue Account"}
                  </h4>
                  <p className="text-xs text-content-muted flex items-start gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-content-subtle shrink-0 mt-0.5" />
                    <span>{s.venue?.address}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-surface-border/50 text-xs">
                  <span className="text-content-secondary capitalize">
                    Preferred: {s.preferredDay || "Monday"}
                  </span>
                  <span className="font-mono font-bold text-white">
                    ${Number(s.baseRate).toFixed(2)} / visit
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW (≥768px): FULL DATA TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-surface-border bg-background-deep/60 text-[11px] font-mono text-content-muted uppercase">
                  <th className="py-3 px-4 font-semibold">Venue Account</th>
                  <th className="py-3 px-4 font-semibold">Frequency</th>
                  <th className="py-3 px-4 font-semibold">Preferred Day</th>
                  <th className="py-3 px-4 font-semibold">Base Rate / Visit</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/60">
                {subscriptions.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-elevated/40">
                    <td className="py-3.5 px-4">
                      <span className="font-headline text-sm font-bold text-white block">
                        {s.venue?.businessName || "Venue Account"}
                      </span>
                      <span className="text-[11px] text-content-muted flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-content-subtle" />
                        {s.venue?.address}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-accent uppercase">
                      {s.frequency}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-white">
                      {s.preferredDay || "Monday"}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      ${Number(s.baseRate).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-pill text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
