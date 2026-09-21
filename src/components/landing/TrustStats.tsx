import React from "react";
import { Building2, Clock, Award, Recycle } from "lucide-react";

const stats = [
  {
    number: "500+",
    label: "Commercial Kitchens Serviced",
    detail: "Bistros, fast-food outlets, food trucks & hotel restaurants",
    icon: Building2,
  },
  {
    number: "<2 hrs",
    label: "Avg. Emergency Response",
    detail: "Fast mobile dispatch along primary metro route corridors",
    icon: Clock,
  },
  {
    number: "10 Yrs",
    label: "Oil Filtration Expertise",
    detail: "Specialized solo trade operator with dedicated rig",
    icon: Award,
  },
  {
    number: "100%",
    label: "EPA Biofuel Recycling",
    detail: "Every liter converted into clean commercial biofuel",
    icon: Recycle,
  },
];

export function TrustStats() {
  return (
    <section className="py-16 md:py-24 bg-[#141618] border-y border-surface-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Tag */}
        <div className="text-center mb-12">
          <p className="text-xs font-mono font-bold tracking-widest text-accent uppercase">
            OPERATIONAL TRACK RECORD
          </p>
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center p-4 relative group"
              >
                {/* Background ambient hover ring */}
                <div className="w-12 h-12 rounded-xl bg-surface border border-surface-border flex items-center justify-center text-accent mb-4 group-hover:scale-110 group-hover:border-accent/40 transition-transform duration-200">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Big Stat Number */}
                <span className="font-headline text-4xl sm:text-5xl lg:text-5.5xl font-black text-white tracking-tight leading-none mb-2 group-hover:text-accent transition-colors duration-200">
                  {stat.number}
                </span>

                {/* Label */}
                <h4 className="font-sans font-bold text-sm text-content-primary mb-1">
                  {stat.label}
                </h4>

                {/* Subtitle Detail */}
                <p className="text-xs text-content-muted max-w-[200px] leading-relaxed">
                  {stat.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
