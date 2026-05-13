import { MoodRadar } from "./charts/MoodRadar";
import { EnergyCurve } from "./charts/EnergyCurve";
import { MoodHeatmap } from "./charts/MoodHeatmap";
import { Insights } from "./Insights";
import { SectionShell } from "./SectionShell";

interface Props {
  picks: Set<string>;
  onOpen: (id: string) => void;
}

export function VibeSection({ picks, onOpen }: Props) {
  return (
    <SectionShell
      id="vibe"
      kicker="09 · Visualize"
      title={<>Your weekend's <em className="display-em">vibe map</em></>}
      lede="Three views of you-meets-festival. A mood radar (where your tastes pull hardest), an energy curve per day (where the calories burn), and a full-lineup heatmap with your profile pinned at the top so the comparisons feel personal."
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 mb-6">
        <MoodRadar picks={picks} />
        <EnergyCurve picks={picks} />
      </div>
      <div className="mb-10">
        <MoodHeatmap picks={picks} onOpen={onOpen} />
      </div>
      <Insights picks={picks} />
    </SectionShell>
  );
}
