import { useState } from "react";
import { toast } from "sonner";
import { ImageDown, Loader2 } from "lucide-react";
import { renderProfilePng } from "@/lib/profileImage";
import type { QuizResult } from "@/data/quiz";

interface Props {
  result: QuizResult;
  size?: "sm" | "md";
}

// Profile share = persona only (no picks). Single action: render a polished
// card to PNG, then Web Share API on supported devices (lands directly in
// WhatsApp / Messages / Instagram) or download fallback on desktop.
export function ProfileShareButtons({ result, size = "md" }: Props) {
  const personaKey = result.primaryPersona;
  const [renderingImage, setRenderingImage] = useState(false);

  async function shareImage() {
    if (renderingImage) return;
    setRenderingImage(true);
    try {
      const blob = await renderProfilePng(result);
      const filename = `cercle-profile-${personaKey}.png`;
      const file = new File([blob], filename, { type: "image/png" });

      const canShareFiles =
        typeof navigator !== "undefined" &&
        typeof (navigator as Navigator & { canShare?: (data: ShareData) => boolean }).canShare === "function" &&
        (navigator as Navigator & { canShare: (data: ShareData) => boolean }).canShare({ files: [file] });

      if (canShareFiles && navigator.share) {
        try {
          await navigator.share({
            files: [file],
            title: "My Cercle Festival 2026 profile",
          });
          return;
        } catch (err) {
          // User cancelled — bail out without falling through to download.
          if ((err as DOMException)?.name === "AbortError") return;
        }
      }

      // Desktop fallback — download the PNG.
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Profile image saved", { description: "Attach it to your message and send" });
    } catch (err) {
      console.error(err);
      toast.error("Couldn't generate image");
    } finally {
      setRenderingImage(false);
    }
  }

  const dims = size === "sm" ? "h-8 px-3 text-[12.5px]" : "h-9 px-3.5 text-sm";

  return (
    <button
      type="button"
      onClick={shareImage}
      disabled={renderingImage}
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] hover:border-[var(--color-sat)] hover:bg-[color-mix(in_srgb,var(--color-sat)_8%,transparent)] transition-all disabled:opacity-60 disabled:cursor-wait ${dims}`}
      aria-label="Generate and share my profile image"
    >
      {renderingImage ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <ImageDown className="w-3.5 h-3.5" />
      )}
      {renderingImage ? "Rendering…" : "Share image"}
    </button>
  );
}
