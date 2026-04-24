'use client';

// Single document-level mousemove listener that updates --proximity-glow
// on every element with data-proximity-glow="true". rAF-gated.

let initialized = false;
let frameRequested = false;
let mouseX = 0;
let mouseY = 0;

function initProximity() {
  if (typeof window === 'undefined') return;
  if (initialized) return;
  const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fineHover) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  initialized = true;

  const update = () => {
    frameRequested = false;
    const nodes = document.querySelectorAll<HTMLElement>('[data-proximity-glow]');
    nodes.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) {
        el.style.setProperty('--proximity-glow', '0');
        return;
      }
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(mouseX - cx, mouseY - cy);
      const max = Number(el.dataset.proximityMax || '220');
      const maxOp = Number(el.dataset.proximityOpacity || '0.35');
      const proximity = Math.max(0, 1 - dist / max);
      el.style.setProperty('--proximity-glow', (proximity * maxOp).toFixed(3));
    });
  };

  const onMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!frameRequested) {
      frameRequested = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('mousemove', onMove, { passive: true });
}

export function registerProximityGlow() {
  initProximity();
}
