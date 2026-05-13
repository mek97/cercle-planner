import { useSyncExternalStore, useCallback } from "react";
import type { QuizResult } from "@/data/quiz";

// Cross-component shared store backed by localStorage.
// Every useQuizResult() consumer subscribes to the same source of truth,
// so when QuizSection writes a result the For-You profile card reflects it
// instantly (no reload needed).

const STORAGE_KEY = "cercle-26-quiz-result";
const EVENT_NAME = "cercle:quiz-result";

let cached: QuizResult | null = readFromStorage();
const listeners = new Set<() => void>();

function readFromStorage(): QuizResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return migrate(JSON.parse(raw) as QuizResult);
  } catch {
    return null;
  }
}

// Migrates stale stored shapes — the persona once-known-as romantic was
// renamed to "soarer" then again to "fluidic". Chain the aliases so a user
// who took the quiz before either rename keeps a valid result.
const PERSONA_LEGACY_ALIAS: Record<string, string> = {
  romantic: "fluidic",
  soarer: "fluidic",
};

function migrate(r: QuizResult): QuizResult {
  if (!r) return r;
  const remapKey = (k: string): string => PERSONA_LEGACY_ALIAS[k] ?? k;

  const scores = r.personaScores as Record<string, number> | undefined;
  let nextScores = r.personaScores;
  if (scores) {
    const rewritten: Record<string, number> = {};
    for (const [k, v] of Object.entries(scores)) {
      const remapped = remapKey(k);
      rewritten[remapped] = (rewritten[remapped] ?? 0) + v;
    }
    nextScores = rewritten as typeof r.personaScores;
  }

  return {
    ...r,
    primaryPersona: remapKey(r.primaryPersona as string) as typeof r.primaryPersona,
    secondaryPersona: remapKey(r.secondaryPersona as string) as typeof r.secondaryPersona,
    personaScores: nextScores,
  };
}

function writeToStorage(r: QuizResult | null) {
  try {
    if (r) localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function emit() {
  listeners.forEach(l => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  // also handle external tab updates
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cached = readFromStorage();
      emit();
    }
  };
  const onCustom = () => l();
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVENT_NAME, onCustom);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(EVENT_NAME, onCustom);
  };
}

function getSnapshot(): QuizResult | null {
  return cached;
}

function getServerSnapshot(): QuizResult | null {
  return null;
}

export function useQuizResult() {
  const result = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setResult = useCallback((r: QuizResult | null) => {
    cached = r;
    writeToStorage(r);
    emit();
    window.dispatchEvent(new Event(EVENT_NAME));
  }, []);

  const clear = useCallback(() => setResult(null), [setResult]);

  return { result, setResult, clear };
}
