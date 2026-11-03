import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CartDrawer } from '../App';
import { categories, extras, img, money, products, waLink, type Category } from '../data';
import { watchOrphans } from '../noOrphans';
import { Icon } from '../ui';

/*
  Version B: "the watermelon". One fruit carries the first three screens.
  Scrolling carves it: whole (green rind) → first cut (red flesh) → finished rose (cream).
  The background follows the fruit, and then the shop opens.
*/

type CartApi = { qty: (id: string) => number; add: (id: string) => void; openCart: () => void };

const GREEN = '#0d3a22';
const RED = '#8e1f2d'; // deep flesh, bright red was too loud on a full screen
const STONE = '#d9d3c2'; // under the stone photo of section 3

const allItems = [...products.map(p => ({ id: p.id, name: p.name })), ...extras.map(x => ({ id: x.id, name: x.name }))];
const carve = extras.find(x => x.id === 'x-carve')!;

export default function MelonApp() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => watchOrphans(), []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2200); return () => clearTimeout(t); }, [toast]);

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const api = useMemo<CartApi>(() => ({
    qty: id => cart[id] || 0,
    add: id => {
      setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
      setToast('נוסף להזמנה · ' + (allItems.find(i => i.id === id)?.name ?? ''));
    },
    openCart: () => setOpen(true),
  }), [cart]);

  return (
    <>
      <a href="#shop" className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-night">דילוג למגשים</a>
      <Header count={count} onCart={() => setOpen(true)} />
      <main>
        <MelonStory cart={api} />
        <Shop cart={api} />
        <Events />
      </main>
      <Footer />

      <a
        href={waLink('היי שלומי, אשמח לשמוע על מגשי הפירות')}
        target="_blank"
        rel="noreferrer"
        aria-label="וואטסאפ לשלומי"
        className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-8px_rgb(0_0_0/0.5)] transition-transform hover:scale-105"
      >
        <Icon name="whatsapp" className="size-7" />
      </a>

      <AnimatePresence>
        {count > 0 && !open && (
          <motion.button
            initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 left-5 right-24 z-40 flex items-center justify-between rounded-full bg-gold px-5 py-3.5 font-medium text-night shadow-xl md:left-auto md:right-24 md:w-80"
          >
            <span>{count === 1 ? 'פריט אחד בהזמנה' : `${count} פריטים בהזמנה`}</span>
            <span className="flex items-center gap-1.5">להמשך <Icon name="arrow" className="size-5" /></span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            role="status"
            className="fixed left-1/2 top-20 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-5 py-2.5 text-note text-cream shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer open={open} onClose={() => setOpen(false)} cart={cart} setCart={setCart} />
    </>
  );
}

function Header({ count, onCart }: { count: number; onCart: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled ? 'bg-night/95 shadow-[0_1px_0_rgb(166_210_122/0.15)]' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
        <a href="#top" aria-label="האמנות שבפרי, לראש העמוד"><img src={img('logo-gold.webp')} alt="האמנות שבפרי" className="h-9 w-auto md:h-11" /></a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="ניווט ראשי">
          <a href="#shop" className="text-note font-medium text-cream/85 transition-colors hover:text-gold">המגשים</a>
          <a href="#events" className="text-note font-medium text-cream/85 transition-colors hover:text-gold">אירועים</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href="#shop" className="whitespace-nowrap rounded-full bg-gold px-4 py-2.5 text-note font-medium text-night transition-colors hover:bg-[#ff7a86] sm:px-5">להזמין מגש</a>
          <button onClick={onCart} aria-label={`ההזמנה שלי, ${count} פריטים`} className="relative grid size-11 place-items-center rounded-full border border-cream/20 text-cream transition-colors hover:border-gold hover:text-gold">
            <Icon name="basket" className="size-[1.35rem]" />
            {count > 0 && <span className="absolute -left-1 -top-1 grid size-5 place-items-center rounded-full bg-gold text-[0.7rem] font-medium text-night">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ───────── The story: one watermelon, three cuts ───────── */

type Stage = { word: string; stroke: string; content: (cart: CartApi) => ReactNode };

const stages: Stage[] = [
  {
    word: 'אבטיח',
    stroke: 'rgb(217 234 208 / 0.22)',
    content: () => (
      <>
        <h1 className="text-hero text-cream md:text-[clamp(3.5rem,6vw,6.25rem)]">
          <span className="block whitespace-nowrap">לא חותכים פירות.</span>
          <span className="block whitespace-nowrap text-gold">מגלפים אותם.</span>
        </h1>
        <p className="mt-5 max-w-md text-cream/85">
          מגשי פירות מעוצבים בעבודת יד של שלומי ברגר, עם גילופים שלא קונים מהמדף. משלוח בירושלים, גבעת זאב ומודיעין, החל מ-285 ₪.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href="#shop" className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gold px-6 py-3.5 font-medium text-night transition-colors hover:bg-[#ff7a86]">
            לבחור מגש <Icon name="arrow" className="size-5" />
          </a>
          <span className="text-note text-cream/70">גללו, ותראו מה קורה לאבטיח</span>
        </div>
      </>
    ),
  },
  {
    word: 'חיתוך',
    stroke: 'rgb(247 241 227 / 0.4)',
    content: () => (
      <>
        <h2 className="text-section text-cream">
          <span className="block whitespace-nowrap">הכל מתחיל</span>
          <span className="block whitespace-nowrap text-[#b9df8f]">בחיתוך אחד.</span>
        </h2>
        <p className="mt-5 max-w-md text-cream/90">
          כל מגש מעוצב ביד ומתאים את עצמו לפירות הכי טובים של העונה. הצורה, הגודל והסגנון נשארים, והצבעים תמיד מפתיעים לטובה.
        </p>
      </>
    ),
  },
  {
    word: 'גילוף',
    stroke: 'rgb(13 58 34 / 0.16)',
    content: cart => (
      <>
        <h2 className="text-section text-ink">
          <span className="block whitespace-nowrap">וכשזה מגיע לשולחן,</span>
          <span className="block whitespace-nowrap text-gold-deep">כולם עוצרים.</span>
        </h2>
        <p className="mt-5 max-w-md text-ink">
          בשביל הרגע הזה שלומי מגלף. שם, ברכה או ציור, ביד ובמיוחד בשבילכם. מגש שמצטלמים איתו לפני שמתחילים לאכול.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a href="#shop" className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gold px-6 py-3.5 font-medium text-night transition-colors hover:bg-[#ff7a86]">
            לכל המגשים והמחירים <Icon name="arrow" className="size-5" />
          </a>
          <button
            onClick={() => cart.add(carve.id)}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/40 bg-cream/50 px-5 py-3.5 font-medium text-ink transition-colors hover:border-ink"
          >
            אבטיח מגולף, החל מ-{money(carve.price!)} <Icon name="plus" className="size-4" />
          </button>
        </div>
      </>
    ),
  },
];

function MelonStory({ cart }: { cart: CartApi }) {
  const reduce = useReducedMotion();
  if (reduce) return <StaticStory cart={cart} />;
  return <ScrollStory cart={cart} />;
}

function ScrollStory({ cart }: { cart: CartApi }) {
  const ref = useRef<HTMLElement>(null);
  // Own scroll progress instead of useScroll: its accelerated scroll timeline mapped our ranges wrong
  const p = useMotionValue(0);
  useEffect(() => {
    const on = () => {
      const el = ref.current; if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      p.set(Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total)));
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, [p]);
  const [stage, setStage] = useState(0);
  useMotionValueEvent(p, 'change', v => setStage(v < 0.33 ? 0 : v < 0.66 ? 1 : 2));

  // Background follows the fruit: rind green → flesh red → cut-rind cream
  const bg = useTransform(p, [0, 0.27, 0.36, 0.6, 0.69, 1], [GREEN, GREEN, RED, RED, STONE, STONE]);
  const ops = [
    useTransform(p, [0, 0.27, 0.34], [1, 1, 0]),
    useTransform(p, [0.3, 0.37, 0.6, 0.67], [0, 1, 1, 0]),
    useTransform(p, [0.63, 0.7], [0, 1]),
  ];
  const rotate = useTransform(p, [0, 1], [-7, 5]);
  const scale = useTransform(p, [0, 0.3, 0.37, 0.63, 0.7, 1], [1, 1, 1.05, 1.05, 1.1, 1.05]);
  const stripes = useTransform(p, [0, 0.3], [1, 0]);
  const flesh = useTransform(p, [0.27, 0.36, 0.6, 0.69], [0, 1, 1, 0]);
  const grain = useTransform(p, [0.27, 0.36], [0, 1]);

  return (
    <section ref={ref} id="top" aria-label="האבטיח של שלומי, משלם למגולף" className="relative" style={{ height: '330vh' }}>
      <motion.div style={{ backgroundColor: bg }} className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div aria-hidden style={{ opacity: stripes }} className="rind absolute inset-0" />
        {/* section 2: a soft glow from the fruit and a dark edge, like light on cut flesh */}
        <motion.div aria-hidden style={{ opacity: flesh }} className="flesh absolute inset-0" />
        {/* section 3: a real stone table photo */}
        <motion.div aria-hidden style={{ opacity: ops[2] }} className="absolute inset-0">
          <img src={img('melon/stone.webp')} alt="" loading="lazy" className="size-full object-cover" />
          {/* a light veil on the text side so the copy stays easy to read on the stone */}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(240_234_220/0.85)_0%,rgb(240_234_220/0.55)_45%,transparent_65%)] md:bg-[linear-gradient(to_left,rgb(240_234_220/0.8)_0%,rgb(240_234_220/0.45)_42%,transparent_62%)]" />
        </motion.div>
        <motion.div aria-hidden style={{ opacity: grain }} className="grain absolute inset-0" />

        <div className="relative mx-auto grid h-full max-w-7xl grid-rows-[44%_56%] px-5 pt-16 md:grid-cols-[1.05fr_1fr] md:grid-rows-1 md:gap-8 md:px-8 md:pt-20">
          {/* Text, right side on desktop, bottom on mobile */}
          <div className="relative order-2 md:order-1">
            {stages.map((s, i) => (
              <Panel key={i} o={ops[i]} active={stage === i}>{s.content(cart)}</Panel>
            ))}
          </div>

          {/* The fruit */}
          <div className="relative order-1 grid place-items-center md:order-2">
            {stages.map((s, i) => (
              <motion.span
                key={i}
                aria-hidden
                style={{ opacity: ops[i], WebkitTextStroke: `1.5px ${s.stroke}` }}
                className="outline-word pointer-events-none absolute select-none whitespace-nowrap font-display text-[clamp(5rem,22vw,12.5rem)] md:text-[clamp(6rem,12vw,13rem)] leading-none"
              >
                {s.word}
              </motion.span>
            ))}
            <motion.div style={{ rotate, scale }} className="relative aspect-square w-[min(74vw,40svh)] md:w-[min(40vw,70svh)]">
              <div aria-hidden className="absolute inset-x-[14%] bottom-[2%] h-[8%] rounded-[50%] bg-black/35 blur-xl" />
              {[1, 2, 3].map((n, i) => (
                <motion.img
                  key={n}
                  src={img(`melon/${n}.webp`)}
                  alt={i === 2 ? 'אבטיח מגולף בצורת ורד, עבודת יד' : ''}
                  style={{ opacity: ops[i] }}
                  className="absolute inset-0 size-full object-contain"
                  {...(i === 0 ? {} : { loading: 'lazy' as const })}
                />
              ))}
              <Cut p={p} range={[0.23, 0.33]} d="M98 33 Q50 27 2 33" />
              <Cut p={p} range={[0.56, 0.66]} d="M95 42 L88 33 L81 42 L74 33 L67 42 L60 33 L53 42 L46 33 L39 42 L32 33 L25 42 L18 33 L11 42 L4 33" />
              <Seeds p={p} />
            </motion.div>
          </div>
        </div>

        {/* Progress: three seeds, and a way out */}
        <div className="absolute left-5 top-20 flex gap-2 md:left-8 md:top-1/2 md:-translate-y-1/2 md:flex-col" aria-label={`שלב ${stage + 1} מתוך 3`} role="img">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className={`block h-3.5 w-2.5 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] transition-all duration-500 ${
                i === stage ? 'scale-125 bg-current' : 'bg-current opacity-30'
              } ${stage === 2 ? 'text-ink' : 'text-cream'}`}
            />
          ))}
        </div>
        <a href="#shop" className={`absolute bottom-5 left-5 hidden text-note underline underline-offset-4 md:left-8 md:block ${stage === 2 ? 'text-ink-soft' : 'text-cream/70'}`}>
          דילוג למגשים
        </a>
      </motion.div>
    </section>
  );
}

function Panel({ o, active, children }: { o: MotionValue<number>; active: boolean; children: ReactNode }) {
  const y = useTransform(o, v => (1 - v) * 28);
  return (
    <motion.div
      style={{ opacity: o, y }}
      aria-hidden={!active}
      className={`absolute inset-0 flex flex-col justify-start pt-4 md:justify-center md:pt-0 ${active ? '' : 'pointer-events-none'}`}
    >
      {children}
    </motion.div>
  );
}

/** A knife line drawn across the fruit, right to left, with a small blade riding its tip */
function Cut({ p, range, d }: { p: MotionValue<number>; range: [number, number]; d: string }) {
  const [a, b] = range;
  const len = useTransform(p, [a, b], [0, 1]);
  const op = useTransform(p, [a - 0.01, a + 0.01, b, b + 0.05], [0, 1, 1, 0]);
  const pathRef = useRef<SVGPathElement>(null);
  const [tip, setTip] = useState({ x: 98, y: 33 });
  useMotionValueEvent(len, 'change', v => {
    const el = pathRef.current; if (!el) return;
    const pt = el.getPointAtLength(el.getTotalLength() * v);
    setTip({ x: pt.x, y: pt.y });
  });
  return (
    <motion.svg aria-hidden viewBox="0 0 100 100" style={{ opacity: op }} className="pointer-events-none absolute inset-0 size-full overflow-visible">
      <motion.path ref={pathRef} d={d} fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" style={{ pathLength: len }} />
      <motion.path d={d} fill="none" stroke="#fffaf0" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: len }} />
      <g transform={`translate(${tip.x} ${tip.y}) rotate(-35)`}>
        <path d="M0 0 L-2.6 -15 L1.6 -15 Z" fill="#e9edf2" stroke="#9aa1ab" strokeWidth="0.3" />
        <rect x="-2.4" y="-25" width="3.6" height="10" rx="1.6" fill="#1e5c30" />
      </g>
    </motion.svg>
  );
}

/** Seeds that fly off when the first cut opens the fruit */
function Seeds({ p }: { p: MotionValue<number> }) {
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => <Seed key={i} i={i} p={p} />)}
    </>
  );
}
function Seed({ i, p }: { i: number; p: MotionValue<number> }) {
  const a = (-160 + i * 17) * (Math.PI / 180);
  const dist = 22 + (i % 3) * 9;
  const t = useTransform(p, [0.3, 0.42], [0, 1]);
  const x = useTransform(t, v => `${Math.cos(a) * dist * v}%`);
  const y = useTransform(t, v => `${Math.sin(a) * dist * v + 30 * v * v}%`);
  const op = useTransform(t, [0, 0.1, 0.8, 1], [0, 1, 1, 0]);
  const rotate = useTransform(t, [0, 1], [0, 200 + i * 40]);
  return (
    <motion.span
      aria-hidden
      style={{ x, y, opacity: op, rotate }}
      className="absolute left-1/2 top-[30%] block h-[3.2%] w-[2%] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[#1b120f]"
    />
  );
}

/* Reduced motion: the same three moments, simply one under the other */
function StaticStory({ cart }: { cart: CartApi }) {
  const bgs = [GREEN, RED, STONE];
  return (
    <div id="top">
      {stages.map((s, i) => (
        <section key={i} style={{ backgroundColor: bgs[i] }} className="px-5 pb-16 pt-24 md:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2">
            <div>{s.content(cart)}</div>
            <img src={img(`melon/${i + 1}.webp`)} alt={i === 2 ? 'אבטיח מגולף בצורת ורד, עבודת יד' : ''} className="mx-auto w-[min(80vw,28rem)]" />
          </div>
        </section>
      ))}
    </div>
  );
}

/* ───────── The shop ───────── */

function Shop({ cart }: { cart: CartApi }) {
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const list = products.filter(p => filter === 'all' || p.category === filter);
  return (
    <section id="shop" className="paper scroll-mt-16 bg-cream px-5 py-20 text-ink md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="text-section text-ink">בוחרים מגש. <span className="text-gold-deep">רואים מחיר.</span></h2>
            <p className="mt-4 max-w-xl text-ink-soft">כל מגש עם התמונה, הגודל, כמה אנשים הוא מספיק והמחיר שלו. מוסיפים להזמנה, ושלומי מאשר לפני ההכנה.</p>
          </div>
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0" role="tablist" aria-label="סינון מגשים">
            {categories.map(c => (
              <button
                key={c.id}
                role="tab"
                aria-selected={filter === c.id}
                onClick={() => setFilter(c.id)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-note font-medium transition-colors ${
                  filter === c.id ? 'border-ink bg-ink text-cream' : 'border-ink/20 text-ink hover:border-ink/50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map(p => {
              const q = cart.qty(p.id);
              return (
                <motion.article
                  layout
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-5% 0px' }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-[#fffdf7] shadow-[0_1px_0_rgb(17_48_31/0.06),0_18px_40px_-28px_rgb(17_48_31/0.4)]"
                >
                  <div className="relative aspect-square overflow-hidden bg-sand">
                    <img src={img(`catalog/${p.id}.webp`)} alt={`מגש פירות ${p.name}, ${p.size}`} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    {q > 0 && <span className="absolute right-3 top-3 rounded-full bg-ink px-2.5 py-1 text-note font-medium text-cream">בהזמנה: {q}</span>}
                  </div>
                  {/* thin rind edge between photo and details */}
                  <div aria-hidden className="h-1.5 bg-[linear-gradient(#0d3a22_0_45%,#a6d27a_45%_70%,#f2f5df_70%)]" />
                  <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                    <h3 className="text-sub text-ink">{p.name}</h3>
                    <p className="text-note text-ink-soft">{p.size}</p>
                    <p className="text-note text-ink-soft"><bdi dir="ltr">{p.serves.replace('-', '–')}</bdi> סועדים</p>
                    <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-4">
                      <span className="font-display text-sub text-gold-deep">
                        {p.from && <small className="ml-1 font-sans text-note text-ink-soft">החל מ-</small>}
                        {money(p.price)}
                      </span>
                      <button
                        onClick={() => cart.add(p.id)}
                        aria-label={`הוספת ${p.name} ${p.size} להזמנה`}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gold px-3.5 py-2 text-note font-medium text-night transition-colors hover:bg-[#ff7a86]"
                      >
                        להוסיף <Icon name="plus" className="size-4" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
        <p className="mt-5 text-note text-ink-soft">התמונות בקטלוג להמחשת הצורה והגודל. הפירות משתנים לפי העונה, והעיצוב תמיד ייחודי.</p>
      </div>
    </section>
  );
}

function Events() {
  return (
    <section id="events" className="rind scroll-mt-16 bg-night px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 className="text-section text-cream">אירוע גדול? <span className="text-gold">שולחן שלם.</span></h2>
          <p className="mt-5 max-w-lg text-cream/85">
            בר מצווה, חתונה, ברית או כנס. שלומי בונה שולחן פירות במקום, עם גילופים במרכז, ומארזים לעסקים ולחגים עם משלוח לכמה כתובות.
          </p>
          <a
            href={waLink('היי שלומי, יש לי אירוע ואשמח להצעת מחיר')}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gold px-6 py-3.5 font-medium text-night transition-colors hover:bg-[#ff7a86]"
          >
            <Icon name="whatsapp" className="size-5" /> לקבל הצעת מחיר
          </a>
        </div>
        <img src={img('real-platter.webp')} alt="מגש בר מצווה עם אבטיח מגולף בצורת ספר תורה" loading="lazy" className="w-full rounded-[2rem] object-cover shadow-2xl" />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#082414] px-5 py-10 text-note text-cream/60 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <img src={img('logo-gold.webp')} alt="האמנות שבפרי" className="h-10 w-auto" />
        <p>האמנות שבפרי · שלומי ברגר · ירושלים, גבעת זאב ומודיעין</p>
      </div>
    </footer>
  );
}
