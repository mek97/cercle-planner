import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Link as LinkIcon, MessageCircle, Send, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { buildShareMessage, buildShareUrl } from "@/lib/share";
import { useQuizResult } from "@/hooks/useQuizResult";

interface Props {
  picks: Set<string>;
}

export function ShareMenu({ picks }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // If the user has taken the quiz, fold their persona into the share so the
  // recipient sees the sender's festival profile, not just a pick count.
  const { result: quiz } = useQuizResult();
  const profile = quiz
    ? { persona: quiz.primaryPersona, secondaryPersona: quiz.secondaryPersona }
    : undefined;

  const disabled = picks.size === 0;
  const url = buildShareUrl(picks, profile);
  const message = buildShareMessage(picks.size, url, profile);

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
  const telegram = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`My Cercle Festival 2026 plan — ${picks.size} picks`)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied", { description: `${picks.size} pick${picks.size === 1 ? "" : "s"} packed into a share URL` });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy link");
    }
  }

  async function tryNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Cercle Festival 2026 — My plan",
          text: message,
        });
        setOpen(false);
        return true;
      } catch {}
    }
    return false;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={disabled} onClick={async (e) => {
          if (disabled) return;
          const used = await tryNativeShare();
          if (used) { e.preventDefault(); }
        }}>
          <Share2 className="w-4 h-4" />
          Share plan
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px]">
        <div className="px-2 py-1.5 mb-1 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-ink-mute)]">
          Share {picks.size} pick{picks.size === 1 ? "" : "s"}
        </div>

        <button
          onClick={copyLink}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-colors text-sm"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <LinkIcon className="w-4 h-4 text-[var(--color-ink-dim)]" />
          )}
          <span className="flex-1 text-left">{copied ? "Copied to clipboard" : "Copy link"}</span>
        </button>

        <a
          href={whatsapp} target="_blank" rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-colors text-sm"
        >
          <MessageCircle className="w-4 h-4 text-[#25d366]" />
          <span className="flex-1 text-left">WhatsApp</span>
          <ExternalArrow />
        </a>

        <a
          href={twitter} target="_blank" rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-colors text-sm"
        >
          <XLogo />
          <span className="flex-1 text-left">X / Twitter</span>
          <ExternalArrow />
        </a>

        <a
          href={telegram} target="_blank" rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-colors text-sm"
        >
          <Send className="w-4 h-4 text-[#26a5e4]" />
          <span className="flex-1 text-left">Telegram</span>
          <ExternalArrow />
        </a>

        <div className="px-3 pt-2 mt-1 border-t border-[var(--color-line)] font-mono text-[9.5px] tracking-[0.06em] text-[var(--color-ink-faint)]">
          <Copy className="w-2.5 h-2.5 inline-block mr-1 -translate-y-px" />
          Anyone with the link can import your plan
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ExternalArrow() {
  return (
    <span className="font-mono text-[10px] tracking-[0.06em] text-[var(--color-ink-faint)] uppercase">↗</span>
  );
}

function XLogo() {
  // X (Twitter) wordmark
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[var(--color-ink)]" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
