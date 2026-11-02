import { useEffect } from 'react';
import { img } from './data';

// Fruit that falls from the cursor. What falls depends on the section under it (data-trail):
// pomegranate seeds by the pomegranate, black seeds by the watermelon, mixed fruit elsewhere.
// Desktop with a fine pointer only, and never with reduced motion.
const aril = (hue: number) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 26"><defs><radialGradient id="g" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="hsl(${hue} 95% 72%)"/><stop offset=".45" stop-color="hsl(${hue} 85% 42%)"/><stop offset="1" stop-color="hsl(${hue} 80% 22%)"/></radialGradient></defs><path d="M10 1C15 6 19 11 19 16a9 9 0 0 1-18 0C1 11 5 6 10 1z" fill="url(#g)"/><ellipse cx="7" cy="12" rx="2.2" ry="3.4" fill="#fff" opacity=".55"/></svg>`,
  )}`;
const seed = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 18"><path d="M6 0C10 4 12 9 11 13a5 5 0 0 1-10 0C0 9 2 4 6 0z" fill="#1d1410"/><ellipse cx="4.4" cy="9" rx="1.2" ry="2.4" fill="#fff" opacity=".35"/></svg>',
)}`;

const sets: Record<string, { src: string; size: number }[]> = {
  pomegranate: [{ src: aril(348), size: 16 }, { src: aril(352), size: 13 }, { src: aril(344), size: 18 }],
  watermelon: [{ src: seed, size: 10 }, { src: seed, size: 8 }, { src: aril(356), size: 14 }],
  apple: [{ src: aril(358), size: 12 }, { src: img('fruit/mint.webp'), size: 30 }],
  mix: [
    { src: img('fruit/straw.webp'), size: 30 }, { src: img('fruit/kiwi.webp'), size: 32 },
    { src: img('fruit/mint.webp'), size: 26 }, { src: aril(348), size: 15 },
  ],
};

export function CursorTrail() {
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layer = document.createElement('div');
    layer.setAttribute('aria-hidden', 'true');
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:45;overflow:hidden';
    document.body.appendChild(layer);
    let lx = 0, ly = 0, live = 0;

    const onMove = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - lx, e.clientY - ly) < 34 || live > 36) return;
      lx = e.clientX; ly = e.clientY;
      const zone = (e.target as Element | null)?.closest?.('[data-trail]')?.getAttribute('data-trail');
      const set = zone && sets[zone];
      if (!set) return;
      const pick = set[Math.floor(Math.random() * set.length)];
      const el = document.createElement('img');
      el.src = pick.src;
      const s = pick.size * (0.8 + Math.random() * 0.5);
      const dx = (Math.random() - 0.5) * 70, dy = 60 + Math.random() * 90, rot = (Math.random() - 0.5) * 300;
      el.style.cssText = `position:absolute;left:${lx - s / 2}px;top:${ly - s / 2}px;width:${s}px;height:auto;will-change:transform,opacity`;
      layer.appendChild(el);
      live++;
      el.animate(
        [
          { transform: 'translate(0,0) rotate(0deg) scale(.4)', opacity: 0 },
          { transform: `translate(${dx * 0.2}px,${-8}px) rotate(${rot * 0.2}deg) scale(1)`, opacity: 1, offset: 0.15 },
          { transform: `translate(${dx}px,${dy}px) rotate(${rot}deg) scale(.9)`, opacity: 0 },
        ],
        { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.3,.0,.6,1)' },
      ).onfinish = () => { el.remove(); live--; };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); layer.remove(); };
  }, []);
  return null;
}
