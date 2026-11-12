import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CartDrawer } from '../App';
import { categories, extras, faq, img, money, products, testimonials, waLink, type Category } from '../data';
import { watchOrphans } from '../noOrphans';
import { Icon } from '../ui';
import film from '../melon/film.json';
import { AppleCarousel } from '../Craft';
const steps = [{ title: 'בוחרים את המגש', text: 'גודל, צורה וכמה אנשים תרצו לשמח. כל המחירים כאן, ליד התמונות.' }, { title: 'מוסיפים משהו אישי', text: 'ברכה, תפוח חרוט או משהו מתוק ליד. בוחרים אזור ותאריך אספקה.' }, { title: 'בודקים את הפרטים', text: 'רואים את המגש, התוספות והמשלוח בסיכום אחד, לפני אישור ההזמנה.' }];

/*
  Version C: the two versions combined, on the watermelon palette.
  The wow of B up front (the carving film, a little shorter), then straight into the trays
  so people can add to the basket fast, then the strongest parts of A: the engraved apple,
  three steps, quotes, events and questions. Price buttons ("החל מ-285 ₪") jump to that tray.

  Based on version B: "the watermelon". One fruit carries the first three screens.
  Scrolling carves it: whole (green rind) → first cut (red flesh) → finished rose (cream).
  The background follows the fruit, and then the shop opens.
*/

type CartApi = { qty: (id: string) => number; add: (id: string) => void; openCart: () => void };

const GREEN = '#0d3a22';
const RED = '#8e1f2d'; // deep flesh, bright red was too loud on a full screen
const STONE = '#c2b8a9'; // average of the concrete table texture

const allItems = [...products.map(p => ({ id: p.id, name: p.name })), ...extras.map(x => ({ id: x.id, name: x.name }))];
const carve = extras.find(x => x.id === 'x-carve')!;
// the cheapest tray, for every "החל מ-" button
const entry = products.reduce((a, b) => (b.price < a.price ? b : a));

/** Jump to a tray in the shop and make it glow, so the price on the button is the tray you land on */
function pickTray(id = entry.id) {
  window.dispatchEvent(new CustomEvent('pick-tray', { detail: id }));
}

function EntryButton({ className = '' }: { className?: string }) {
  return (
    <a
      href={`#tray-${entry.id}`}
      onClick={e => { e.preventDefault(); pickTray(); }}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gold px-6 py-3.5 font-medium text-night transition-colors hover:bg-[#ff7a86] ${className}`}
    >
      מגש מעוצב, החל מ-{money(entry.price)} <Icon name="arrow" className="size-5" />
    </a>
  );
}

export default function ComboApp() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => watchOrphans(), []);
  // on a phone the story's buttons sit where the floating WhatsApp would, so it waits until the story ends
  const [atTop, setAtTop] = useState(true);
  useEffect(() => {
    const on = () => setAtTop(window.scrollY < (document.getElementById('top')?.offsetHeight ?? 0) - window.innerHeight * 0.7);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
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
        <Apple cart={api} />
        <HowTo />
        {testimonials.length > 0 && <Reviews />}
        <Events />
        <Faq />
      </main>
      <Footer />

      <a
        href={waLink('היי שלומי, אשמח לשמוע על מגשי הפירות')}
        target="_blank"
        rel="noreferrer"
        aria-label="וואטסאפ לשלומי"
        className={`${atTop ? 'pointer-events-none translate-y-24 opacity-0 md:pointer-events-auto md:translate-y-0 md:opacity-100' : ''} fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-8px_rgb(0_0_0/0.5)] transition-all duration-500 hover:scale-105`}
      >
        <Icon name="whatsapp" className="size-7" />
      </a>

      <EntryPill hidden={count > 0 || open} />

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
        <h1 className="combo-title text-cream">
          <span className="block whitespace-nowrap">לא חותכים פירות.</span>
          <span className="block whitespace-nowrap text-gold">מגלפים אותם.</span>
        </h1>
        <p className="mt-5 max-w-md text-cream/85">
          מגשי פירות וגילופים בעבודת יד של שלומי ברגר. למתנה אישית, לשולחן החג ולרגע שרוצים לחגוג. בוחרים מגש, מוסיפים ברכה ומשמחים מישהו.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <EntryButton />
          <a href="#shop" className="text-note text-cream/80 underline underline-offset-4">לכל המגשים</a>
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
        <div className="mt-7"><EntryButton /></div>
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
            אבטיח מגולף, {carve.from ? 'החל מ-' : ''}{money(carve.price!)} <Icon name="plus" className="size-4" />
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
  // the page takes its colour from the film's own edge, frame by frame
  const bg = useTransform(p, v => film.colors[filmFrame(Number.isFinite(v) ? v : 0)] ?? GREEN);
  // the concrete texture lands as the film reaches the table
  const table = useTransform(p, [0.7, 0.8], [0, 1]);
  const ops = [
    useTransform(p, [0, 0.27, 0.34], [1, 1, 0]),
    useTransform(p, [0.3, 0.37, 0.6, 0.67], [0, 1, 1, 0]),
    useTransform(p, [0.63, 0.7], [0, 1]),
  ];

  return (
    <section ref={ref} id="top" aria-label="האבטיח של שלומי, משלם למגולף" className="relative" style={{ height: '260vh' }}>
      <motion.div style={{ backgroundColor: bg }} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* section 3: smooth concrete table, the same surface carries on under the shop */}
        <motion.div aria-hidden style={{ opacity: table }} className="concrete absolute inset-0">
          {/* a light veil on the text side so the copy stays easy to read */}
          <div className="absolute inset-0 [mask-image:linear-gradient(black_82%,transparent)] md:[mask-image:linear-gradient(black_55%,transparent_92%)] bg-[linear-gradient(to_top,rgb(240_234_220/0.85)_0%,rgb(240_234_220/0.55)_45%,transparent_65%)] md:bg-[linear-gradient(to_left,rgb(240_234_220/0.8)_0%,rgb(240_234_220/0.45)_42%,transparent_62%)]" />
        </motion.div>

        <div className="combo-hero-grid relative mx-auto grid h-full max-w-7xl px-5 pt-16 md:px-8 md:pt-20">
          {/* Text, right side on desktop, bottom on mobile */}
          <div className="combo-copy relative order-2 md:order-1">
            {stages.map((s, i) => (
              <Panel key={i} o={ops[i]} active={stage === i}>{s.content(cart)}</Panel>
            ))}
          </div>

          {/* The fruit */}
          <div className="combo-fruit relative order-1 grid place-items-center md:order-2">
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
            <div className="combo-fruit-frame relative aspect-square">
              <MelonFilm p={p} alt={stage === 2 ? 'אבטיח מגולף בצורת ורד, עבודת יד' : 'אבטיח שלם של שלומי'} />
            </div>
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

/*
  The carving as one continuous film, like the product reels: whole → sliced → rose.
  The frames are pre-rendered files (no canvas), swapped by scroll. The page colour is
  sampled from each frame's own edge, and the film's edge fades into it, so there is no box.
*/
const filmSrc = (i: number) => img(`melon/film/${String(i).padStart(3, '0')}.webp`);

/** scroll progress → frame: hold whole, carve to sliced, hold, carve to rose, hold */
function filmFrame(v: number) {
  const last = film.count - 1;
  const at = [0, 0.14, 0.42, 0.52, 0.8, 1];
  const fr = [0, 0, film.mid, film.mid, last, last];
  for (let i = 1; i < at.length; i++) {
    if (v <= at[i]) return Math.round(fr[i - 1] + ((fr[i] - fr[i - 1]) * (v - at[i - 1])) / (at[i] - at[i - 1]));
  }
  return last;
}

function MelonFilm({ p, alt }: { p: MotionValue<number>; alt: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const ready = useRef<boolean[]>([true]);

  useEffect(() => {
    let stop = false;
    const load = async () => {
      // a few at a time, in order, so the first cut is ready first
      for (let i = 1; i < film.count && !stop; i += 6) {
        await Promise.all(Array.from({ length: Math.min(6, film.count - i) }, async (_, k) => {
          const im = new Image();
          await new Promise<void>(done => {
            im.onload = () => { ready.current[i + k] = true; done(); };
            im.onerror = () => done(); // keep the nearest frame
            im.src = filmSrc(i + k);
          });
        }));
      }
    };
    // start once the first screen has settled
    const t = setTimeout(load, 300);
    return () => { stop = true; clearTimeout(t); };
  }, []);

  useMotionValueEvent(p, 'change', v => {
    const el = ref.current;
    if (!el || !Number.isFinite(v)) return;
    let i = filmFrame(v);
    while (i > 0 && !ready.current[i]) i--;
    const src = filmSrc(i);
    if (!el.src.endsWith(src)) el.src = src;
  });

  return (
    <img
      ref={ref}
      src={filmSrc(0)}
      alt={alt}
      className="absolute inset-0 size-full object-cover [mask-image:radial-gradient(closest-side,#000_80%,transparent)]"
    />
  );
}

/* Reduced motion: the same three moments, simply one under the other */
function StaticStory({ cart }: { cart: CartApi }) {
  const bgs = [GREEN, RED, STONE];
  return (
    <div id="top">
      {stages.map((s, i) => (
        <section key={i} style={{ backgroundColor: bgs[i] }} className={`${i === 2 ? 'concrete ' : ''}px-5 pb-16 pt-24 md:px-8`}>
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
  const [picked, setPicked] = useState('');
  const list = products.filter(p => filter === 'all' || p.category === filter);
  useEffect(() => {
    let t = 0;
    const on = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setFilter('all');
      // let the "all" filter render first, then glide to the tray
      window.setTimeout(() => {
        document.getElementById(`tray-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setPicked(id);
        clearTimeout(t);
        t = window.setTimeout(() => setPicked(''), 2600);
      }, 60);
    };
    window.addEventListener('pick-tray', on);
    return () => { window.removeEventListener('pick-tray', on); clearTimeout(t); };
  }, []);
  return (
    <section id="shop" className="concrete scroll-mt-16 px-5 py-20 text-ink md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="text-section text-ink">בוחרים מגש. <span className="text-gold-deep">רואים מחיר.</span></h2>
            <p className="mt-4 max-w-xl text-ink-soft">מתנה קטנה או שולחן מלא? בחרו לפי מספר הסועדים, הגודל והתקציב. את הברכה והתוספות נוסיף בשלב הבא. המחירים לא כוללים משלוח.</p>
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
                  id={`tray-${p.id}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-5% 0px' }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={`group flex scroll-mt-24 flex-col overflow-hidden rounded-3xl bg-[#fffdf7] shadow-[0_1px_0_rgb(17_48_31/0.06),0_18px_40px_-28px_rgb(17_48_31/0.4)] transition-shadow duration-500 ${picked === p.id ? 'ring-4 ring-gold ring-offset-4 ring-offset-[#c2b8a9]' : ''}`}
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

/* ───────── What people say: a swipeable carousel, still on the concrete table ───────── */

function Reviews() {
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  // real quotes from data.ts; until they arrive, dashed placeholders hold their place
  const slots = testimonials.length ? testimonials : Array.from({ length: 5 }, () => ({ quote: '', who: '' }));

  const cards = () => Array.from(track.current?.children ?? []) as HTMLElement[];
  const go = (dir: 1 | -1) => {
    const el = track.current, list = cards();
    if (!el || !list.length) return;
    const next = Math.min(list.length - 1, Math.max(0, at + dir));
    // RTL: scrollLeft runs negative, so scroll by the card's own offset
    el.scrollTo({ left: list[next].offsetLeft - list[0].offsetLeft, behavior: 'smooth' });
  };
  const onScroll = () => {
    const el = track.current, list = cards();
    if (!el || !list.length) return;
    const step = list[1] ? Math.abs(list[1].offsetLeft - list[0].offsetLeft) : 1;
    setAt(Math.min(list.length - 1, Math.round(Math.abs(el.scrollLeft) / step)));
  };

  return (
    <section aria-label="המלצות" className="concrete overflow-x-clip px-5 pb-20 md:px-8 md:pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-section text-ink">
            <span className="block whitespace-nowrap">מה אומרים</span>
            <span className="block whitespace-nowrap text-gold-deep">אחרי שהמגש נגמר.</span>
          </h2>
          <div className="hidden gap-2 md:flex">
            <button onClick={() => go(-1)} disabled={at === 0} aria-label="ההמלצה הקודמת" className="grid size-12 place-items-center rounded-full border border-ink/30 bg-cream/60 text-ink transition-colors hover:border-ink disabled:opacity-30">
              <Icon name="arrow" className="size-5 rotate-180" />
            </button>
            <button onClick={() => go(1)} disabled={at >= slots.length - 1} aria-label="ההמלצה הבאה" className="grid size-12 place-items-center rounded-full border border-ink/30 bg-cream/60 text-ink transition-colors hover:border-ink disabled:opacity-30">
              <Icon name="arrow" className="size-5" />
            </button>
          </div>
        </div>

        <div
          ref={track}
          onScroll={onScroll}
          className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 md:mx-0 md:gap-5 md:px-0"
        >
          {slots.map((t, i) =>
            t.quote ? (
              <blockquote key={i} className="flex min-h-60 w-[82%] shrink-0 snap-start flex-col justify-between rounded-[2rem] bg-cream p-7 shadow-[0_18px_40px_-24px_rgb(17_48_31/0.45)] sm:w-[60%] md:w-[calc((100%-2.5rem)/3)] md:p-8">
                <Pips />
                <p className="mt-4 text-ink">{t.quote}</p>
                <footer className="mt-6 text-note text-ink-soft">{t.who}</footer>
              </blockquote>
            ) : (
              <div key={i} className="flex min-h-60 w-[82%] shrink-0 snap-start flex-col justify-between rounded-[2rem] border-2 border-dashed border-ink/25 bg-cream/40 p-7 sm:w-[60%] md:w-[calc((100%-2.5rem)/3)] md:p-8">
                <Pips faint />
                <p className="text-note text-ink-soft">כאן תיכנס המלצה של לקוח, במילים שלו.</p>
              </div>
            ),
          )}
        </div>

        {/* where you are: one seed per card */}
        <div className="mt-6 flex justify-center gap-2" aria-hidden>
          {slots.map((_, i) => (
            <span key={i} className={`block h-3 w-2 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-ink transition-all duration-300 ${i === at ? 'scale-125' : 'opacity-25'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Two watermelon seeds standing in for quotation marks */
function Pips({ faint = false }: { faint?: boolean }) {
  return (
    <span aria-hidden className={`flex gap-1.5 ${faint ? 'opacity-30' : ''}`}>
      <span className="block h-5 w-3.5 rotate-[-14deg] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[#1b120f]" />
      <span className="block h-5 w-3.5 rotate-[-14deg] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[#1b120f]" />
    </span>
  );
}

/** Floating "from 285" pill once the story is behind you, so the cheapest tray is one tap away */
function EntryPill({ hidden }: { hidden: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => {
      const foot = document.querySelector('footer')?.getBoundingClientRect().top ?? Infinity;
      setShow(window.scrollY > window.innerHeight * 1.8 && foot > window.innerHeight);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <AnimatePresence>
      {show && !hidden && (
        <motion.a
          href={`#tray-${entry.id}`}
          onClick={e => { e.preventDefault(); pickTray(); }}
          initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }}
          className="fixed bottom-5 left-5 right-24 z-40 flex items-center justify-between gap-3 rounded-full bg-gold px-5 py-3.5 font-medium text-night shadow-xl md:left-auto md:right-24 md:w-80"
        >
          <span>מגש מעוצב, החל מ-{money(entry.price)}</span>
          <Icon name="arrow" className="size-5" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}

/* ───────── From A: the engraved apple, Shlomi's signature, right after the trays ───────── */

function Apple({ cart }: { cart: CartApi }) {
  return (
    <section id="apple" className="concrete overflow-x-clip px-5 pb-24 pt-4 text-ink md:px-8 md:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 overflow-hidden rounded-[2.5rem] bg-cream/70 px-5 pb-12 pt-10 md:grid-cols-2 md:gap-16 md:px-12 md:py-14">
        <AppleCarousel />
        <div>
          <h2 className="text-section text-ink">
            <span className="block whitespace-nowrap">ברכה חרוטה</span>
            <span className="block whitespace-nowrap text-gold-deep">על תפוח.</span>
          </h2>
          <p className="mt-5 max-w-lg text-ink-soft">
            הסימן של שלומי: תפוח אדום, והברכה שלכם נחרטת בקליפה ביד. אוהבת אותך, מזל טוב, שם של תינוקת חדשה או ברכה שלמה לאחות. נגיעה קטנה שהופכת מגש למתנה שזוכרים.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button onClick={() => cart.add('x-apple')} className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gold px-6 py-3.5 font-medium text-night transition-colors hover:bg-[#ff7a86]">
              להוסיף תפוח חרוט <Icon name="plus" className="size-4" />
            </button>
            <span className="text-note text-ink-soft">החל מ-{money(40)} לתפוח · את הנוסח כותבים בהזמנה</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── From A: three steps, short, on the deep flesh red ───────── */

function HowTo() {
  return (
    <section id="how" style={{ backgroundColor: RED }} className="relative overflow-hidden px-5 py-20 md:px-8 md:py-28">
      <div aria-hidden className="flesh absolute inset-0" />
      <div aria-hidden className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-6xl">
        <h2 className="text-section text-cream">
          <span>מהמגש שבחרתם<br />עד החיוך שלהם.</span>
        </h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          {steps.map((st, i) => (
            <li key={st.title} className="rounded-[2rem] border border-cream/15 bg-black/15 p-7">
              {/* one seed per step instead of numbers */}
              <span aria-hidden className="flex gap-1.5">
                {Array.from({ length: i + 1 }, (_, k) => (
                  <span key={k} className="block h-4 w-3 rotate-[-14deg] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[#1b120f]" />
                ))}
              </span>
              <h3 className="mt-5 text-sub text-cream">{st.title}</h3>
              <p className="mt-2 text-cream/80">{st.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <EntryButton />
          <a href={waLink('היי שלומי, יש לי שאלה לגבי מגש')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-note text-cream/85 underline underline-offset-4">
            <Icon name="whatsapp" className="size-5" /> או לשאול את שלומי
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────── From A: questions people ask ───────── */

function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 bg-sand px-5 py-20 text-ink md:px-8 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-section text-ink">שאלות ששואלים</h2>
          <p className="mt-4 max-w-sm text-ink-soft">לא מצאתם? שלומי עונה בוואטסאפ.</p>
          <div className="mt-7 flex flex-col items-start gap-3">
            <EntryButton />
            <a href={waLink('היי שלומי, יש לי שאלה לגבי מגש')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-note text-ink underline underline-offset-4">
              <Icon name="whatsapp" className="size-5" /> לשאול את שלומי
            </a>
          </div>
        </div>
        <div>
          {faq.map(f => (
            <details key={f.q} className="group border-t border-ink/15 py-5 last:border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                {f.q}
                <span aria-hidden className="text-gold-deep transition-transform duration-300 group-open:rotate-45"><Icon name="plus" className="size-6" /></span>
              </summary>
              <p className="mt-3 max-w-xl text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
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
