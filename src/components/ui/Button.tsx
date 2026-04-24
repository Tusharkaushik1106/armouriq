'use client';
import type { ReactNode } from 'react';
import { MagneticButton } from './MagneticButton';

type Variant = 'primary' | 'secondary' | 'ghost';

type CommonProps = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  magnetic?: boolean;
  trail?: boolean;
  ariaLabel?: string;
};

type AnchorProps = CommonProps & {
  as?: 'a';
  href: string;
  onClick?: never;
};

type ButtonProps = CommonProps & {
  as: 'button';
  href?: never;
  onClick?: () => void;
};

type Props = AnchorProps | ButtonProps;

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium tracking-[-0.005em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2';

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] px-6 py-3.5',
  secondary:
    'border border-[var(--color-border-strong)] text-[var(--color-text-dark)] hover:border-[var(--color-text-dark)] px-6 py-3.5',
  ghost:
    'text-[var(--color-text-dark)] underline-slide px-4 py-3',
};

export function Button(props: Props) {
  const { variant = 'primary', magnetic = false, trail = false, className = '', children, ariaLabel } = props;
  const classes = `${base} ${variants[variant]} ${className}`;

  const inner = <span className="inline-flex items-center gap-2">{children}</span>;

  if (props.as === 'button') {
    if (magnetic) {
      return (
        <MagneticButton onClick={props.onClick} className={classes} ariaLabel={ariaLabel} trail={trail}>
          {inner}
        </MagneticButton>
      );
    }
    return (
      <button onClick={props.onClick} className={classes} aria-label={ariaLabel}>
        {inner}
      </button>
    );
  }

  // anchor
  if (magnetic) {
    return (
      <MagneticButton href={props.href} className={classes} ariaLabel={ariaLabel} trail={trail}>
        {inner}
      </MagneticButton>
    );
  }
  return (
    <a href={props.href} className={classes} aria-label={ariaLabel}>
      {inner}
    </a>
  );
}
