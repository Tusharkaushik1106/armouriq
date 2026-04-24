'use client';
import { Marquee } from './Marquee';

export function MarqueeDivider({ text, reverse = false }: { text: string; reverse?: boolean }) {
  const items = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className="py-14 md:py-20 border-y border-[var(--color-border)] bg-[var(--color-bg)]">
      <Marquee speed={60} reverse={reverse}>
        {items.map((i) => (
          <span
            key={i}
            className="font-mono uppercase text-[clamp(64px,10vw,160px)] tracking-[-0.02em] font-medium text-[var(--color-text-light)] px-10"
          >
            {text}
            <span className="text-[var(--color-border-strong)] mx-6" aria-hidden="true">·</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
