import { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ARTISTS } from "@/data/artists";
import { parseListeners } from "@/utils";
import type { FanbaseLevel } from "@/data/types";
import { ChartCard } from "./ChartCard";
import { useChartTheme } from "./chartTheme";

const SCALE: Record<FanbaseLevel, number> = {
  small: 1, medium: 2, "medium-large": 2.5, large: 3.2, massive: 4,
};

interface Props {
  picks: Set<string>;
  onClickArtist: (id: string) => void;
}

export function FanbasePyramid({ picks, onClickArtist }: Props) {
  const { C } = useChartTheme();

  const COLOR: Record<FanbaseLevel, string> = {
    small: C.g.electronica,
    medium: C.g.deep,
    "medium-large": C.g.organic,
    large: C.fri,
    massive: C.sat,
  };

  const sorted = useMemo(() => {
    return ARTISTS
      .map(a => ({
        a,
        score: SCALE[a.details.fanbase] || 2,
        listeners: parseListeners(a.details.listeners) || 0,
      }))
      .sort((x, y) => y.score - x.score || y.listeners - x.listeners);
  }, []);

  const maxH = 180;

  return (
    <ChartCard
      title="Fanbase pyramid"
      sub="every artist as a brick · sized by scale · click to open"
      span={3}
    >
      <div className="grid grid-cols-[repeat(42,1fr)] gap-1.5 pt-3 items-end min-h-[200px]">
        {sorted.map(({ a, score }) => {
          const h = (score / 4) * maxH;
          const color = COLOR[a.details.fanbase] || C.g.electronica;
          const picked = picks.has(a.id);
          return (
            <Tooltip key={a.id} delayDuration={120}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onClickArtist(a.id)}
                  style={{
                    background: color,
                    height: h,
                    opacity: picked ? 1 : 0.75,
                    boxShadow: picked
                      ? `0 0 20px ${color}, 0 0 0 1px ${C.ink} inset`
                      : `0 0 14px color-mix(in srgb, ${color} 32%, transparent)`,
                  }}
                  className="rounded-t-[4px] cursor-pointer transition-transform hover:-translate-y-1 will-change-transform"
                />
              </TooltipTrigger>
              <TooltipContent>{a.name} · {a.details.fanbase}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr] mt-4 font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-mute)] uppercase">
        <span>Headliner-class</span>
        <span className="text-center">Big draw</span>
        <span className="text-center">Mid-tier</span>
        <span className="text-right">Cult following</span>
      </div>
    </ChartCard>
  );
}
