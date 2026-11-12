import { useEffect, useRef } from 'react';

/* Endless row of square photo cards in depth (Chaya's spec, 12.11): a big card in front,
   smaller side cards tilted inward and tucked behind it. Every INTERVAL the row moves one step.
   Drag sideways, tap a side card, or use the arrow keys. RTL. */

// ⚙️ Settings: change only the value next to the note
const INTERVAL = 1.7;  // seconds between steps (0 = no autoplay)
const DURATION = 0.75; // one step, seconds
const SPREAD = 1;      // how far the side cards sit from the center (1 = as in the demo)
const TILT = 8;        // side card tilt, degrees (0 = flat)
const SIZE = { desk: 0.3035, tablet: 0.42, phone: 0.6 }; // card width as a share of the section width
const RADIUS = 22;     // card corners, px

export type DepthItem = { src: string; name: string; meta?: string; alt: string };

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
// soft start that eases out (measured on the reference)
const easeIO = (p: number) => .5 * (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2) + .5 * (1 - (1 - p) * (1 - p));

export function DepthLoop({ items, label }: { items: DepthItem[]; label: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<(HTMLDivElement | null)[]>([]);
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current!;
    const tiles = tilesRef.current.slice(0, items.length) as HTMLDivElement[];
    const n = items.length;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const rtl = getComputedStyle(stage).direction === 'rtl';
    const dir = rtl ? -1 : 1;
    let W = 1, cw = 1, pos = 0, raf = 0, lastStep = performance.now(), visible = false, announced = -1, hover = false, focused = false;
    let anim: { from: number; to: number; t0: number; dur: number; snap?: boolean } | null = null;
    let drag: { id: number; x: number; y: number; p0: number; lx: number; lt: number; v: number; moved: boolean } | null = null;

    const layout = () => {
      W = stage.getBoundingClientRect().width || 1;
      cw = W * (W < 768 ? SIZE.phone : W < 1025 ? SIZE.tablet : SIZE.desk);
      stage.style.setProperty('--dtl-card', cw.toFixed(1) + 'px');
      for (const el of tiles) {
        el.style.width = el.style.height = cw.toFixed(1) + 'px';
        el.style.marginLeft = el.style.marginTop = (-cw / 2).toFixed(1) + 'px';
      }
    };

    // offset d of a card from the center: 0 = front, ±1 = side cards, beyond ±1 it slides behind a side card and fades
    const draw = () => {
      const unit = cw * .665 * SPREAD;
      tiles.forEach((el, i) => {
        let d = i - pos; d -= Math.round(d / n) * n;
        const ad = Math.abs(d), sg = d < 0 ? -1 : 1;
        let x: number, s: number, op: number;
        if (ad <= 1) { x = unit * d + cw * .14 * SPREAD * Math.sin(Math.PI * d); s = 1 - .235 * Math.pow(ad, 1.6); op = 1; }
        else { const e = Math.min(ad - 1, 1); x = sg * unit * (1 - .3 * e); s = .765 - .12 * e; op = 1 - clamp(e / .5, 0, 1); }
        const rot = sg * Math.min(ad, 1) * TILT * (ad < 1 ? Math.sin(Math.PI * ad / 2) : 1);
        // perspective per card, so stacking follows z-index: the front card is always on top
        el.style.transform = `perspective(${(cw * 4).toFixed(0)}px) translate3d(${(x * dir).toFixed(1)}px,0,0) rotateY(${(rot * dir).toFixed(2)}deg) scale(${s.toFixed(4)})`;
        el.style.zIndex = String(Math.round(100 - ad * 10));
        el.style.opacity = op.toFixed(3);
        el.style.visibility = op <= .001 ? 'hidden' : '';
        el.setAttribute('aria-hidden', ad < .5 ? 'false' : 'true');
      });
      const cur = ((Math.round(pos) % n) + n) % n;
      if (cur !== announced && !anim && !drag && liveRef.current) { announced = cur; liveRef.current.textContent = [items[cur].name, items[cur].meta].filter(Boolean).join('. '); }
    };

    const go = (to: number, dur: number) => { if (reduce.matches || !dur) { pos = to; anim = null; } else anim = { from: pos, to, t0: performance.now(), dur }; lastStep = performance.now(); };
    const step = (k: number) => go((anim ? anim.to : Math.round(pos)) + k, DURATION * 1000);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (anim) {
        const p = clamp((now - anim.t0) / anim.dur, 0, 1);
        pos = anim.from + (anim.to - anim.from) * (anim.snap ? easeOut(p) : easeIO(p));
        if (p >= 1) { pos = anim.to; anim = null; lastStep = now; }
      } else if (!drag && visible && !hover && !focused && !reduce.matches && INTERVAL > 0 && n > 1 && now - lastStep > INTERVAL * 1000 && !document.hidden) step(1);
      draw();
    };

    // drag: the row follows the finger; release snaps to the nearest card, with a short throw
    const ac = new AbortController(), on = (ev: string, fn: (e: any) => void) => stage.addEventListener(ev, fn, { signal: ac.signal });
    on('pointerdown', (e: PointerEvent) => { if (e.button > 0) return; drag = { id: e.pointerId, x: e.clientX, y: e.clientY, p0: pos, lx: e.clientX, lt: e.timeStamp, v: 0, moved: false }; anim = null; });
    on('pointermove', (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(e.clientY - drag.y)) { drag.moved = true; stage.classList.add('is-dragging'); try { stage.setPointerCapture(e.pointerId); } catch { /* ignore */ } }
      if (drag.moved) {
        const unit = Math.max(1, cw * .665 * SPREAD);
        pos = drag.p0 - dx * dir / unit;
        const dt = Math.max(4, e.timeStamp - drag.lt);
        drag.v = drag.v * .5 + (-(e.clientX - drag.lx) * dir / unit) / dt * .5;
      }
      drag.lx = e.clientX; drag.lt = e.timeStamp;
    });
    const end = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag; drag = null; stage.classList.remove('is-dragging');
      if (d.moved) {
        const v = e.timeStamp - d.lt > 90 ? 0 : d.v;
        const to = Math.round(pos + clamp(v * 180, -1.5, 1.5));
        anim = reduce.matches ? null : { from: pos, to, t0: performance.now(), dur: DURATION * 800, snap: true };
        if (!anim) pos = to;
        lastStep = performance.now();
        return;
      }
      if (e.type === 'pointercancel') return;
      // 3D-rotated cards are unreliable for native hit-testing, so pick the front-most visible card under the point
      let hit = -1, bz = -1;
      tiles.forEach((el, i) => {
        if (el.style.visibility === 'hidden') return;
        const r = el.getBoundingClientRect(), z = +el.style.zIndex || 0;
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom && z > bz) { bz = z; hit = i; }
      });
      if (hit >= 0) { let dd = hit - Math.round(pos); dd -= Math.round(dd / n) * n; if (dd) step(dd); }
    };
    // hold still while the pointer is over the row or the keyboard is on it (WCAG 2.2.2)
    on('pointerenter', (e: PointerEvent) => { if (e.pointerType === 'mouse') hover = true; });
    on('pointerleave', () => { hover = false; lastStep = performance.now(); });
    on('focusin', () => { focused = stage.matches(':focus-visible'); });
    on('focusout', () => { focused = false; lastStep = performance.now(); });
    on('pointerup', end); on('pointercancel', end); on('dragstart', (e: Event) => e.preventDefault());
    on('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(dir); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-dir); }
    });

    // pause while off screen
    const io = new IntersectionObserver(en => { visible = en.some(x => x.isIntersecting); if (visible) lastStep = performance.now(); });
    io.observe(stage);
    const ro = new ResizeObserver(() => { layout(); draw(); });
    ro.observe(stage);
    layout(); draw();
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ac.abort(); io.disconnect(); ro.disconnect(); };
  }, [items]);

  return (
    <div ref={stageRef} tabIndex={0} role="region" aria-roledescription="carousel" aria-label={label}
      className="dtl-stage absolute inset-0 cursor-grab touch-pan-y select-none overflow-hidden outline-none [&.is-dragging]:cursor-grabbing"
      style={{ ['--dtl-radius' as string]: RADIUS + 'px' }}>
      {items.map((it, i) => (
        <div key={it.src} ref={el => { tilesRef.current[i] = el; }} className="dtl-tile">
          <img src={it.src} alt={it.alt} draggable={false} decoding="async" loading={i < 4 || i > items.length - 3 ? 'eager' : 'lazy'} />
          <div className="dtl-label">
            <span className="dtl-dot" />
            <span className="dtl-name">{it.name}</span>
            {it.meta && <><span className="dtl-sep" /><span className="dtl-meta">{it.meta}</span></>}
          </div>
        </div>
      ))}
      <div ref={liveRef} aria-live="polite" className="sr-only" />
    </div>
  );
}
