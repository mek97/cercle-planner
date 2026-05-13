import { GenreDonut } from "./charts/GenreDonut";
import { CercleBreakdown } from "./charts/CercleBreakdown";
import { BpmChart } from "./charts/BpmChart";
import { FanbasePyramid } from "./charts/FanbasePyramid";
import { SectionShell } from "./SectionShell";

export function NumbersSection({ picks, onOpen }: { picks: Set<string>; onOpen: (id: string) => void }) {
  return (
    <SectionShell
      id="numbers"
      kicker="04 · Numbers"
      title={<>The festival in <em className="display-em">numbers</em></>}
      lede="Four ways to be insufferable about the lineup at brunch. Genre split, BPM pacing, fanbase scale, and who's already gotten the Cercle-broadcast treatment (i.e. who's been filmed flying or floating somewhere)."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GenreDonut />
        <CercleBreakdown />
        <BpmChart picks={picks} />
        <FanbasePyramid picks={picks} onClickArtist={onOpen} />
      </div>
    </SectionShell>
  );
}
