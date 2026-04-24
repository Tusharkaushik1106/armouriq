type Props = {
  num: string;
  label: string;
  className?: string;
};

// Standard eyebrow: `― 04   THE PLATFORM`
// number dash at left, label at right, both mono 11px text-light.
export function SectionEyebrow({ num, label, className = '' }: Props) {
  return (
    <div
      className={`flex items-center justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-light)] ${className}`}
    >
      <span>― {num}</span>
      <span>{label}</span>
    </div>
  );
}
