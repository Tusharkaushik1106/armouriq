'use client';
import { useEffect, useRef } from 'react';

// QClay's cursor (verified from .pw/qclay-cursor scan):
//   <div class="custom-cursor__point">  ← single element, no ring
//   rest:    10×10 white circle, transform matrix(1,0,0,1,-5,-5)  (= center on cursor)
//   hover:   adds .-hover-nav modifier → 60×60 (still white, still circle)
//   transition: background-color 0.3s, transform 0.3s, width 0.3s, height 0.3s
//
// All smoothness comes from CSS `transition: transform 0.3s` — NOT a JS lerp.
// The dot lags behind the cursor by ~300ms because every mousemove updates
// transform, and CSS eases the change. That's the entire trick.
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduced.matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    document.documentElement.classList.add('cursor-hidden');

    const onMove = (e: MouseEvent) => {
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };

    // Cursor expands ONLY on elements that explicitly opt-in via
    // data-cursor="hover" (= our CTA buttons). Everything else keeps
    // the small dot.
    const interactiveSelector = '[data-cursor="hover"]';
    const ignoreSelector = '[data-cursor="ignore"]';

    const shouldExpand = (el: HTMLElement | null) => {
      if (!el) return false;
      // Walk up: if we hit an ignore boundary before an interactive boundary, no expand.
      const ignored = el.closest(ignoreSelector);
      const interactive = el.closest(interactiveSelector);
      if (!interactive) return false;
      if (!ignored) return true;
      // If ignore element is contained inside the interactive element OR
      // is the interactive element itself / a closer ancestor, suppress.
      return !interactive.contains(ignored) && !ignored.contains(interactive);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (shouldExpand(t)) {
        dot.classList.add('cursor-dot--hover');
      } else {
        dot.classList.remove('cursor-dot--hover');
      }
    };
    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const related = e.relatedTarget as HTMLElement | null;
      if (shouldExpand(t) && !shouldExpand(related)) {
        dot.classList.remove('cursor-dot--hover');
      }
    };

    const onEnter = () => { dot.style.opacity = '1'; };
    const onLeave = () => { dot.style.opacity = '0'; };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, true);
    window.addEventListener('mouseout', onOut, true);
    document.documentElement.addEventListener('mouseenter', onEnter);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver, true);
      window.removeEventListener('mouseout', onOut, true);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.classList.remove('cursor-hidden');
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="cursor-dot fixed top-0 left-0 pointer-events-none z-[9999]"
    />
  );
}
