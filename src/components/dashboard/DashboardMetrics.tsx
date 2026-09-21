import React from "react";
import { Truck, MessageSquare, Repeat, DollarSign } from "lucide-react";

interface MetricsProps {
  totalVisits: number;
  scheduledVisits: number;
  inquiriesCount: number;
  newInquiriesCount: number;
  subscriptionsCount: number;
  projectedRevenue: number;
}

export function DashboardMetrics({
  totalVisits,
  scheduledVisits,
  inquiriesCount,
  newInquiriesCount,
  subscriptionsCount,
  projectedRevenue,
}: MetricsProps) {
  const cards = [
    {
      label: "Scheduled",
      value: scheduledVisits,
      subtitle: `${totalVisits} total stops`,
      icon: Truck,
      color: "text-accent",
      bgColor: "bg-accent/15",
      borderColor: "border-accent/30",
    },
    {
      label: "Leads",
      value: newInquiriesCount,
      subtitle: `${inquiriesCount} inquiries`,
      icon: MessageSquare,
      color: "text-sky-400",
      bgColor: "bg-sky-500/15",
      borderColor: "border-sky-500/30",
    },
    {
      label: "Contracts",
      value: subscriptionsCount,
      subtitle: "Recurring route",
      icon: Repeat,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/15",
      borderColor: "border-emerald-500/30",
    },
    {
      label: "Pipeline",
      value: `$${projectedRevenue.toFixed(0)}`,
      subtitle: "Route revenue",
      icon: DollarSign,
      color: "text-amber-400",
      bgColor: "bg-amber-500/15",
      borderColor: "border-amber-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="surface-panel p-3.5 sm:p-5 rounded-xl border border-surface-border flex items-start justify-between shadow-sm relative overflow-hidden"
          >
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-content-muted block mb-0.5">
                {card.label}
              </span>
              <span className="font-headline text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-none block mb-1">
                {card.value}
              </span>
              <span className="text-[10px] sm:text-[11px] text-content-subtle block truncate max-w-[90px] sm:max-w-none">
                {card.subtitle}
              </span>
            </div>

            <div
              className={`w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl ${card.bgColor} border ${card.borderColor} flex items-center justify-center ${card.color} shrink-0`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
