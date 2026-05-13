import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";
import { App } from "./App";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <TooltipProvider delayDuration={300}>
        <App />
        <Toaster
          position="bottom-center"
          theme="system"
          toastOptions={{
            classNames: {
              toast: "!bg-[var(--color-bg-2)] !border !border-[var(--color-line-strong)] !text-[var(--color-ink)] !shadow-[0_12px_32px_-8px_rgba(0,0,0,0.4)] !rounded-xl",
              title: "!font-[var(--font-display)] !text-[15px] !tracking-[-0.005em]",
              description: "!text-[var(--color-ink-dim)] !text-xs",
              actionButton: "!bg-[var(--color-ink)] !text-[var(--color-bg-0)] !rounded-full",
              cancelButton: "!bg-transparent !text-[var(--color-ink-dim)]",
            },
          }}
        />
      </TooltipProvider>
    </ThemeProvider>
  </React.StrictMode>
);
