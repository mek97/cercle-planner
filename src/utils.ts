// Shared utilities

export function parseListeners(s: string | undefined): number | null {
  if (!s) return null;
  const m = String(s).match(/([\d.]+)\s*([MK])/i);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return m[2].toUpperCase() === "M" ? n * 1e6 : n * 1e3;
}

export function fmtListeners(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 10e6 ? 0 : 1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return String(n);
}

export function fanbaseDots(level: string): number {
  const map: Record<string, number> = {
    small: 1, medium: 2, "medium-large": 2, large: 3, massive: 4,
  };
  return map[level] || 2;
}
