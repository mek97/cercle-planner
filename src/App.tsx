import { useState, useCallback, useEffect } from "react";
import { ARTISTS } from "./data/artists";
import { usePicks } from "./hooks/usePicks";
import { useQuizResult } from "./hooks/useQuizResult";
import { Aurora } from "./components/Aurora";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { QuizSection } from "./components/QuizSection";
import { MatchesSection } from "./components/MatchesSection";
import { LineupSection } from "./components/LineupSection";
import { NumbersSection } from "./components/NumbersSection";
import { MapSection } from "./components/MapSection";
import { ScheduleSection } from "./components/ScheduleSection";
import { AfterpartiesSection } from "./components/AfterpartiesSection";
import { PlanSection } from "./components/PlanSection";
import { VibeSection } from "./components/VibeSection";
import { ArtistModal } from "./components/ArtistModal";
import { Footer } from "./components/Footer";
import { PicksPill } from "./components/PicksPill";
import { RevealSection } from "./components/RevealSection";
import { ShareImportBanner } from "./components/ShareImportBanner";
import { clearShareHash, readShareDataFromHash } from "./lib/share";
import type { PersonaKey } from "./data/types";

export function App() {
  const { picks, toggle, remove, addMany, clear } = usePicks();
  const { result: quizResult, clear: clearQuiz } = useQuizResult();
  const [openId, setOpenId] = useState<string | null>(null);

  // Import banner state — covers both share modes:
  //   timetable share → picks (+ optional persona tag)
  //   profile share   → persona only, no picks
  const [importIds, setImportIds] = useState<string[]>([]);
  const [importPersona, setImportPersona] = useState<PersonaKey | undefined>();
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    const data = readShareDataFromHash();
    if (data.picks.length > 0 || data.persona) {
      setImportIds(data.picks);
      setImportPersona(data.persona);
      setBannerOpen(true);
    }
  }, []);

  const onOpen = useCallback((id: string) => setOpenId(id), []);
  const onClose = useCallback(() => setOpenId(null), []);

  const artist = openId ? ARTISTS.find(a => a.id === openId) || null : null;

  const handleApplyPersona = (matches: string[]) => {
    addMany(matches);
    setTimeout(() => {
      document.getElementById("matches")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  function importShared() {
    if (importIds.length > 0) {
      addMany(importIds);
      setBannerOpen(false);
      clearShareHash();
      setTimeout(() => {
        document.getElementById("plan")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } else {
      // Profile-only share — no picks to import; CTA jumps the viewer to the quiz.
      setBannerOpen(false);
      clearShareHash();
      setTimeout(() => {
        document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }
  function dismissBanner() {
    setBannerOpen(false);
    clearShareHash();
  }

  function resetAll() {
    clear();
    clearQuiz();
  }

  return (
    <>
      <Aurora />
      <Nav
        picksCount={picks.size}
        hasQuiz={!!quizResult}
        onClearPicks={clear}
        onResetQuiz={clearQuiz}
        onResetAll={resetAll}
      />
      <Hero picksCount={picks.size} />
      <RevealSection><QuizSection onApply={handleApplyPersona} /></RevealSection>
      <RevealSection><MatchesSection picks={picks} toggle={toggle} onOpen={onOpen} /></RevealSection>
      <RevealSection><LineupSection picks={picks} toggle={toggle} onOpen={onOpen} /></RevealSection>
      <RevealSection><NumbersSection picks={picks} onOpen={onOpen} /></RevealSection>
      <RevealSection><MapSection picks={picks} onOpen={onOpen} /></RevealSection>
      <RevealSection><ScheduleSection picks={picks} toggle={toggle} onOpen={onOpen} /></RevealSection>
      <RevealSection><AfterpartiesSection onOpen={onOpen} /></RevealSection>
      <RevealSection><PlanSection picks={picks} remove={remove} clear={clear} onOpen={onOpen} /></RevealSection>
      <RevealSection><VibeSection picks={picks} onOpen={onOpen} /></RevealSection>
      <Footer />
      <PicksPill count={picks.size} />
      <ShareImportBanner
        open={bannerOpen}
        count={importIds.length}
        persona={importPersona}
        onImport={importShared}
        onDismiss={dismissBanner}
      />
      <ArtistModal
        artist={artist}
        picked={openId ? picks.has(openId) : false}
        onClose={onClose}
        onToggle={toggle}
      />
    </>
  );
}
