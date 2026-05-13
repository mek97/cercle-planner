// Theme-aware Recharts styling. Call useChartTheme() inside a chart component.
import { useColors } from "@/data/useColors";

export function useChartTheme() {
  const C = useColors();
  return {
    C,
    tick: {
      fill: C.inkMute,
      fontFamily: "JetBrains Mono, monospace",
      fontSize: 10,
      letterSpacing: "0.06em",
    },
    axisLine: { stroke: C.lineStrong },
    gridLine: { stroke: C.line },
    tooltipStyle: {
      background: C.bg2,
      border: `1px solid ${C.lineStrong}`,
      borderRadius: 10,
      padding: "10px 12px",
      fontFamily: "JetBrains Mono, monospace",
      fontSize: 11,
      letterSpacing: "0.04em",
      color: C.ink,
      boxShadow: "0 12px 32px -8px rgba(0,0,0,0.2)",
    } as React.CSSProperties,
  };
}
