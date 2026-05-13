import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-line-bright)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-0)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-ink)] text-[var(--color-bg-0)] font-semibold hover:-translate-y-px hover:shadow-[0_14px_36px_-8px_rgba(251,247,238,0.28)]",
        glow: "text-[#0a0810] font-semibold bg-gradient-to-r from-[var(--color-fri)] via-[var(--color-sat)] to-[var(--color-sun)] shadow-[0_12px_28px_-10px_rgba(255,93,138,0.6)] hover:-translate-y-px hover:shadow-[0_18px_40px_-10px_rgba(255,93,138,0.7)]",
        outline: "border border-[var(--color-line-strong)] text-[var(--color-ink-dim)] hover:border-[var(--color-ink-dim)] hover:text-[var(--color-ink)] hover:bg-white/5",
        destructive: "border border-[var(--color-line-strong)] text-[var(--color-ink-dim)] hover:border-red-500 hover:text-red-500",
        ghost: "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] hover:bg-white/5",
        link: "text-[var(--color-ink-dim)] underline-offset-4 hover:underline hover:text-[var(--color-ink)]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
