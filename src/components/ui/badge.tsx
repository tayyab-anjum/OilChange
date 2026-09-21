import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "bg-accent/15 text-accent border border-accent/40 shadow-sm rounded-pill",
        solid: "bg-accent text-white font-extrabold rounded-pill shadow-accent-glow",
        secondary:
          "bg-surface-elevated text-content-secondary border border-surface-border rounded-pill",
        outline:
          "border border-surface-border text-content-muted rounded-pill",
        success:
          "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-pill",
        warning:
          "bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-pill",
        info:
          "bg-sky-500/15 text-sky-400 border border-sky-500/30 rounded-pill",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
