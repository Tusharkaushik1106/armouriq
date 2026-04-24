'use client';
import { Marquee } from './Marquee';

export function MarqueeDivider({ text, reverse = false }: { text: string; reverse?: boolean }) {
  const items = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className="py-8 md:py-12 border-y border-[var(--color-border)] bg-[var(--color-bg)]">
      <Marquee speed={60} reverse={reverse}>
        {items.map((i) => (
          <span
            key={i}
            className="font-mono uppercase text-[clamp(32px,5vw,64px)] tracking-[-0.01em] font-medium text-[var(--color-text-light)] px-8"
          >
            {text}
            <span className="text-[var(--color-border-strong)] mx-6" aria-hidden="true">·</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
