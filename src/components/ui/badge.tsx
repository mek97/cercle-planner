import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-mono uppercase tracking-[0.1em] transition-colors",
  {
    variants: {
      variant: {
        default: "bg-white/[0.04] border-[var(--color-line-strong)] text-[var(--color-ink-dim)]",
        outline: "border-[var(--color-line)] text-[var(--color-ink-dim)] hover:bg-white/5",
        accent: "border-[var(--color-sat)]/40 bg-[var(--color-sat)]/15 text-[var(--color-sat)]",
      },
      size: {
        default: "h-[26px] px-3 text-[10.5px]",
        sm: "h-5 px-2 text-[9px]",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
