import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import RotatingCards from './components/RotatingCards';
import { img, money, products } from './data';
import { Button, Eyebrow, Reveal, Stroke } from './ui';

type CartApi = { qty: (id: string) => number; add: (id: string) => void; openCart: () => void };

/* ───────────── Watermelon carving: drag to carve ───────────── */
function CarveSlider() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(88);
  const inView = useInView(ref, { once: true, margin: '-25% 0px' });
  const reduce = useReducedMotion();
  const dragging = useRef(false);

  // First time it shows up, the "knife" wipes across once so people see it moves
  useEffect(() => {
    if (!inView || reduce) { if (inView) setPos(50); return; }
    const c = animate(88, 12, { duration: 1.6, ease: [0.65, 0, 0.35, 1], onUpdate: setPos, onComplete: () => {
      animate(12, 50, { duration: 0.9, ease: [0.22, 1, 0.36, 1], onUpdate: setPos });
    } });
    return () => c.stop();
  }, [inView, reduce]);

  const move = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[855/855] w-full touch-pan-y select-none overflow-hidden rounded-[2rem] bg-plum"
      onPointerDown={e => { dragging.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); move(e.clientX); }}
      onPointerMove={e => dragging.current && move(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <img src={img('carve-roses.webp')} alt="אבטיח מגולף לזר של ורדים (הדמיה)" className="absolute inset-0 size-full object-cover" loading="lazy" draggable={false} />
      <img
        src={img('carve-roses-before.webp')}
        alt="אותו אבטיח לפני הגילוף"
        className="absolute inset-0 size-full object-cover"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        loading="lazy"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-gold shadow-[0_0_20px_rgb(214_178_110/0.8)]" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold font-display text-sub text-night shadow-xl">⇆</span>
      </div>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-night/80 px-3 py-1 text-note text-cream">לפני</span>
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-note font-medium text-night">אחרי</span>
      <input
        type="range" min={0} max={100} value={Math.round(pos)} onChange={e => setPos(+e.target.value)}
        aria-label="גררו כדי לראות את האבטיח לפני ואחרי הגילוף"
        className="absolute inset-x-0 bottom-0 h-10 w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

export function Carving({ cart }: { cart: CartApi }) {
  return (
    <section id="carving" data-bg="#33071f" data-trail="watermelon" className="pom-skin px-5 py-20 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <Eyebrow n="03">גילוף אבטיח</Eyebrow>
          <h2 className="mt-5 text-section text-cream">אבטיח אחד. <span className="gold-text block">זר שלם של ורדים.</span></h2>
          <p className="mt-5 max-w-lg text-mist">
            מבחוץ זה אבטיח רגיל. אחרי כמה שעות עם סכין אחת, הקליפה הירוקה נפתחת לורדים בלבן ובאדום, עם עלים חרוטים מסביב. גילוף הוא אמנות בפני עצמה, וכל אבטיח כזה הוא מרכז השולחן. אפשר גם שם, ברכה או ציור שתבחרו.
          </p>
          <ol className="mt-8">
            {[['מסמנים', 'את הציור או הברכה על הקליפה'], ['חורטים', 'שכבה אחרי שכבה, מהירוק אל הלבן והאדום'], ['פותחים', 'את הורדים והעלים, עד שהאבטיח נהיה פסל']].map(([t, d], i) => (
              <li key={t} className="flex items-baseline gap-4 border-t border-cream/10 py-4">
                <span className="font-display text-sub font-extralight text-gold">0{i + 1}</span>
                <p><span className="font-display text-sub text-cream">{t}</span> <span className="text-mist">{d}</span></p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button onClick={() => cart.add('x-carve')}>להוסיף אבטיח מגולף</Button>
            <span className="text-note text-mist">החל מ-{money(420)}, לפי הגודל והציור</span>
          </div>
        </div>
        <Reveal>
          <CarveSlider />
          <p className="mt-3 text-center text-note text-mist">גררו את הקו וראו את האבטיח לפני ואחרי</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── Personal touch: blessings engraved on apples ───────────── */
const presets = ['מזל טוב', 'שנה טובה', 'אוהבים אותך', 'בהצלחה!'];

export function AppleBlessing({ cart, text, setText }: { cart: CartApi; text: string; setText: (t: string) => void }) {
  const shown = text.trim() || 'מזל טוב';
  const size = shown.length > 14 ? 'text-[clamp(0.95rem,2.6vw,1.6rem)]' : shown.length > 8 ? 'text-[clamp(1.2rem,3.4vw,2.1rem)]' : 'text-[clamp(1.5rem,4.4vw,2.8rem)]';
  return (
    <section id="apple" data-bg="#f4ede3" data-trail="apple" className="paper overflow-x-clip px-5 py-20 text-ink md:px-8 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative mx-auto w-[min(82vw,26rem)]">
          <img src={img('fruit/apple.webp')} alt="תפוח אדום עם חלון חרוט בקליפה" className="w-full drop-shadow-[0_30px_40px_rgb(42_20_36/0.3)]" loading="lazy" />
          {/* The blessing sits on the peeled panel, pressed into the flesh */}
          <div className="absolute left-[38%] top-[36%] grid h-[48%] w-[54%] -rotate-3 place-items-center px-[4%] text-center">
            <motion.span
              key={shown}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`engraved block font-display leading-[1.05] ${size}`}
            >
              {shown}
            </motion.span>
          </div>
        </div>
        <div>
          <Eyebrow n="04" tone="deep">הטאץ׳ האישי</Eyebrow>
          <h2 className="mt-5 text-section text-ink">ברכה <Stroke>חרוטה על תפוח.</Stroke></h2>
          <p className="mt-5 max-w-lg text-ink-soft">
            הסימן של שלומי: תפוח אדום עם חלון בקליפה, והברכה שלכם חרוטה בתוכו ביד. נגיעה קטנה שהופכת מגש למתנה שזוכרים.
          </p>
          <label className="mt-8 block">
            <span className="mb-2 block text-note font-medium text-ink-soft">נסו בעצמכם, מה לחרוט?</span>
            <input
              value={text}
              onChange={e => setText(e.target.value.slice(0, 22))}
              placeholder="מזל טוב"
              className="w-full max-w-md rounded-2xl border border-ink/20 bg-white/70 px-4 py-3 font-display text-sub text-ink focus:border-wine focus:outline-none"
            />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {presets.map(p => (
              <button key={p} onClick={() => setText(p)} className="rounded-full border border-ink/20 px-3.5 py-1.5 text-note text-ink transition-colors hover:border-wine hover:text-wine">{p}</button>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button onClick={() => cart.add('x-apple')} className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-wine px-7 py-3.5 font-medium text-cream transition-colors hover:bg-plum">
              להוסיף תפוח חרוט
            </button>
            <span className="text-note text-ink-soft">{money(40)} לתפוח · הברכה עוברת להזמנה</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Platter ring (React Bits Pro: Rotating Cards) ───────────── */
function useRingSize() {
  const get = () => {
    const w = typeof window === 'undefined' ? 1200 : window.innerWidth;
    if (w < 640) return { radius: Math.max(230, w * 0.78), card: 120 };
    if (w < 1024) return { radius: 380, card: 160 };
    return { radius: 560, card: 200 };
  };
  const [s, setS] = useState(get);
  useEffect(() => { const on = () => setS(get()); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on); }, []);
  return s;
}

export function PlatterRing({ cart }: { cart: CartApi }) {
  const { radius, card } = useRingSize();
  const reduce = useReducedMotion();
  const picks = products.filter((_, i) => i % 2 === 0 || i > 17).slice(0, 14);
  const cards = picks.map(p => ({
    id: p.id,
    image: img(`catalog/${p.id}.webp`),
    background: `url(${img(`catalog/${p.id}.webp`)}) center/cover`,
    content: (
      <span className="absolute inset-x-0 bottom-3 mx-auto w-max rounded-full bg-night/85 px-2.5 py-1 text-[0.7rem] font-medium text-cream md:text-note">
        {p.name} · {money(p.price)}
      </span>
    ),
  }));
  const box = radius * 2 + card;

  return (
    <section id="ring" data-bg="#3e0925" data-trail="mix" className="pom-skin relative overflow-hidden pt-20 md:pt-28" style={{ height: `calc(${radius + card / 2}px + 18rem)` }}>
      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
        <Eyebrow n="05">סיבוב על המגשים</Eyebrow>
        <h2 className="mt-4 text-section text-cream">מגש מסתובב, <span className="gold-text">כמו על השולחן.</span></h2>
        <p className="mx-auto mt-3 max-w-md text-mist">סובבו באצבע, ולחצו על מגש כדי להוסיף אותו להזמנה.</p>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: `calc(18rem + ${card / 2}px)`, width: box, height: box }}>
        <RotatingCards
          cards={cards}
          radius={radius}
          cardWidth={card}
          cardHeight={card}
          duration={70}
          draggable
          autoPlay={!reduce}
          pauseOnHover
          cardClassName="!rounded-full ring-1 ring-gold/40 shadow-[0_20px_40px_-12px_rgb(10_0_6/0.7)]"
          onCardClick={c => cart.add(String(c.id))}
        />
      </div>
    </section>
  );
}
