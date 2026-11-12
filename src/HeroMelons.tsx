import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { business, img, money } from './data';
import { melonPool } from './HeroFruits';
import { Button, Icon, Reveal } from './ui';

// Three hero options for version D, all on the pomegranate grain. Picked with ?hero=1|2|3.
// 1. Giant word: one big melon crosses a huge gold word (GAZU / Palmo-style type + object).
// 2. Shelf: the melons stand on a lit shelf, swipe or tap to bring one to the front (coverflow, like juice and fruit shops).
// 3. Spotlight: a numbered list of works next to one melon under a gallery light (Venice-style list).

const pool = melonPool;

function useCycle(length: number, ms = 4200, paused = false) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const touched = useRef(0);
  useEffect(() => {
    if (reduce || paused) return;
    const t = setInterval(() => { if (Date.now() - touched.current > 9000) setI(n => (n + 1) % length); }, ms);
    return () => clearInterval(t);
  }, [reduce, length, ms, paused]);
  const pick = (n: number) => { touched.current = Date.now(); setI((n + length) % length); };
  return [i, pick] as const;
}

function Shell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section id="top" data-bg="#4a0b2c" data-trail="pomegranate" className={`pom-skin relative overflow-x-clip pt-24 md:pt-28 ${className}`}>
      {children}
    </section>
  );
}

function Copy({ center = false }: { center?: boolean }) {
  return (
    <>
      <h1 className="sr-only">האמנות שבפרי, אבטיחים מגולפים ומגשי פירות של שלומי ברגר</h1>
      <p className={`max-w-xl font-display text-sub text-cream ${center ? 'mx-auto' : ''}`}>
        אבטיח שמגלפים בשבילכם, עם ורדים, שמות וברכה. <span className="text-gold">כל אחד נחתך ביד, ואין שניים זהים.</span>
      </p>
      <div className={`mt-6 flex flex-wrap items-center gap-3 ${center ? 'justify-center' : ''}`}>
        <Button href="#catalog">לבחירת מגש</Button>
        <Button href="#wall" variant="ghost">לראות עבודות</Button>
      </div>
      <p className={`mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-note text-mist ${center ? 'justify-center' : ''}`}>
        <span className="whitespace-nowrap font-display text-sub text-gold">מגשים החל מ-{money(business.fromPrice)}</span>
        <span className="whitespace-nowrap">אבטיח מגולף החל מ-420&nbsp;₪</span>
      </p>
    </>
  );
}

/* ───────────── 1. Giant word ───────────── */
function HeroWord() {
  const [i, pick] = useCycle(pool.length);
  const reduce = useReducedMotion();
  return (
    <Shell className="pb-14 md:pb-20">
      <div className="relative mx-auto max-w-7xl px-5 text-center md:px-8">
        <img src={img('logo-gold.webp')} alt="" width={785} height={378} className="mx-auto w-[min(52vw,15rem)]" />
        {/* The word sits behind, the melon crosses it */}
        <div className="relative mx-auto mt-2 h-[min(68vw,27rem)]">
          <p aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-display leading-none text-gold/85 text-[clamp(5.5rem,31vw,25rem)]">
            מגלפים
          </p>
          <div className="absolute inset-0 m-auto aspect-square h-[80%] md:h-full">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={pool[i].id}
                src={img(pool[i].src)}
                alt={pool[i].name}
                initial={reduce ? false : { opacity: 0, scale: 0.7, rotate: -14, y: 40 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, rotate: 10, y: -20 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 m-auto max-h-full max-w-full object-contain drop-shadow-[0_34px_40px_rgb(20_0_10/0.7)]"
              />
            </AnimatePresence>
          </div>
        </div>
        <p aria-live="polite" className="mt-3 font-display text-sub text-mist">{pool[i].name}</p>
        <div className="mt-4 flex justify-center gap-2.5" role="group" aria-label="בחירת אבטיח">
          {pool.map((m, n) => (
            <button key={m.id} type="button" onClick={() => pick(n)} aria-label={m.name} aria-pressed={n === i}
              className={`grid size-12 place-items-center rounded-full border transition-colors md:size-14 ${n === i ? 'border-gold bg-night/60' : 'border-cream/15 hover:border-gold/60'}`}>
              <img src={img(m.src)} alt="" className="max-h-[80%] max-w-[80%] object-contain" />
            </button>
          ))}
        </div>
        <div className="mt-8"><Copy center /></div>
      </div>
    </Shell>
  );
}

/* ───────────── 2. Shelf (coverflow) ───────────── */
function HeroShelf() {
  const [i, pick] = useCycle(pool.length, 3800);
  const reduce = useReducedMotion();
  const [w, setW] = useState(1200);
  useEffect(() => { const on = () => setW(window.innerWidth); on(); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on); }, []);
  const step = Math.min(w * 0.3, 300);
  const len = pool.length;
  return (
    <Shell className="pb-10 md:pb-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <img src={img('logo-gold.webp')} alt="" width={785} height={378} className="w-[min(60vw,20rem)]" />
            <p className="mt-5 whitespace-nowrap font-display leading-[0.9] text-cream text-[clamp(2.6rem,9vw,6.5rem)]">
              לא חותכים. <span className="gold-text">מגלפים.</span>
            </p>
          </div>
          <div className="lg:max-w-md"><Copy /></div>
        </div>
      </div>

      {/* The shelf */}
      <div className="relative mt-4 h-[min(92vw,30rem)] lg:mt-10">
        <div className="absolute inset-x-0 bottom-[14%] h-px bg-gradient-to-l from-transparent via-gold/70 to-transparent" />
        <div className="absolute inset-x-[10%] bottom-[2%] h-[16%] rounded-[50%] bg-[radial-gradient(ellipse,rgb(214_178_110/0.18),transparent_70%)]" />
        <motion.div
          className="absolute inset-0 touch-pan-y"
          drag={reduce ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 40) pick(i + (info.offset.x > 0 ? 1 : -1)); }}
        >
          {pool.map((m, n) => {
            let d = n - i; if (d > len / 2) d -= len; if (d < -len / 2) d += len;
            const a = Math.abs(d);
            return (
              <motion.button
                key={m.id}
                type="button"
                onClick={() => pick(n)}
                aria-label={d === 0 ? m.name : `${m.name} קדימה`}
                tabIndex={a <= 1 ? 0 : -1}
                animate={{ x: -d * step, scale: d === 0 ? 1 : a === 1 ? 0.56 : 0.38, opacity: a > 2 ? 0 : d === 0 ? 1 : a === 1 ? 0.75 : 0.35 }}
                transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ zIndex: 10 - a, transformOrigin: '50% 86%' }}
                className="absolute bottom-[14%] left-1/2 -ml-[min(36vw,14rem)] flex h-[90%] w-[min(72vw,28rem)] items-end justify-center"
              >
                <img src={img(m.src)} alt="" draggable={false} className="max-h-full max-w-full object-contain drop-shadow-[0_30px_30px_rgb(20_0_10/0.6)]" />
              </motion.button>
            );
          })}
        </motion.div>
      </div>
      <div className="mx-auto flex max-w-md items-center justify-between px-5">
        <button type="button" onClick={() => pick(i - 1)} aria-label="האבטיח הקודם" className="grid size-11 place-items-center rounded-full border border-cream/25 text-cream hover:border-gold hover:text-gold">
          <Icon name="arrow" className="size-5 rotate-180" />
        </button>
        <p aria-live="polite" className="text-center font-display text-sub text-gold">{pool[i].name}</p>
        <button type="button" onClick={() => pick(i + 1)} aria-label="האבטיח הבא" className="grid size-11 place-items-center rounded-full border border-cream/25 text-cream hover:border-gold hover:text-gold">
          <Icon name="arrow" className="size-5" />
        </button>
      </div>
    </Shell>
  );
}

/* ───────────── 3. Spotlight + numbered list ───────────── */
function HeroSpot() {
  const [i, pick] = useCycle(pool.length, 4600);
  const reduce = useReducedMotion();
  return (
    <Shell className="pb-12 md:pb-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 md:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div className="relative z-10">
          <Reveal>
            <img src={img('logo-gold.webp')} alt="" width={785} height={378} className="w-[min(70vw,24rem)]" />
            <div className="mt-6"><Copy /></div>
          </Reveal>
          <ol className="mt-8 hidden border-t border-cream/15 lg:block" aria-label="אבטיחים שגילף שלומי">
            {pool.map((m, n) => (
              <li key={m.id} className="border-b border-cream/15">
                <button type="button" onClick={() => pick(n)} aria-pressed={n === i}
                  className={`relative flex w-full items-baseline gap-4 py-2.5 text-right transition-colors ${n === i ? 'text-gold' : 'text-cream/60 hover:text-cream'}`}>
                  <span className="w-7 font-display text-note tabular-nums" dir="ltr">0{n + 1}</span>
                  <span className="font-display text-sub">{m.name}</span>
                  {n === i && !reduce && (
                    <motion.span key={i} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 4.6, ease: 'linear' }}
                      className="absolute -bottom-px right-0 h-px w-full origin-right bg-gold" />
                  )}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-[34rem]">
          {/* Gallery light from above, and its pool on the floor */}
          <div className="absolute inset-x-[8%] -top-[6%] h-[80%] bg-[radial-gradient(closest-side,rgb(246_226_176/0.22),transparent)]" />
          <div className="absolute inset-x-[14%] bottom-[8%] h-[12%] rounded-[50%] bg-[radial-gradient(ellipse,rgb(10_0_6/0.6),transparent_70%)]" />
          <div className="absolute inset-x-[10%] bottom-[11%] h-[6%] rounded-[50%] bg-[radial-gradient(ellipse,rgb(214_178_110/0.25),transparent_70%)]" />
          <span aria-hidden className="absolute left-0 top-[6%] font-display text-[clamp(4rem,12vw,8rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgb(214_178_110/0.5)]" dir="ltr">0{i + 1}</span>
          <AnimatePresence mode="popLayout">
            <motion.img
              key={pool[i].id}
              src={img(pool[i].src)}
              alt={pool[i].name}
              initial={reduce ? false : { opacity: 0, y: 30, clipPath: 'circle(0% at 50% 60%)' }}
              animate={{ opacity: 1, y: 0, clipPath: 'circle(75% at 50% 50%)' }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-[6%] bottom-[12%] top-[14%] m-auto max-h-[74%] max-w-[88%] object-contain drop-shadow-[0_30px_34px_rgb(10_0_6/0.55)]"
            />
          </AnimatePresence>
          <p aria-live="polite" className="absolute inset-x-0 bottom-0 text-center font-display text-sub text-gold">{pool[i].name}</p>
          {/* Phone: dots instead of the list */}
          <div className="absolute inset-x-0 -bottom-9 flex justify-center gap-2 lg:hidden">
            {pool.map((m, n) => (
              <button key={m.id} type="button" onClick={() => pick(n)} aria-label={m.name} aria-pressed={n === i} className="grid size-6 place-items-center">
                <span className={`block h-1.5 rounded-full transition-all ${n === i ? 'w-6 bg-gold' : 'w-1.5 bg-cream/40'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ───────────── 4. Scroll story (chosen 12.11, reworked same day) ───────────── */
// Pinterest ref from Chaya: the nut-milk slider (the line changes per product, pieces fly around).
// The lines tell the story in order: the name, the craft, and the promise. Set in Lia Shalehet, gold foil.
// The hotspot dots were tried and taken out (Chaya, 12.11).
// Text on the right, melon on the left with a little overlap. Scrolling down slides the next melon in
// from the right: 3 melons on a phone, 4 on desktop. The section is pinned while they change.
type Story = { id: string; tint: string; size: [number, number]; pieces: string[] };
const story: Story[] = [
  { id: 'rose', tint: '#861a4c', size: [509, 431], pieces: ['fruit/straw.webp', 'fruit/mint.webp', 'fruit/seeds.webp', 'hero/grapes.webp'] },
  { id: 'heart', tint: '#7d1446', size: [710, 694], pieces: ['hero/strawberries.webp', 'fruit/mint.webp', 'fruit/seeds.webp', 'hero/grapes.webp'] },
  { id: 'roses', tint: '#6b0f3b', size: [551, 437], pieces: ['hero/grapes.webp', 'fruit/straw.webp', 'fruit/seeds.webp', 'fruit/mint.webp'] },
  { id: 'birthday', tint: '#731243', size: [372, 324], pieces: ['hero/strawberries.webp', 'fruit/seeds.webp', 'fruit/mint.webp', 'fruit/pomegranate-open.webp'] },
];
// First melon: flowers only, no names on it (Chaya, 12.11)
const PHONE = ['rose', 'heart', 'birthday'];
// Scroll lines: the site name first, then sub-headlines. A phone shows 3, desktop 4 (the third is desktop only).
const LINES = [
  { text: 'האמנות שבפרי', title: true, phone: true },
  { text: 'מגשי פירות עם חתימה של אמן', phone: true },
  { text: 'אבטיח מגולף עם השם והברכה שלכם', phone: false },
  { text: 'אתם בוחרים את מי לשמח, אנחנו מעצבים ושולחים עד אליהם', phone: true },
];
// Where the pieces drift: one big and near (soft focus on desktop), the rest small and far
const SLOTS = [
  { cls: 'left-[-4%] bottom-[-2%] w-[24%] md:w-[20%] z-20 md:blur-[3px]', from: { x: -60, y: 40 }, bob: '7s' },
  { cls: 'right-[4%] top-[16%] w-[14%] md:top-[-2%] md:w-[11%] opacity-90', from: { x: 40, y: -40 }, bob: '5.5s' },
  { cls: 'right-[-2%] bottom-[8%] w-[17%] md:w-[13%] z-20', from: { x: 60, y: 30 }, bob: '6.5s' },
  { cls: 'left-[6%] top-[14%] w-[12%] md:top-[4%] md:w-[9%] opacity-80 md:blur-[1.5px]', from: { x: -40, y: -30 }, bob: '8s' },
];

function useWide() {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

// Word by word, the last two glued so no word is left alone on a line
function Headline({ text, id, title = false }: { text: string; id: string; title?: boolean }) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  const parts = words.length > 2 ? [...words.slice(0, -2), words.slice(-2).join('\u00a0')] : [words.join('\u00a0')];
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span key={id} className={`block font-script font-normal ${title ? 'whitespace-nowrap' : '[text-wrap-style:balance]'}`}>
        {parts.map((w, n) => (
          <motion.span key={n} className="gold-text -my-[0.15em] inline-block py-[0.15em]"
            initial={reduce ? false : { opacity: 0, y: '45%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-35%', transition: { duration: 0.3, delay: n * 0.03 } }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 + n * 0.07 }}>
            {w}{n < parts.length - 1 ? '\u00a0' : ''}
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  );
}

// One melon on the track. Its place follows the scroll: next ones wait on the right, past ones leave to the left.
function TrackMelon({ s, k, p, wide, children }: { s: Story; k: number; p: MotionValue<number>; wide: boolean; children?: ReactNode }) {
  const m = pool.find(x => x.id === s.id)!;
  const x = useTransform(p, v => `${(k - v) * (wide ? 95 : 105)}%`);
  const rotate = useTransform(p, v => (v - k) * 28);
  const scale = useTransform(p, v => 1 - Math.min(Math.abs(k - v), 1) * 0.25);
  const opacity = useTransform(p, v => 1 - Math.min(Math.abs(k - v) * 1.15, 1));
  return (
    <motion.div style={{ x, rotate, scale, opacity, aspectRatio: `${s.size[0]} / ${s.size[1]}` }}
      className="absolute inset-0 m-auto h-[86%] max-w-[92%] md:h-[80%]">
      <img src={img(m.src)} alt={m.name} draggable={false} className="size-full object-contain drop-shadow-[0_34px_40px_rgb(20_0_10/0.7)]" />
      {children}
    </motion.div>
  );
}

function HeroStory() {
  const wide = useWide();
  const reduce = useReducedMotion();
  const list = wide ? story : story.filter(s => PHONE.includes(s.id));
  const n = list.length;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // Each melon holds still for a moment, then the next one slides in
  const p = useTransform(scrollYProgress, v => {
    const raw = Math.min(Math.max(v, 0), 1) * (n - 1);
    const k = Math.min(Math.floor(raw), n - 2);
    const f = Math.min(Math.max((raw - k - 0.22) / 0.56, 0), 1);
    return k + (reduce ? Math.round(f) : f * f * (3 - 2 * f));
  });
  const [i, setI] = useState(0);
  useMotionValueEvent(p, 'change', v => {
    const next = Math.min(Math.round(v), n - 1);
    if (next !== i) setI(next);
  });
  useEffect(() => { setI(i => Math.min(i, n - 1)); }, [n]);
  const s = list[Math.min(i, n - 1)];
  const lines = wide ? LINES : LINES.filter(l => l.phone);
  const line = lines[Math.min(i, lines.length - 1)];
  const ease = [0.22, 1, 0.36, 1] as const;
  // Dots jump to the scroll point where that melon rests
  const goTo = (k: number) => {
    const el = ref.current; if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (el.offsetHeight - window.innerHeight) * (k / (n - 1)), behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section ref={ref} id="top" data-bg="#4a0b2c" data-trail="pomegranate" className="pom-skin relative overflow-x-clip"
      style={{ height: `${100 + (n - 1) * 85}svh` }}>
      <h1 className="sr-only">האמנות שבפרי, אבטיחים מגולפים ומגשי פירות של שלומי ברגר</h1>
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden pb-6 pt-20 md:pb-10 md:pt-24">
        {/* The light behind the melon takes each melon's own shade of pomegranate */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0"
          animate={{ background: `radial-gradient(ellipse ${wide ? '40% 55% at 30%' : '70% 40% at 50%'} 50%, ${s.tint}, transparent 72%)` }}
          transition={{ duration: 1 }} />

        <div className="relative mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-rows-[auto_minmax(0,1fr)_auto] px-5 text-center md:grid-cols-2 md:grid-rows-[1fr_auto_auto_1fr] md:px-8 md:text-right">
          {/* The headline: the site name, then the sub-headlines as you scroll. Fixed height so the melon never jumps */}
          <p aria-hidden className="flex h-[34vw] select-none items-end justify-center leading-[1.2] md:col-start-1 md:row-start-2 md:h-[min(13vw,12rem)] md:justify-start"
            style={{ fontSize: line.title ? (wide ? 'min(5.8vw, 5.6rem)' : '12.6vw') : (wide ? 'min(3.4vw, 3.2rem)' : '7.2vw') }}>
            <Headline text={line.text} id={line.text} title={line.title} />
          </p>
          <ul className="sr-only">{lines.map(l => <li key={l.text}>{l.text}</li>)}</ul>

          {/* The melon track */}
          <div className="relative z-10 -mt-[1svh] min-h-0 md:col-start-2 md:row-span-4 md:row-start-1 md:-mr-[9%] md:mt-0"
>
            <AnimatePresence initial={false}>
              {s.pieces.map((src, j) => (
                <motion.div key={s.id + j} aria-hidden className={`pointer-events-none absolute ${SLOTS[j].cls}`}
                  initial={reduce ? false : { opacity: 0, ...SLOTS[j].from, rotate: -20, scale: 0.7 }}
                  animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, x: SLOTS[j].from.x * 0.6, y: SLOTS[j].from.y * 0.6, scale: 0.8, transition: { duration: 0.4 } }}
                  transition={{ duration: 1, ease, delay: 0.1 + j * 0.08 }}>
                  <img src={img(src)} alt="" className="bob w-full drop-shadow-[0_18px_18px_rgb(20_0_10/0.55)]" style={{ ['--bob' as string]: SLOTS[j].bob }} />
                </motion.div>
              ))}
            </AnimatePresence>
            {list.map((m, k) => (
              <TrackMelon key={m.id} s={m} k={k} p={p} wide={wide} />
            ))}
          </div>

          {/* Copy, buttons and where we are in the scroll */}
          <div className="relative z-20 md:col-start-1 md:row-start-3 md:mt-6 md:max-w-lg">
            <p className="mx-auto max-w-md font-display text-sub text-cream md:mx-0">
              אבטיח שמגלפים בשבילכם, עם ורדים, שמות וברכה. <span className="text-gold">כל אחד נחתך ביד, ואין שניים זהים.</span>
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:mt-6 md:justify-start">
              <Button href="#catalog">לבחירת מגש</Button>
              <Button href="#wall" variant="ghost">לראות עבודות</Button>
            </div>
            <p className="mt-3 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 text-note text-mist md:mt-5 md:justify-start">
              <span className="whitespace-nowrap font-display text-sub text-gold">מגשים החל מ-{money(business.fromPrice)}</span>
              <span className="whitespace-nowrap">אבטיח מגולף החל מ-420&nbsp;₪</span>
            </p>
            <div className="mt-4 flex items-center justify-center gap-3 md:mt-8 md:justify-start">
              <div className="flex gap-1.5" role="group" aria-label="מעבר בין האבטיחים">
                {list.map((m, k) => (
                  <button key={m.id} type="button" onClick={() => goTo(k)} aria-label={pool.find(x => x.id === m.id)!.name} aria-current={k === i}
                    className="grid h-6 place-items-center">
                    <span className={`block h-1 rounded-full transition-all duration-500 ${k === i ? 'w-8 bg-gold' : 'w-3 bg-cream/35'}`} />
                  </button>
                ))}
              </div>
              <p aria-live="polite" className="text-note text-mist">{pool.find(x => x.id === s.id)!.name} · {i < n - 1 ? 'גללו לאבטיח הבא' : 'כל אחד נחתך ביד'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroMelons() {
  const pick = typeof window === 'undefined' ? '1' : new URLSearchParams(window.location.search).get('hero') ?? '4';
  return pick === '3' ? <HeroSpot /> : pick === '2' ? <HeroShelf /> : pick === '1' ? <HeroWord /> : <HeroStory />;
}

// Small floating switch so Chaya and Shlomi can compare the three options
export function HeroSwitch() {
  const now = typeof window === 'undefined' ? '1' : new URLSearchParams(window.location.search).get('hero') ?? '1';
  return (
    <nav aria-label="אפשרויות הירו" className="fixed bottom-5 left-5 z-30 flex gap-1 rounded-full border border-gold/30 bg-night/90 p-1 text-note">
      {['1', '2', '3'].map(n => (
        <a key={n} href={`?hero=${n}`} aria-current={n === now ? 'page' : undefined}
          className={`rounded-full px-3 py-1 ${n === now ? 'bg-gold text-night' : 'text-cream/80 hover:text-gold'}`}>הירו {n}</a>
      ))}
    </nav>
  );
}
