import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1 rounded-full bg-white/[0.03] border border-[var(--color-line)] p-1",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex h-7 items-center justify-center rounded-full px-3.5",
      "font-mono text-[11px] tracking-[0.14em] uppercase",
      "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] transition-colors",
      "data-[state=active]:bg-[var(--color-ink)] data-[state=active]:text-[var(--color-bg-0)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-line-bright)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-0)]",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = TabsPrimitive.Content;
export { Tabs, TabsList, TabsTrigger, TabsContent };
