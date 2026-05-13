import { SectionShell } from "./SectionShell";
import { QuizProfileCard } from "./QuizProfileCard";
import { RecommendationMatches } from "./charts/RecommendationMatches";

interface Props {
  picks: Set<string>;
  toggle: (id: string) => void;
  onOpen: (id: string) => void;
}

export function MatchesSection({ picks, toggle, onOpen }: Props) {
  return (
    <SectionShell
      id="matches"
      kicker="02 · For you"
      title={<>Your profile &<br /><em className="display-em">your matches</em></>}
      lede="Top of the page: who you are at Cercle (and the math that thinks so). Below: 42 artists ranked by how much they sound like the inside of your head. Cosine similarity. We don't make the rules — we just enforce them."
    >
      <QuizProfileCard />
      <RecommendationMatches picks={picks} toggle={toggle} onOpen={onOpen} />
    </SectionShell>
  );
}
