'use client';
import { useEffect } from 'react';
import { gsap } from '@/lib/gsap';

/**
 * Global safety net: ensures any element that was pre-hidden in JSX (inline
 * opacity:0 or translateY) and depends on a ScrollTrigger to become visible
 * never stays permanently hidden — even if the trigger never fires (iOS
 * Safari quirks, Lenis interactions, custom scroll harnesses).
 */
export function SafetyReveal() {
  useEffect(() => {
    const reveal = () => {
      // Force every SplitText inner to its visible state, overriding any
      // gsap.set translateY(100%) state that's still cached.
      const splitInners = document.querySelectorAll<HTMLElement>('.split-inner');
      if (splitInners.length) {
        gsap.set(splitInners, { y: 0, opacity: 1, clearProps: 'transform' });
        splitInners.forEach((el) => {
          // Clear any inline transform that pre-hides the inner.
          el.style.transform = 'translateY(0)';
        });
      }

      // Force-reveal any pre-hidden reveal elements still at opacity 0.
      const selectors = [
        '.hero-eyebrow',
        '.hero-sub',
        '.hero-cta',
        '.problem-eyebrow',
        '.problem-body',
        '.problem-badge',
        '.pi-fade',
        '.pi-annotation',
        '.cta-sub',
        '.cta-btn',
        '.dp-sub',
        '.dp-frame',
        '.dp-stat',
        '.faq-eyebrow',
        '.faq-subtitle',
        '.faq-row',
        '.manifesto-line-mobile',
        '.cmp-mobile-card',
        '.footer-col',
      ];
      const seen = new Set<HTMLElement>();
      selectors.forEach((sel) => {
        document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
          if (seen.has(el)) return;
          seen.add(el);
          const cs = window.getComputedStyle(el);
          if (parseFloat(cs.opacity) < 0.05) {
            gsap.set(el, { opacity: 1, y: 0, x: 0, scale: 1 });
            el.style.opacity = '1';
          }
        });
      });

      // Closing-line / heading underlines that draw via scaleX.
      document
        .querySelectorAll<HTMLElement>(
          '.cta-underline, .cmp-closing-underline, .rogue-underline, .emphasis-underline'
        )
        .forEach((el) => {
          const cs = window.getComputedStyle(el);
          // If transform shows scaleX 0 (matrix(0, …) or scaleX(0))
          if (cs.transform && cs.transform.includes('matrix(0')) {
            // for the rogue-underline, the desired final state is scaleX(0)
            // (it sweeps away). Skip it.
            if (!el.classList.contains('rogue-underline')) {
              gsap.set(el, { scaleX: 1 });
            }
          }
        });

      // Ensure ScrollTrigger refreshes after we've forced visibility, so
      // sticky reveal effects (e.g. FooterRevealWrapper relies on layout)
      // recompute heights.
      window.dispatchEvent(new Event('resize'));
    };
    const t = window.setTimeout(reveal, 4500);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
