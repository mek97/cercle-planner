import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cercle-26-picks";

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function usePicks() {
  const [picks, setPicks] = useState<Set<string>>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...picks]));
    } catch {}
  }, [picks]);

  const toggle = useCallback((id: string) => {
    setPicks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const add = useCallback((id: string) => {
    setPicks(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setPicks(prev => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const addMany = useCallback((ids: string[]) => {
    setPicks(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.add(id));
      return next;
    });
  }, []);

  const clear = useCallback(() => setPicks(new Set()), []);

  return { picks, toggle, add, remove, addMany, clear };
}
