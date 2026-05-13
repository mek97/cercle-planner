import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Check, Copy, Link as LinkIcon, Mail, MessageCircle, Send, Share2 } from "lucide-react";
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
  const subject = `My Cercle Festival 2026 plan — ${picks.size} pick${picks.size === 1 ? "" : "s"}`;

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
  const telegram = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(subject)}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const reddit = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(subject)}`;
  const threads = `https://www.threads.net/intent/post?text=${encodeURIComponent(message)}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const mail = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

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

  // Discord has no web-intent share URL. Best UX is to copy the full message
  // (with link) and prompt the user to paste it into their channel/DM.
  async function shareToDiscord() {
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Copied for Discord", { description: "Paste it into any channel or DM" });
      setOpen(false);
    } catch {
      toast.error("Couldn't copy message");
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
      <PopoverContent className="w-[300px]">
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

        <div className="my-1 h-px bg-[var(--color-line)]" />

        <div className="grid grid-cols-2 gap-0.5">
          <ShareLink href={whatsapp} onClick={() => setOpen(false)} label="WhatsApp">
            <MessageCircle className="w-4 h-4 text-[#25d366]" />
          </ShareLink>
          <ShareLink href={twitter} onClick={() => setOpen(false)} label="X / Twitter">
            <XLogo />
          </ShareLink>
          <ShareLink href={telegram} onClick={() => setOpen(false)} label="Telegram">
            <Send className="w-4 h-4 text-[#26a5e4]" />
          </ShareLink>
          <ShareLink href={facebook} onClick={() => setOpen(false)} label="Facebook">
            <FacebookLogo />
          </ShareLink>
          <ShareLink href={reddit} onClick={() => setOpen(false)} label="Reddit">
            <RedditLogo />
          </ShareLink>
          <ShareLink href={threads} onClick={() => setOpen(false)} label="Threads">
            <ThreadsLogo />
          </ShareLink>
          <ShareLink href={linkedin} onClick={() => setOpen(false)} label="LinkedIn">
            <LinkedInLogo />
          </ShareLink>
          <button
            type="button"
            onClick={shareToDiscord}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-colors text-sm min-w-0 text-left"
          >
            <span className="shrink-0 inline-flex items-center justify-center w-4 h-4">
              <DiscordLogo />
            </span>
            <span className="flex-1 truncate">Discord</span>
          </button>
          <ShareLink href={mail} onClick={() => setOpen(false)} label="Email" external={false}>
            <Mail className="w-4 h-4 text-[var(--color-ink-dim)]" />
          </ShareLink>
        </div>

        <div className="px-3 pt-2 mt-1 border-t border-[var(--color-line)] font-mono text-[9.5px] tracking-[0.06em] text-[var(--color-ink-faint)]">
          <Copy className="w-2.5 h-2.5 inline-block mr-1 -translate-y-px" />
          Anyone with the link can import your plan
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ShareLink({
  href,
  onClick,
  label,
  external = true,
  children,
}: {
  href: string;
  onClick: () => void;
  label: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-colors text-sm min-w-0"
    >
      <span className="shrink-0 inline-flex items-center justify-center w-4 h-4">{children}</span>
      <span className="flex-1 text-left truncate">{label}</span>
    </a>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[var(--color-ink)]" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#1877f2]" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.89h-2.33V22c4.78-.75 8.44-4.89 8.44-9.94Z" />
    </svg>
  );
}

function RedditLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#ff4500]" fill="currentColor" aria-hidden="true">
      <path d="M22 12.14a2.14 2.14 0 0 0-3.63-1.52c-1.6-1.06-3.74-1.74-6.11-1.83l1.2-3.84 3.27.78a1.74 1.74 0 1 0 .19-.92l-3.7-.88a.47.47 0 0 0-.55.32l-1.34 4.32c-2.46.06-4.69.74-6.34 1.82A2.14 2.14 0 1 0 3.4 13.7a4 4 0 0 0-.06.66c0 3.39 3.86 6.14 8.61 6.14s8.61-2.75 8.61-6.14a4 4 0 0 0-.06-.66 2.14 2.14 0 0 0 1.5-1.56ZM7.42 13.71a1.51 1.51 0 1 1 1.51 1.5 1.51 1.51 0 0 1-1.51-1.5Zm8.4 4a5.4 5.4 0 0 1-3.74 1.16 5.4 5.4 0 0 1-3.74-1.16.41.41 0 1 1 .55-.61 4.65 4.65 0 0 0 3.19 1 4.65 4.65 0 0 0 3.19-1 .41.41 0 0 1 .58 0 .42.42 0 0 1-.03.61Zm-.36-2.5a1.51 1.51 0 1 1 1.5-1.5 1.51 1.51 0 0 1-1.5 1.5Z" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#0a66c2]" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function DiscordLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#5865f2]" fill="currentColor" aria-hidden="true">
      <path d="M20.32 4.37A19.79 19.79 0 0 0 15.43 2.86a.07.07 0 0 0-.08.04c-.21.38-.45.87-.61 1.26a18.27 18.27 0 0 0-5.48 0 12.66 12.66 0 0 0-.62-1.26.08.08 0 0 0-.08-.04 19.74 19.74 0 0 0-4.89 1.51.07.07 0 0 0-.03.03C.13 9.04-.32 13.58.06 18.06a.08.08 0 0 0 .03.06 19.92 19.92 0 0 0 6 3.04.08.08 0 0 0 .09-.03 14.2 14.2 0 0 0 1.23-2 .08.08 0 0 0-.04-.1 13.13 13.13 0 0 1-1.87-.89.08.08 0 0 1 0-.13c.13-.1.25-.2.37-.3a.08.08 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.08.08 0 0 1 .08.01c.12.1.24.2.37.3a.08.08 0 0 1 0 .13c-.6.35-1.22.65-1.87.89a.08.08 0 0 0-.04.1c.36.7.77 1.36 1.23 2a.08.08 0 0 0 .09.03 19.86 19.86 0 0 0 6.01-3.04.08.08 0 0 0 .03-.06c.46-5.18-.77-9.68-3.27-13.66a.06.06 0 0 0-.03-.03ZM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.96 2.42-2.16 2.42Zm7.97 0c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.95 2.42-2.16 2.42Z" />
    </svg>
  );
}

function ThreadsLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[var(--color-ink)]" fill="currentColor" aria-hidden="true">
      <path d="M17.07 11.13c-.09-.04-.18-.08-.27-.12-.16-3-1.79-4.71-4.54-4.73h-.04c-1.65 0-3.02.7-3.86 1.98l1.51 1.04c.63-.95 1.61-1.16 2.35-1.16 1.62.01 2.45.96 2.58 2.31-.74-.13-1.55-.17-2.4-.11-2.41.14-3.96 1.55-3.86 3.51.05 1 .55 1.85 1.4 2.4.72.47 1.65.7 2.62.65 1.28-.07 2.28-.56 2.99-1.45.53-.68.87-1.55 1.02-2.65.6.36 1.05.83 1.3 1.4.43.97.45 2.57-.84 3.86-1.14 1.13-2.5 1.62-4.55 1.64-2.27-.02-4-.75-5.13-2.17C7.31 16.16 6.75 14.42 6.73 12c.02-2.42.58-4.16 1.66-5.5C9.52 5.07 11.25 4.34 13.52 4.32c2.29.02 4.05.76 5.21 2.2.57.71 1 1.6 1.29 2.66l1.91-.51c-.35-1.3-.91-2.43-1.66-3.36C18.81 3.44 16.58 2.5 13.53 2.48h-.01c-3.04.02-5.25.96-6.55 2.81C5.7 6.92 5.04 9.05 5 11.99v.02c.04 2.94.7 5.07 1.97 6.7 1.3 1.85 3.51 2.79 6.55 2.81 2.69-.02 4.59-.72 6.16-2.27 2.05-2.04 1.99-4.6 1.32-6.16-.45-1.06-1.29-1.91-2.43-2.46h-.49ZM12.99 16.6c-1.08.06-2.21-.43-2.27-1.46-.04-.76.54-1.61 2.34-1.71.2-.01.4-.02.59-.02.65 0 1.27.06 1.83.18-.21 2.6-1.43 2.95-2.49 3.01Z" />
    </svg>
  );
}
