'use client';
import type { ReactNode } from 'react';

type Props = {
  children: string;
  splitBy?: 'char' | 'word';
  className?: string;
  innerClassName?: string;
};

export function SplitText({
  children,
  splitBy = 'word',
  className = '',
  innerClassName = '',
}: Props): ReactNode {
  if (splitBy === 'word') {
    const words = children.split(' ');
    return (
      <span className={className}>
        {words.map((w, i) => (
          <span key={i} className="split-mask">
            <span
              className={`split-inner ${innerClassName}`}
              style={{ transform: 'translateY(130%)' }}
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          </span>
        ))}
      </span>
    );
  }
  // Char mode: group chars by word in a non-breaking inline-block so the
  // browser can't break a single word mid-character. Each char remains its
  // own .split-mask for the GSAP reveal.
  const tokens = children.split(/(\s+)/);
  return (
    <span className={className}>
      {tokens.map((tok, ti) => {
        if (tok === '') return null;
        if (/^\s+$/.test(tok)) {
          return <span key={`s-${ti}`}>{tok}</span>;
        }
        return (
          <span
            key={`w-${ti}`}
            style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
          >
            {Array.from(tok).map((c, ci) => (
              <span key={ci} className="split-mask">
                <span
                  className={`split-inner ${innerClassName}`}
                  style={{ transform: 'translateY(130%)' }}
                >
                  {c}
                </span>
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
}
