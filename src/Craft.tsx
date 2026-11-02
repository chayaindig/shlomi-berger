import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { lazy, Suspense, useEffect, useRef, useState, type RefObject } from 'react';
import { img, money, products, works } from './data';

// three.js effects (React Bits Pro) load only after the page has loaded and the section is near,
// with a static image until then, so phones never pay for them up front.
const ShaderReveal = lazy(() => import('./components/ShaderReveal'));
const ConcaveCarousel = lazy(() => import('./components/ConcaveCarousel'));

function useReadyNear(ref: RefObject<Element | null>) {
  const near = useInView(ref, { once: true, margin: '300px 0px' });
  const [loaded, setLoaded] = useState(() => document.readyState === 'complete');
  useEffect(() => {
    if (loaded) return;
    const on = () => setLoaded(true);
    window.addEventListener('load', on);
    return () => window.removeEventListener('load', on);
  }, [loaded]);
  return near && loaded;
}
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

/* Shader Reveal (Pro): a liquid trail under the cursor or finger wipes the rind away and shows the roses */
function CarveReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useReadyNear(ref);
  const before = img('carve-roses-before.webp');
  const fallback = <img src={before} alt="" className="absolute inset-0 size-full object-cover" />;
  return (
    <div ref={ref} className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-plum">
      <span className="sr-only">אבטיח שלם, ומתחתיו אותו אבטיח מגולף לזר של ורדים (הדמיה)</span>
      {ready ? (
        <Suspense fallback={fallback}>
          <ShaderReveal
            frontImage={before}
            backImage={img('carve-roses.webp')}
            className="absolute inset-0"
            cursorSize={300}
            revealStrength={1}
            autoIntensity={1.8}
          />
        </Suspense>
      ) : fallback}
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-gold px-3 py-1 text-note font-medium text-night">העבירו עליו את העכבר</span>
    </div>
  );
}

export function Carving({ cart }: { cart: CartApi }) {
  const reduce = useReducedMotion();
  return (
    <section id="carving" data-bg="#33071f" className="pom-skin px-5 py-20 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
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
          {reduce ? <CarveSlider /> : <CarveReveal />}
          <p className="mt-3 text-center text-note text-mist">
            {reduce ? 'גררו את הקו וראו את האבטיח לפני ואחרי' : 'העבירו את העכבר על האבטיח (או את האצבע בטלפון) וחשפו את הוורדים שמתחת לקליפה'}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── Personal touch: Shlomi's real engraved apples, turning on their own ───────────── */
const apples = [
  { src: 'love', alt: 'תפוח חרוט: אוהבת אותך' },
  { src: '13', alt: 'תפוח חרוט: מזל טוב 13' },
  { src: 'girl', alt: "תפוח חרוט: It's a girl" },
  { src: 'book', alt: 'תפוח חרוט עם לוחות הברית וברכה' },
  { src: 'heart', alt: 'תפוח חרוט עם לב וברכה לאחות' },
];

function AppleCarousel() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (reduce || hold) return;
    const t = setInterval(() => setActive(a => (a + 1) % apples.length), 2600);
    return () => clearInterval(t);
  }, [reduce, hold]);

  return (
    <div
      className="relative mx-auto aspect-[5/4] w-full max-w-[34rem]"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      aria-roledescription="carousel"
      aria-label="תפוחים שחרט שלומי"
    >
      {apples.map((a, i) => {
        // offset in the ring: 0 is centre, -1/1 the neighbours, the rest wait behind
        let d = i - active;
        if (d > apples.length / 2) d -= apples.length;
        if (d < -apples.length / 2) d += apples.length;
        const far = Math.abs(d) > 1;
        return (
          <motion.img
            key={a.src}
            src={img(`apples/${a.src}.webp`)}
            alt={d === 0 ? a.alt : ''}
            aria-hidden={d !== 0}
            loading="lazy"
            onClick={() => setActive(i)}
            initial={false}
            animate={{
              x: `${-d * 62}%`,
              scale: d === 0 ? 1 : 0.58,
              rotate: d === 0 ? 0 : d * -8,
              opacity: far ? 0 : d === 0 ? 1 : 0.55,
              zIndex: d === 0 ? 3 : far ? 1 : 2,
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className={`absolute inset-0 m-auto h-[88%] w-auto cursor-pointer object-contain drop-shadow-[0_28px_30px_rgb(42_20_36/0.35)] ${far ? 'pointer-events-none' : ''}`}
          />
        );
      })}
      <div className="absolute inset-x-0 -bottom-6 flex justify-center gap-2">
        {apples.map((a, i) => (
          <button
            key={a.src}
            onClick={() => setActive(i)}
            aria-label={`תפוח ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-wine' : 'w-1.5 bg-ink/25'}`}
          />
        ))}
      </div>
    </div>
  );
}

export function AppleBlessing({ cart }: { cart: CartApi }) {
  return (
    <section id="apple" data-bg="#f4ede3" data-trail="apple" className="paper overflow-x-clip px-5 py-20 text-ink md:px-8 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2 md:gap-16">
        <AppleCarousel />
        <div>
          <h2 className="text-section text-ink">ברכה <Stroke>חרוטה על תפוח.</Stroke></h2>
          <p className="mt-5 max-w-lg text-ink-soft">
            הסימן של שלומי: תפוח אדום, והברכה שלכם נחרטת בקליפה ביד. אוהבת אותך, מזל טוב, שם של תינוקת חדשה או ברכה שלמה לאחות. נגיעה קטנה שהופכת מגש למתנה שזוכרים.
          </p>
          <p className="mt-5 max-w-lg font-display text-sub text-wine">אין גבול למה שאפשר לחרוט: מילה, שם, מספר, ציור או לוגו.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button onClick={() => cart.add('x-apple')} className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-wine px-7 py-3.5 font-medium text-cream transition-colors hover:bg-plum">
              להוסיף תפוח חרוט
            </button>
            <span className="text-note text-ink-soft">החל מ-{money(40)} לתפוח · את הנוסח כותבים בהזמנה</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Shlomi's platters on a curved wall (React Bits Pro: Concave Carousel) ───────────── */
export function PlatterWall({ cart }: { cart: CartApi }) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useReadyNear(ref);
  const reduce = useReducedMotion();
  const trays = products.filter((_, i) => i % 2 === 0 || i > 17).slice(0, 10);
  const items = [
    ...works.map(w => ({ src: w.src, alt: w.title, title: w.title, subtitle: 'עבודה של שלומי' })),
    ...trays.map(p => ({ src: img(`catalog/${p.id}.webp`), alt: `מגש ${p.name} ${p.size}`, title: p.name, subtitle: `${p.size} · ${money(p.price)}` })),
  ];
  const ids = [...works.map(() => ''), ...trays.map(p => p.id)];

  return (
    <section id="wall" data-bg="#3e0925" data-trail="mix" className="pom-skin relative overflow-x-clip pb-10 pt-20 md:pt-28">
      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
        <h2 className="mt-4 text-section text-cream">קיר שלם <span className="gold-text">של מגשים.</span></h2>
        <p className="mx-auto mt-3 max-w-md text-mist">גררו הצידה כדי לעבור בין המגשים. לחיצה על מגש מהקטלוג מוסיפה אותו להזמנה.</p>
      </div>
      <div ref={ref} className="relative mt-6 h-[min(70vh,34rem)] min-h-[420px]">
        {ready ? (
          <Suspense fallback={null}>
            <ConcaveCarousel
              items={items}
              aspect={1}
              size={0.5}
              curvature={0.7}
              autoplay={reduce ? 'off' : 'drift'}
              wheel={false}
              captions
              controls
              backgroundColor="transparent"
              className="!h-full text-cream"
              ariaLabel="קיר מגשים מעוקל. גררו או השתמשו בחצים כדי לעבור בין המגשים."
              onSelect={(_, i) => ids[i] && cart.add(ids[i])}
            />
          </Suspense>
        ) : (
          <div className="no-scrollbar flex h-full items-center gap-4 overflow-x-auto px-5">
            {items.slice(0, 6).map(it => <img key={it.src} src={it.src} alt={it.alt} className="h-3/4 shrink-0 rounded-3xl object-cover" style={{ aspectRatio: 1 }} />)}
          </div>
        )}
      </div>
    </section>
  );
}
