import { useState } from "react";
import type { Artist } from "@/data/types";
import { DAY_ACCENT } from "@/data/genres";
import { imageFor } from "@/data/artistImages";
import { cn } from "@/lib/utils";

interface Props {
  artist: Artist;
  size?: number;          // pixel size · default 44
  className?: string;
  rounded?: boolean;      // default true (circle); set false for square 14px-radius
}

function initials(name: string): string {
  // Strip "b2b" / "DJ" / "feat." then take first letter of first and last meaningful word
  const cleaned = name
    .replace(/\b(b2b|DJ|DJ Set|feat\.?|Live)\b/gi, " ")
    .replace(/[^\p{L}\s]/gu, " ")
    .trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) return name.slice(0, 1).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function Avatar({ artist, size = 44, className, rounded = true }: Props) {
  const url = imageFor(artist.id);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const accent = DAY_ACCENT[artist.day];

  const showImage = url && !failed;
  const ini = initials(artist.name);

  return (
    <div
      className={cn(
        "relative overflow-hidden shrink-0 select-none",
        rounded ? "rounded-full" : "rounded-[14px]",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* fallback (always rendered, hidden once image loads) */}
      <div
        className="absolute inset-0 flex items-center justify-center font-[var(--font-display)] font-medium"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, color-mix(in srgb, ${accent} 55%, #0a0810) 100%)`,
          color: "rgba(10, 8, 16, 0.85)",
          fontSize: size * 0.42,
          letterSpacing: "-0.02em",
          opacity: showImage && loaded ? 0 : 1,
          transition: "opacity 0.3s",
        }}
      >
        {ini}
      </div>
      {showImage && (
        <img
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
        />
      )}
      {/* subtle ring */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${accent} 38%, transparent)`,
          borderRadius: rounded ? "9999px" : "14px",
        }}
      />
    </div>
  );
}
