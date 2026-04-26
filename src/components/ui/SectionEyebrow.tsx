type Props = {
  num: string;
  label: string;
  className?: string;
  align?: 'split' | 'center';
};

// Standard eyebrow: `― 04   THE PLATFORM`
// align="split" (default): number on left, label on right.
// align="center": both pieces centered together as a single line.
export function SectionEyebrow({ num, label, className = '', align = 'split' }: Props) {
  if (align === 'center') {
    return (
      <div
        className={`flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-medium)] ${className}`}
      >
        <span>― {num}</span>
        <span aria-hidden="true" className="opacity-50">·</span>
        <span>{label}</span>
      </div>
    );
  }
  return (
    <div
      className={`flex items-center justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-light)] ${className}`}
    >
      <span>― {num}</span>
      <span>{label}</span>
    </div>
  );
}
