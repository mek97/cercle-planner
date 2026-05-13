import type { ReactNode } from "react";

interface Props {
  id?: string;
  kicker: string;
  title: ReactNode;
  lede?: string;
  children: ReactNode;
}

export function SectionShell({ id, kicker, title, lede, children }: Props) {
  return (
    <section id={id} className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 pt-14 md:pt-20 pb-8 md:pb-12">
      <header className="mb-6 md:mb-10 max-w-[720px]">
        <span className="kicker">{kicker}</span>
        <h2 className="display-h2 mb-4 md:mb-5">{title}</h2>
        {lede && <p className="text-[var(--color-ink-dim)] text-[15px] sm:text-[16.5px] leading-snug max-w-[600px]">{lede}</p>}
      </header>
      {children}
    </section>
  );
}
