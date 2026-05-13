import { VibeMap } from "./charts/VibeMap";
import { DayGenreStack } from "./charts/DayGenreStack";
import { OriginsMap } from "./charts/OriginsMap";
import { LabelLeaderboard } from "./charts/LabelLeaderboard";
import { ActiveSinceTimeline } from "./charts/ActiveSinceTimeline";
import { StreamsVsCercle } from "./charts/StreamsVsCercle";
import { SectionShell } from "./SectionShell";

export function MapSection({ picks, onOpen }: { picks: Set<string>; onOpen: (id: string) => void }) {
  return (
    <SectionShell
      id="map"
      kicker="05 · Map"
      title={<>Map the <em className="display-em">lineup</em></>}
      lede="Six different ways to plot the same 42 humans. Vibe map, origins, fanbase pyramid, BPM histogram, active-since timeline. Find your corner. Compare with friends. Argue."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <VibeMap picks={picks} onOpen={onOpen} />
        <DayGenreStack />
        <LabelLeaderboard />
        <StreamsVsCercle onOpen={onOpen} />
        <ActiveSinceTimeline onOpen={onOpen} />
        <OriginsMap picks={picks} onOpen={onOpen} />
      </div>
    </SectionShell>
  );
}
