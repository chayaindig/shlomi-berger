import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import { business, categories, eventServices, extras, faq, img, money, products, testimonials, waLink, works, type Category } from './data';
import { HeroFruits } from './HeroFruits';
import { LuminousType } from './components/LuminousType';
import { Button, Icon, Reveal, ScrollWords, Stroke } from './ui';

type CartApi = { qty: (id: string) => number; add: (id: string) => void; openCart: () => void };

/* ───────────── Hero ───────────── */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const ring = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);

  return (
    <section ref={ref} id="top" data-bg="#4a0b2c" data-trail="pomegranate" className="pom-skin relative overflow-x-clip pt-24 md:pt-28">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 pb-12 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-24">
        <div className="relative z-10">
          <Reveal>
            <p className="mb-5 text-note font-medium tracking-wide text-gold">שלומי ברגר · מגשי פירות מעוצבים בעבודת יד</p>
            <h1 className="sr-only">האמנות שבפרי</h1>
            <img src={img('logo-gold.webp')} alt="" width={785} height={378} className="w-[min(78vw,30rem)] drop-shadow-[0_8px_30px_rgb(214_178_110/0.18)]" />
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl font-display text-sub text-cream md:mt-8">
              מגש פירות שנראה כמו יצירה, ונבנה מאפס בשבילכם. <span className="text-gold">גילופים, צבעים ושילובים שלא תמצאו אצל אף אחד אחר.</span>
            </p>
            <p className="mt-4 max-w-lg text-mist">
              רואים כל מגש עם המחיר שלו, בוחרים, ומזמינים בכמה קליקים. משלוחים לירושלים, גבעת זאב ומודיעין.
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-7 flex flex-wrap items-center gap-3">
            <Button href="#catalog">לבחירת מגש</Button>
            <Button href="#events" variant="ghost">אירוע? הצעת מחיר</Button>
          </Reveal>
          <Reveal delay={0.35}>
            <p className="mt-6 flex items-center gap-2 text-note text-mist">
              <span className="font-display text-sub text-gold">החל מ-{money(business.fromPrice)}</span>
              <span className="h-4 w-px bg-mist/40" />
              <span>הזמנה עד יום לפני</span>
            </p>
          </Reveal>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
          <motion.div style={{ rotate: ring }} className="absolute inset-[3%] rounded-full border border-gold/30" />
          <motion.div style={{ rotate: ring }} className="absolute inset-[3%] rounded-full">
            <span className="absolute -top-1.5 left-1/2 size-3 rounded-full bg-gold" />
          </motion.div>
          <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgb(214_60_130/0.28),transparent_68%)]" />
          <HeroFruits />
          <div className="absolute -top-2 right-0 z-10 rounded-2xl border border-gold/25 bg-night/85 px-4 py-3 text-note shadow-xl md:right-[-2%]">
            <span className="block font-display text-sub text-gold">אין שני מגשים זהים</span>
            <span className="text-mist">לחצו על פרי והוא יעבור למרכז</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Floating fruit (Buck's-style depth, moves with the page scroll) ───────────── */
export function Float({ src, className, speed = -80, turn = 12 }: { src: string; className: string; speed?: number; turn?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLImageElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -speed / 2, reduce ? 0 : speed / 2]);
  const rotate = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -turn, reduce ? 0 : turn]);
  return (
    <motion.img
      ref={ref}
      src={img(src)}
      alt=""
      aria-hidden
      loading="lazy"
      style={{ y, rotate }}
      className={`pointer-events-none absolute select-none drop-shadow-[0_18px_22px_rgb(20_0_10/0.45)] ${className}`}
    />
  );
}

/* ───────────── From fruit to art: Palmo-style scroll story ───────────── */
const beats = [
  { title: 'הכול מתחיל בפרי.', text: 'כל בוקר שלומי בוחר את הפירות הכי יפים של העונה. רק מה שנראה מושלם עולה למגש.' },
  { title: 'ואז הוא נפתח.', text: 'חותך, מגלף ומסדר לפי צבעים. כל פרי מקבל תפקיד, וכל גרגר יושב במקום שלו.' },
  { title: 'ונהיה יצירה.', text: 'מגש שאין לו תאום, שנבנה בשבילכם ביום המשלוח.' },
];
const badges = [
  { label: 'בעבודת יד', sub: 'כל חיתוך', pos: 'right-[2%] top-[14%]', tone: 'gold' },
  { label: 'טרי מהיום', sub: 'נחתך ביום המשלוח', pos: 'left-[0%] top-[40%]', tone: 'wine' },
  { label: '100% פרי', sub: 'בלי קיצורי דרך', pos: 'right-[10%] bottom-[8%]', tone: 'gold' },
];

export function FruitStory() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [beat, setBeat] = useState(0);
  const [pct, setPct] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', v => {
    setBeat(v < 0.3 ? 0 : v < 0.66 ? 1 : 2);
    setPct(Math.round(Math.min(1, Math.max(0, v / 0.92)) * 100));
  });

  // Function transforms on purpose: motion can't hand these to the browser's scroll timeline,
  // which mapped this sticky section's range wrongly and left the wrong image showing.
  const ramp = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));
  const wholeOpacity = useTransform(scrollYProgress, v => 1 - ramp(v, 0.22, 0.34));
  const wholeRotate = useTransform(scrollYProgress, v => (reduce ? 0 : -25 + 60 * ramp(v, 0, 0.34)));
  const wholeScale = useTransform(scrollYProgress, v => 0.85 + 0.2 * ramp(v, 0, 0.3));
  const openOpacity = useTransform(scrollYProgress, v => ramp(v, 0.26, 0.36) * (1 - ramp(v, 0.6, 0.7)));
  const openScale = useTransform(scrollYProgress, v => 0.9 + 0.18 * ramp(v, 0.26, 0.66));
  const artOpacity = useTransform(scrollYProgress, v => ramp(v, 0.62, 0.74));
  const artScale = useTransform(scrollYProgress, v => 0.86 + 0.14 * ramp(v, 0.62, 1));
  const bar = useTransform(scrollYProgress, [0, 0.92], ['0%', '100%']);

  return (
    <section ref={ref} id="story" data-bg="#3e0925" data-trail="pomegranate" className="pom-skin relative h-[320vh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden px-5 pt-16 md:px-8">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-4 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Text */}
          <div className="order-2 lg:order-1">
            <div className="relative mt-4 min-h-[9.5rem] md:min-h-[12rem]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={beat}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className="text-section text-cream">
                    {beat === 2 ? <>ונהיה <span className="framed">יצירה.</span></> : beats[beat].title}
                  </h2>
                  <p className="mt-3 max-w-md text-mist">{beats[beat].text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Progress, like Palmo's "whole coconut 000 → canned 100" */}
            <div className="mt-4 max-w-md">
              <div className="flex items-baseline justify-between text-note font-medium text-gold">
                <span>פרי שלם</span>
                <span className="font-display text-sub tabular-nums" dir="ltr">{String(pct).padStart(3, '0')}</span>
                <span>יצירה</span>
              </div>
              <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-cream/15">
                <motion.div style={{ width: bar }} className="h-full bg-gold" />
              </div>
            </div>
          </div>

          {/* Stage */}
          <div className="relative order-1 mx-auto aspect-square w-[min(84vw,30rem)] lg:order-2 lg:w-full lg:max-w-[34rem]">
            <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgb(214_60_130/0.3),transparent_68%)]" />
            <motion.img style={{ opacity: wholeOpacity, rotate: wholeRotate, scale: wholeScale }} src={img('fruit/pomegranate.webp')} alt="" aria-hidden
              className="absolute inset-0 m-auto w-[62%] drop-shadow-[0_30px_40px_rgb(20_0_10/0.55)]" />
            <motion.img style={{ opacity: openOpacity, scale: openScale }} src={img('fruit/pomegranate-open.webp')} alt="רימון פתוח עם גרגרים אדומים" 
              className="absolute inset-0 m-auto w-[88%] drop-shadow-[0_30px_40px_rgb(20_0_10/0.55)]" />
            <motion.div style={{ opacity: artOpacity, scale: artScale }} className="absolute inset-[4%] overflow-hidden rounded-full border border-gold/30 [mask-image:radial-gradient(circle,#000_62%,transparent_71%)]">
              <img src={img('pomegranate-platter.webp')} alt="מגש פירות בסגנון של שלומי עם רימונים פתוחים במרכז (הדמיה)" className="size-full object-cover" loading="lazy" />
            </motion.div>

            <AnimatePresence>
              {beat === 1 && badges.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
                  animate={{ opacity: 1, scale: 1, rotate: i % 2 ? 8 : -8 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ delay: i * 0.12, type: 'spring', stiffness: 260, damping: 18 }}
                  className={`absolute grid size-24 place-items-center rounded-full text-center shadow-xl md:size-32 ${b.pos} ${
                    b.tone === 'gold' ? 'bg-gold text-night' : 'border border-gold/50 bg-wine text-cream'
                  }`}
                >
                  <span className="px-2 leading-tight">
                    <span className="block font-display text-[1.15rem] md:text-sub">{b.label}</span>
                    <span className="block text-[0.7rem] opacity-80 md:text-note">{b.sub}</span>
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Ticker ───────────── */
export function Ticker() {
  const items = ['מגשי פירות מעוצבים', 'גילופים באבטיח', 'זרי פירות', 'פרלינים', 'פיצוחים', 'יינות', 'בר פירות לאירועים', 'עוגות פירות'];
  const row = [...items, ...items];
  return (
    <div dir="ltr" className="overflow-hidden border-y border-gold/15 py-4" aria-hidden>
      <div className="ticker flex w-max gap-10" dir="rtl">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-sub font-extralight text-gold/80">
            {t}<span className="size-1.5 rounded-full bg-gold/60" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────────── Statement + real works ───────────── */
export function Works() {
  return (
    <section id="works" data-bg="#3e0925" className="pom-skin px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-5xl text-center">
        <ScrollWords
          className="font-display text-section text-cream"
          text="זה לא עוד מגש פירות. כל מגש נבנה מאפס, בשילובי צבעים וגילופים שלא חוזרים על עצמם."
        />
      </div>
    </section>
  );
}

/* ───────────── Catalog: every price with its picture ───────────── */
export function Catalog({ cart }: { cart: CartApi }) {
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const list = products.filter(p => filter === 'all' || p.category === filter);

  return (
    <section id="catalog" data-bg="#f4ede3" className="paper scroll-mt-20 px-5 py-20 text-ink md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="mt-5 text-section text-ink">
              רואים את המגש. <Stroke>רואים את המחיר.</Stroke>
            </h2>
            <p className="mt-4 max-w-xl text-ink-soft">
              בלי מחירון בצד ובלי לשאול "איזה זה". כל מגש עם התמונה, הגודל, כמה אנשים הוא מספיק והמחיר שלו.
            </p>
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
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-[#fbf8f3] shadow-[0_1px_0_rgb(42_20_36/0.06),0_18px_40px_-28px_rgb(42_20_36/0.35)]"
                >
                  <div className="relative aspect-square overflow-hidden bg-sand">
                    <img
                      src={img(`catalog/${p.id}.webp`)}
                      alt={`מגש פירות ${p.name}, ${p.size}`}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {q > 0 && (
                      <span className="absolute right-3 top-3 rounded-full bg-ink px-2.5 py-1 text-note font-medium text-cream">בהזמנה: {q}</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                    <h3 className="text-sub text-ink">{p.name}</h3>
                    <p className="text-note text-ink-soft">{p.size}</p>
                    <p className="text-note text-ink-soft"><bdi dir="ltr">{p.serves.replace('-', '–')}</bdi> סועדים</p>
                    <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-4">
                      <span className="font-display text-sub text-ink">
                        {p.from && <small className="ml-1 font-sans text-note text-ink-soft">החל מ-</small>}
                        {money(p.price)}
                      </span>
                      <button
                        onClick={() => cart.add(p.id)}
                        aria-label={`הוספת ${p.name} ${p.size} להזמנה`}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-wine px-3.5 py-2 text-note font-medium text-cream transition-colors hover:bg-plum"
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

        <div className="mt-16 rounded-[2rem] border border-ink/10 bg-[#fbf8f3]/70 p-6 md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="text-sub text-ink">תוספות שהופכות מגש למתנה</h3>
              <p className="text-note text-ink-soft">מוסיפים עכשיו, או ממש לפני שליחת ההזמנה.</p>
            </div>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {extras.map(x => (
              <li key={x.id} className="flex items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-cream px-4 py-3">
                <span>
                  <span className="block font-medium text-ink">{x.name}</span>
                  <span className="block text-note text-ink-soft">
                    {x.price === null ? x.note : `${x.from ? 'החל מ-' : ''}${money(x.price)} · ${x.note}`}
                  </span>
                </span>
                <button
                  onClick={() => cart.add(x.id)}
                  aria-label={`הוספת ${x.name}`}
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-ink/20 text-lg text-ink transition-colors hover:border-wine hover:bg-wine hover:text-cream"
                >
                  {cart.qty(x.id) > 0 ? cart.qty(x.id) : <Icon name="plus" className="size-5" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────────── How to order: a WhatsApp chat that builds itself ───────────── */
const steps = [
  { title: 'בוחרים מגש', text: 'רואים תמונה ומחיר, ומוסיפים להזמנה בלחיצה.' },
  { title: 'יום, שעה וברכה', text: 'טופס קצר אחד. בלי לחפור, רק מה שצריך כדי שהמגש יגיע בזמן.' },
  { title: 'משלמים ומקבלים אישור', text: 'ההזמנה מגיעה לשלומי מסודרת, ואתם מקבלים אישור בוואטסאפ.' },
];

function Bubble({ me, children, show }: { me?: boolean; children: React.ReactNode; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`max-w-[82%] rounded-2xl px-3 py-2 text-[0.82rem] leading-snug shadow-sm ${
            me ? 'self-start rounded-tr-sm bg-[#d9fdd3] text-[#111b21]' : 'self-end rounded-tl-sm bg-white text-[#111b21]'
          }`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function HowToOrder() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [stage, setStage] = useState(reduce ? 6 : 0);
  useMotionValueEvent(scrollYProgress, 'change', v => !reduce && setStage(Math.min(6, Math.floor(v * 7.2))));
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const activeStep = stage < 2 ? 0 : stage < 4 ? 1 : 2;

  return (
    <section ref={ref} id="how" data-bg="#33071f" className="pom-skin relative h-[260vh] scroll-mt-0">
      <div className="sticky top-0 flex min-h-svh items-center px-5 pb-6 pt-20 md:px-8 md:py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-20">
          <div>
            <h2 className="mt-3 text-section text-cream lg:mt-5">שלושה צעדים, <span className="gold-text">וזהו.</span></h2>
            <ol className="mt-8 hidden space-y-1 lg:block">
              {steps.map((s, i) => (
                <li key={s.title} className={`border-t border-cream/10 py-5 transition-opacity duration-500 ${activeStep === i ? 'opacity-100' : 'opacity-35'}`}>
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-sub font-extralight text-gold">0{i + 1}</span>
                    <div>
                      <h3 className="text-sub text-cream">{s.title}</h3>
                      <p className="mt-1 text-mist">{s.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            {/* Mobile: only the current step */}
            <div className="mt-4 min-h-[5rem] lg:hidden" aria-live="polite">
              <p className="text-note text-gold">שלב {activeStep + 1} מתוך 3</p>
              <h3 className="text-sub text-cream">{steps[activeStep].title}</h3>
              <p className="text-note text-mist">{steps[activeStep].text}</p>
            </div>
            <div className="mt-4 h-0.5 w-full max-w-md overflow-hidden rounded-full bg-cream/10">
              <motion.div style={{ width: bar }} className="h-full bg-gold" />
            </div>
          </div>

          {/* Phone */}
          <div className="mx-auto w-[min(76vw,19rem)] rounded-[2.6rem] border border-cream/15 bg-[#0d0a0c] p-2.5 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]">
            <div className="overflow-hidden rounded-[2.1rem] bg-[#efe7dd]">
              <div className="flex items-center gap-2.5 bg-[#075e54] px-4 pb-3 pt-6 text-white">
                <img src={img('shlomi.webp')} alt="" className="size-8 rounded-full object-cover object-top" />
                <div className="leading-tight">
                  <p className="text-[0.85rem] font-medium">שלומי · האמנות שבפרי</p>
                  <p className="text-[0.7rem] opacity-80">{stage === 3 ? 'מקליד...' : 'מחובר/ת'}</p>
                </div>
              </div>
              <div className="flex h-[18rem] flex-col justify-end gap-2 overflow-hidden p-3 sm:h-[27rem]">
                <Bubble me show={stage >= 1}>
                  <p className="font-medium">הזמנה חדשה מהאתר</p>
                  <div className="mt-1.5 flex gap-2 rounded-lg bg-white/70 p-1.5">
                    <img src={img('catalog/p4.webp')} alt="" className="size-11 rounded-md object-cover" />
                    <div className="text-[0.75rem] leading-tight">
                      <p className="font-medium">עיגול 35 ס״מ</p>
                      <p>350 ₪ · אבטיח מגולף</p>
                    </div>
                  </div>
                </Bubble>
                <Bubble me show={stage >= 2}>
                  יום חמישי, 12:00<br />רח׳ הנביאים, ירושלים<br />ברכה: "מזל טוב נועה!"
                </Bubble>
                <Bubble me show={stage >= 3}>
                  <span className="flex items-center gap-1 text-[#1f7a3d]"><Icon name="check" className="size-4" />שולם</span>
                </Bubble>
                <Bubble show={stage >= 4}>קיבלתי! 🍓 מתחיל לעבוד על המגש של נועה</Bubble>
                <Bubble show={stage >= 5}>
                  <img src={img('real-bouquet.webp')} alt="" className="mb-1 h-28 w-full rounded-lg object-cover" />
                  יוצא אליכם עכשיו
                </Bubble>
                <Bubble me show={stage >= 6}>וואו!! היא בהלם 😍</Bubble>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Events: quote request ───────────── */
export function Events() {
  const [form, setForm] = useState({ name: '', type: 'בר/בת מצווה', date: '', guests: '', notes: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const message = `היי שלומי, אשמח להצעת מחיר לאירוע 🍉\nשם: ${form.name}\nסוג אירוע: ${form.type}\nתאריך: ${form.date}\nכמות אורחים: ${form.guests}\n${form.notes ? 'הערות: ' + form.notes : ''}`;
  const field = 'w-full rounded-2xl border border-cream/15 bg-night/50 px-4 py-3 text-cream placeholder:text-mist/60 focus:border-gold focus:outline-none';

  return (
    <section id="events" data-bg="#5a1036" data-trail="mix" className="pom-skin relative overflow-x-clip scroll-mt-16 px-5 py-20 md:px-8 md:py-32">
      <Float src="fruit/fig.webp" className="-left-6 top-10 w-28 md:left-[4%] md:w-40" speed={-140} turn={16} />
      <Float src="fruit/seeds.webp" className="right-[42%] top-6 hidden w-24 lg:block" speed={-70} turn={-10} />
      <Float src="fruit/mint.webp" className="-right-4 bottom-16 w-20 md:right-[3%] md:w-28" speed={-110} turn={20} />
      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="mt-5 text-section text-cream">אירוע, עסק או חג? <span className="gold-text">נבנה את זה בפירות.</span></h2>
          <p className="mt-5 max-w-lg text-mist">
            שולחן שלם לאירוע, עמדה שהאורחים לא עוזבים או מארזי חג ללקוחות של העסק. ספרו מה צריך, ושלומי יחזור עם הצעה מסודרת.
          </p>
          <ul className="mt-10">
            {eventServices.map(s => (
              <li key={s.n} className="flex gap-5 border-t border-cream/10 py-5">
                <span className="font-display text-sub font-extralight text-gold">{s.n}</span>
                <div>
                  <h3 className="text-sub text-cream">{s.title}</h3>
                  <p className="mt-1 text-note text-mist">{s.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Reveal className="lg:pt-16">
          <form
            onSubmit={e => { e.preventDefault(); window.open(waLink(message), '_blank'); }}
            className="rounded-[2rem] border border-gold/20 bg-night/40 p-6 md:p-9"
          >
            <h3 className="text-sub text-cream">בקשת הצעת מחיר</h3>
            <p className="mt-1 text-note text-mist">ארבעה פרטים וזה אצל שלומי בוואטסאפ.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-note text-mist">שם</span>
                <input required value={form.name} onChange={set('name')} className={field} placeholder="איך קוראים לך?" />
              </label>
              <label>
                <span className="mb-1.5 block text-note text-mist">סוג האירוע</span>
                <select value={form.type} onChange={set('type')} className={field}>
                  {['בר/בת מצווה', 'חתונה', 'ברית', 'יום הולדת', 'מארזי חג לעסק', 'אירוע חברה', 'אחר'].map(o => <option key={o} className="bg-night">{o}</option>)}
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-note text-mist">תאריך</span>
                <input type="date" value={form.date} onChange={set('date')} className={field} />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-note text-mist">כמה אורחים בערך?</span>
                <input inputMode="numeric" value={form.guests} onChange={set('guests')} className={field} placeholder="למשל 120" />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-note text-mist">משהו שחשוב לדעת (לא חובה)</span>
                <textarea rows={3} value={form.notes} onChange={set('notes')} className={field} placeholder="צבעים של האירוע, גילוף עם שם..." />
              </label>
            </div>
            <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 font-medium text-night transition-colors hover:bg-[#e4c487]">
              <Icon name="whatsapp" /> לשלוח לשלומי בוואטסאפ
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── About ───────────── */
export function About() {
  return (
    <section id="about" data-bg="#f4ede3" className="paper px-5 py-20 text-ink md:px-8 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[0.8fr_1fr] md:gap-20">
        <Reveal className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-3 rotate-[-3deg] rounded-[2rem] border border-gold-deep/30" />
          <img src={img('shlomi.webp')} alt="שלומי ברגר" loading="lazy" className="relative aspect-[4/5] w-full rounded-[2rem] object-cover object-top" />
        </Reveal>
        <div>
          <h2 className="mt-5 text-section text-ink">שלומי ברגר</h2>
          <p className="mt-6 max-w-xl font-display text-sub text-ink">
            בשבילי פרי הוא חומר גלם, כמו צבע לצייר. <Stroke>כל מגש מתחיל מדף ריק.</Stroke>
          </p>
          {/* TODO: הסיפור האמיתי של שלומי, כמה שנים, איך התחיל */}
          <p className="mt-5 max-w-xl text-ink-soft">
            אני לא מכין שני מגשים זהים. אני בוחר את הפירות הכי יפים של היום, מגלף, מסדר לפי צבעים, ובונה מגש שמרגישים שמישהו השקיע בו. לבר מצווה, לשבת, למתנה או סתם כי בא לכם לשמח מישהו.
          </p>
          <Promises />
        </div>
      </div>
    </section>
  );
}

/* Buck's-style stack: one card open at a time */
const promises = [
  { t: 'בעבודת יד', d: 'כל חיתוך, כל גילוף וכל סידור נעשים ביד. בלי מכונות ובלי תבניות.' },
  { t: 'טרי מהיום', d: 'הפירות נחתכים ביום המשלוח, כדי שיגיעו אליכם בשיא שלהם.' },
  { t: 'אין שני מגשים זהים', d: 'הצבעים והשילובים נבנים מחדש כל פעם, לפי מה שהעונה נותנת.' },
  { t: 'עד הבית', d: `משלוח ל${business.areas.join(', ')}, בשעה שבחרתם.` },
];
function Promises() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mt-8 max-w-md">
      {promises.map((p, i) => (
        <div key={p.t} className={`-mt-px overflow-hidden rounded-2xl border border-ink/15 transition-colors duration-300 ${open === i ? 'bg-ink text-cream' : 'bg-[#fbf8f3] text-ink'} ${i ? '-mt-2' : ''}`} style={{ zIndex: open === i ? 10 : promises.length - i, position: 'relative' }}>
          <button
            onClick={() => setOpen(i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between px-5 py-3.5 font-display text-sub"
          >
            <span className={`size-1.5 rounded-full ${open === i ? 'bg-gold' : 'bg-ink/40'}`} />
            {p.t}
            <span className={`size-1.5 rounded-full ${open === i ? 'bg-gold' : 'bg-ink/40'}`} />
          </button>
          <motion.div initial={false} animate={{ height: open === i ? 'auto' : 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <p className="px-6 pb-5 text-center text-note text-mist">{p.d}</p>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/* ───────────── Testimonials (dashed placeholders until real quotes) ───────────── */
export function Testimonials() {
  const slots = testimonials.length ? testimonials : [{ quote: '', who: '' }, { quote: '', who: '' }, { quote: '', who: '' }];
  return (
    <section data-bg="#f4ede3" className="paper px-5 pb-20 text-ink md:px-8 md:pb-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-section text-ink">מה אומרים אחרי</h2>
        <div className="no-scrollbar -mx-5 mt-8 flex snap-x gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:px-0">
          {slots.map((t, i) =>
            t.quote ? (
              <blockquote key={i} className="min-w-[80%] snap-start rounded-3xl bg-[#fbf8f3] p-7 font-sans text-body font-normal md:min-w-0">
                <p>"{t.quote}"</p>
                <footer className="mt-4 text-note text-ink-soft">{t.who}</footer>
              </blockquote>
            ) : (
              <div key={i} className="grid min-h-44 min-w-[80%] snap-start place-items-center rounded-3xl border-2 border-dashed border-ink/20 p-7 text-center text-note text-ink-soft md:min-w-0">
                כאן תיכנס המלצה של לקוח
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

/* ───────────── FAQ ───────────── */
export function Faq() {
  return (
    <section id="faq" data-bg="#ebe1d2" className="scroll-mt-16 px-5 py-20 text-ink md:px-8 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="mt-5 text-section text-ink">שאלות ששואלים</h2>
          <p className="mt-4 max-w-sm text-ink-soft">לא מצאתם? שלומי עונה בוואטסאפ.</p>
          <Button href={waLink('היי שלומי, יש לי שאלה לגבי מגש')} variant="ghost-dark" className="mt-6">
            <Icon name="whatsapp" /> לשאול את שלומי
          </Button>
        </div>
        <div>
          {faq.map(f => (
            <details key={f.q} className="group border-t border-ink/15 py-5 last:border-b">
              <summary className="flex items-center justify-between gap-4 font-medium text-ink">
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

/* ───────────── Final CTA + footer ───────────── */
export function Footer({ cart }: { cart: CartApi }) {
  return (
    <footer data-bg="#2e061b" className="pom-skin relative overflow-hidden px-5 pb-28 pt-24 md:px-8 md:pb-16">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_50%_0%,rgb(125_24_70/0.55),transparent_65%)]" />
      <div className="relative mx-auto max-w-6xl text-center">
        <h2 className="mx-auto max-w-3xl text-section text-cream">מישהו מחכה למגש{' '}
          <LuminousType
            as="span"
            text="שלא ישכח."
            fontSize="1em"
            lineHeight={1.1}
            letterSpacing="normal"
            maxWidth=""
            color="#fff4dc"
            baseColor="#d6b26e"
            tint="#e9cf94"
            baseOpacity={0.38}
            radius={2.6}
            softness={0.7}
            className="whitespace-nowrap align-baseline"
            style={{ fontWeight: 'inherit', whiteSpace: 'nowrap' }}
          />
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="#catalog">לבחירת מגש</Button>
          <Button onClick={cart.openCart} variant="ghost">להזמנה שלי</Button>
        </div>
        <div className="mt-20 flex flex-col items-center gap-6 border-t border-cream/10 pt-10 md:flex-row md:justify-between">
          <img src={img('logo-gold.webp')} alt="האמנות שבפרי" className="w-36" loading="lazy" />
          <p className="text-note text-mist">
            {business.areas.join(' · ')} · <bdi dir="ltr">{business.phoneDisplay}</bdi>
          </p>
          <div className="flex items-center gap-3">
            <a href={business.instagram} aria-label="אינסטגרם" className="grid size-10 place-items-center rounded-full border border-cream/20 text-cream hover:border-gold hover:text-gold"><Icon name="instagram" /></a>
            <a href={waLink('היי שלומי')} target="_blank" rel="noreferrer" aria-label="וואטסאפ" className="grid size-10 place-items-center rounded-full border border-cream/20 text-cream hover:border-gold hover:text-gold"><Icon name="whatsapp" /></a>
          </div>
        </div>
        <p className="mt-8 text-note text-mist/60">© {new Date().getFullYear()} האמנות שבפרי · עיצוב ובנייה: חיה אינדיג</p>
      </div>
    </footer>
  );
}
