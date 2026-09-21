import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-white shadow-md hover:bg-accent-hover shadow-accent/20 hover:shadow-accent/40 rounded-pill",
        outline:
          "border border-surface-border bg-surface text-content-primary hover:bg-surface-elevated hover:border-accent hover:text-white rounded-pill",
        secondary:
          "bg-surface-elevated text-content-primary hover:bg-surface-hover border border-surface-border rounded-pill",
        ghost:
          "text-content-secondary hover:bg-surface-hover hover:text-white rounded-pill",
        link: "text-accent underline-offset-4 hover:underline p-0 h-auto font-normal",
        danger:
          "bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 rounded-pill",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
        icon: "h-10 w-10 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
