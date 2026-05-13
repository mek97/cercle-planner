import type { ReactNode } from "react";

interface Props {
  title: string;
  sub: string;
  span?: 1 | 2 | 3;
  children: ReactNode;
  footer?: ReactNode;
  headerExtras?: ReactNode;
}

export function ChartCard({ title, sub, span = 1, children, footer, headerExtras }: Props) {
  const spanCls = span === 3 ? "md:col-span-3" : span === 2 ? "md:col-span-2" : "md:col-span-1";
  return (
    <div className={`surface chart-tint rounded-2xl p-5 md:p-7 flex flex-col min-w-0 ${spanCls}`}>
      <header className="flex justify-between items-end gap-4 flex-wrap mb-4 md:mb-5 min-w-0">
        <div className="min-w-0">
          <h4 className="font-[var(--font-display)] text-[19px] md:text-[21px] tracking-[-0.01em] m-0 leading-tight">{title}</h4>
          <span className="font-mono text-[10.5px] md:text-[11px] tracking-[0.12em] uppercase text-[var(--color-ink-mute)]">{sub}</span>
        </div>
        {headerExtras}
      </header>
      <div className="flex-1 min-h-0 min-w-0">{children}</div>
      {footer}
    </div>
  );
}
