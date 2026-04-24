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
              style={{ transform: 'translateY(100%)' }}
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          </span>
        ))}
      </span>
    );
  }
  const chars = Array.from(children);
  return (
    <span className={className}>
      {chars.map((c, i) => (
        <span key={i} className="split-mask">
          <span
            className={`split-inner ${innerClassName}`}
            style={{ transform: 'translateY(100%)' }}
          >
            {c === ' ' ? ' ' : c}
          </span>
        </span>
      ))}
    </span>
  );
}
