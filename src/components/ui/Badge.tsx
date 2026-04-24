import type { ReactNode } from 'react';

type Variant = 'default' | 'danger' | 'success';

const styles: Record<Variant, { bg: string; border: string; text: string; dot: string }> = {
  default: {
    bg: 'bg-[var(--color-surface)]',
    border: 'border-[var(--color-border-strong)]',
    text: 'text-[var(--color-text-medium)]',
    dot: 'bg-[var(--color-text-light)]',
  },
  danger: {
    bg: 'bg-[var(--color-danger-bg)]',
    border: 'border-[rgba(198,61,61,0.25)]',
    text: 'text-[var(--color-danger)]',
    dot: 'bg-[var(--color-danger)]',
  },
  success: {
    bg: 'bg-[rgba(61,139,92,0.08)]',
    border: 'border-[rgba(61,139,92,0.25)]',
    text: 'text-[var(--color-success)]',
    dot: 'bg-[var(--color-success)]',
  },
};

export function Badge({
  variant = 'default',
  children,
  className = '',
}: {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}) {
  const s = styles[variant];
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border font-mono text-[11px] uppercase tracking-[0.08em] ${s.bg} ${s.border} ${s.text} ${className}`}
    >
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {children}
    </span>
  );
}
