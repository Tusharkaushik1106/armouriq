type Props = {
  prefix: string;
  name: string;
  id: string;
  className?: string;
};

export function SectionEyebrow({ prefix, name, id, className = '' }: Props) {
  return (
    <div
      className={`font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-light)] ${className}`}
    >
      {`// ${prefix} //`}{' '}
      <span className="text-[var(--color-text-medium)]">{name}</span>{' '}
      {`// ${id}`}
    </div>
  );
}
