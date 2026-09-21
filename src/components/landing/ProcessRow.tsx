import React from "react";
import { Laptop, Truck, ClipboardCheck, Sparkles, ArrowRight } from "lucide-react";

const processSteps = [
  {
    step: "01",
    title: "Book Online",
    badge: "1-Minute Setup",
    description: "Select your fryer count and preferred service frequency. Instant transparent pricing with zero quote delays.",
    icon: Laptop,
    highlight: "Real-time route scheduling",
  },
  {
    step: "02",
    title: "Van Arrives On-Site",
    badge: "Off-Peak Service",
    description: "Our fully-equipped mobile unit connects directly to your fryer vats during pre-opening or slow hours.",
    icon: Truck,
    highlight: "No kitchen disruption",
  },
  {
    step: "03",
    title: "Same-Day Service",
    badge: "Certified Clean",
    description: "High-temp micro-mesh filtration, deep tank scrub, and fresh cooking oil restock. Ready for lunch service.",
    icon: ClipboardCheck,
    highlight: "EPA recycling manifest signed",
  },
];

export function ProcessRow() {
  return (
    <section
      id="process"
      className="relative py-20 md:py-28 bg-[#15171A] border-y border-surface-border scroll-mt-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="badge-accent mb-3">Seamless 3-Step Operation</span>
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-content-primary tracking-tight">
              HOW FRYERCARE WORKS FOR YOUR KITCHEN
            </h2>
          </div>
          <p className="text-content-secondary text-sm md:text-base max-w-md">
            No messy manual dumping, no hot oil burn hazards for line cooks, and no compliance headaches.
          </p>
        </div>

        {/* 3 Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {processSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="surface-panel-interactive p-8 relative flex flex-col justify-between group overflow-hidden"
              >
                {/* Subtle Step Number in Background */}
                <span className="absolute top-4 right-6 font-headline text-5xl font-black text-white/[0.04] select-none group-hover:text-accent/10 transition-colors duration-300">
                  {step.step}
                </span>

                <div>
                  {/* Icon Header with Accent Glow */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-accent-glow">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider bg-accent/10 px-2.5 py-1 rounded-pill">
                      {step.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-headline text-2xl font-bold text-content-primary mb-3 group-hover:text-accent transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-content-secondary text-sm leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Card Footer Feature Indicator */}
                <div className="pt-4 border-t border-surface-border/80 flex items-center justify-between text-xs text-content-muted">
                  <span className="font-medium text-content-secondary">{step.highlight}</span>
                  <ArrowRight className="w-4 h-4 text-accent/60 group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
