export function GapMarker({ from, to }: { from: string; to: string }) {
  return (
    <div
      aria-hidden="true"
      className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--color-text-light)] text-center py-4 select-none"
      style={{ opacity: 0.4 }}
    >
      :: end {from} :: begin {to} ::
    </div>
  );
}
