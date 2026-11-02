// Blends the page background between section colors continuously as you scroll (no timed "cut").
// Sections opt in with data-bg="#hex". Each section's weight is how much of it overlaps a band around
// the middle of the screen, so the color glides from one section to the next exactly with the scroll.
const toRgb = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export function watchPageColor() {
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  let current = '';

  const update = () => {
    const vh = window.innerHeight;
    const bandTop = vh * 0.2;
    const bandBottom = vh * 0.8;
    let total = 0;
    const mix = [0, 0, 0];
    document.querySelectorAll<HTMLElement>('[data-bg]').forEach(s => {
      const r = s.getBoundingClientRect();
      const overlap = Math.min(r.bottom, bandBottom) - Math.max(r.top, bandTop);
      if (overlap <= 0) return;
      const rgb = toRgb(s.dataset.bg!);
      for (let i = 0; i < 3; i++) mix[i] += rgb[i] * overlap;
      total += overlap;
    });
    if (!total) return;
    const color = `rgb(${mix.map(v => Math.round(v / total)).join(',')})`;
    if (color !== current) {
      current = color;
      root.style.setProperty('--page-bg', color);
      meta?.setAttribute('content', color);
    }
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  return () => {
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', update);
  };
}
