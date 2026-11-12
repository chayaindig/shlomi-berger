import { animate, motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { img } from './data';

// The hero's little game: one fruit big in the middle, five others circling it.
// Tap a circling fruit and it spirals into the middle. Left alone, the middle
// cycles through all of them, and the ring around it changes order every time.
type HeroItem = { id: string; name: string; src: string };
const fruitPool: HeroItem[] = [
  { id: 'watermelon', name: 'אבטיח', src: 'hero/watermelon.webp' },
  { id: 'pineapple', name: 'אננס', src: 'hero/pineapple-half.webp' },
  { id: 'grapes', name: 'ענבים', src: 'hero/grapes.webp' },
  { id: 'strawberries', name: 'תותים', src: 'hero/strawberries.webp' },
  { id: 'passion', name: 'פסיפלורה', src: 'hero/passion.webp' },
  { id: 'pomegranate', name: 'רימון', src: 'hero/pomegranate.webp' },
];
// Version D: six carved watermelons on the same carousel. Generated stand-ins until Shlomi's own photos arrive.
export const melonPool: HeroItem[] = [
  { id: 'heart', name: 'לב ורדים לחתונה', src: 'hero/melons/heart.webp' },
  { id: 'roses', name: 'ורדים וברכה', src: 'hero/melons/roses.webp' },
  { id: 'crown', name: 'כתר וברכה', src: 'hero/melons/crown.webp' },
  { id: 'rose', name: 'ורד גדול', src: 'hero/melons/rose.webp' },
  { id: 'jerusalem', name: 'ירושלים בגילוף', src: 'hero/melons/bni.webp' },
  { id: 'birthday', name: 'יום הולדת שמח', src: 'hero/melons/birthday.webp' },
  { id: 'portrait', name: 'סבא, יום הולדת שמח', src: 'hero/melons/portrait.webp' },
];
const RING = 5;
const ORBIT = 0.78; // ring radius, as a share of half the stage
const SMALL = 0.4; // orbit fruit size relative to the middle one

function ringFor(pool: HeroItem[], center: number, turn: number) {
  const others = pool.map((_, i) => i).filter(i => i !== center);
  const start = (turn * 2) % others.length;
  return [...others.slice(start), ...others.slice(0, start)].slice(0, RING);
}

function Fruit({ f, i, role, slot, theta, half, onPick }: {
  f: HeroItem; i: number; role: 'center' | 'ring' | 'off'; slot: number; theta: MotionValue<number>; half: number; onPick: (i: number) => void;
}) {
  const r = useMotionValue(role === 'center' ? 0 : ORBIT);
  const phase = useMotionValue((slot / RING) * Math.PI * 2);
  const scale = useMotionValue(role === 'center' ? 1 : role === 'ring' ? SMALL : 0);
  const x = useTransform(() => Math.cos(theta.get() + phase.get()) * r.get() * half);
  const y = useTransform(() => Math.sin(theta.get() + phase.get()) * r.get() * half);

  useEffect(() => {
    const ease = { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };
    animate(r, role === 'center' ? 0 : ORBIT, ease);
    animate(scale, role === 'center' ? 1 : role === 'ring' ? SMALL : 0, ease);
    if (role === 'ring') {
      // Go to the new slot the short way round
      const target = (slot / RING) * Math.PI * 2;
      const now = phase.get();
      const diff = Math.atan2(Math.sin(target - now), Math.cos(target - now));
      animate(phase, now + diff, ease);
    }
  }, [role, slot, r, scale, phase]);

  return (
    <motion.button
      type="button"
      tabIndex={role === 'ring' ? 0 : -1}
      aria-hidden={role !== 'ring'}
      aria-label={role === 'ring' ? `${f.name} למרכז` : undefined}
      onClick={() => role === 'ring' && onPick(i)}
      style={{ x, y, scale, zIndex: role === 'center' ? 2 : 3 }}
      className={`absolute left-1/2 top-1/2 -ml-[29%] -mt-[29%] grid size-[58%] place-items-center ${role === 'ring' ? 'cursor-pointer' : 'pointer-events-none'}`}
    >
      <img src={img(f.src)} alt="" draggable={false} className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-110 drop-shadow-[0_26px_34px_rgb(20_0_10/0.55)]" />
    </motion.button>
  );
}

export function HeroFruits({ pool = fruitPool }: { pool?: HeroItem[] }) {
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const [half, setHalf] = useState(260);
  const [center, setCenter] = useState(0);
  const [turn, setTurn] = useState(0);
  const touched = useRef(0);
  const theta = useMotionValue(0);

  useEffect(() => {
    const el = stage.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setHalf(e.contentRect.width / 2));
    ro.observe(el); return () => ro.disconnect();
  }, []);

  // One full lap every ~40s
  useAnimationFrame((_, delta) => { if (!reduce) theta.set(theta.get() + delta * 0.00016); });

  // Left alone, the middle cycles through every fruit
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => {
      if (Date.now() - touched.current < 9000) return;
      setCenter(c => (c + 1) % pool.length);
      setTurn(n => n + 1);
    }, 4200);
    return () => clearInterval(t);
  }, [reduce, pool.length]);

  const ring = ringFor(pool, center, turn);
  const pick = (i: number) => { touched.current = Date.now(); setCenter(i); setTurn(n => n + 1); };

  return (
    <div ref={stage} className="absolute inset-[9%]">
      {pool.map((_, i) => {
        const slot = ring.indexOf(i);
        const role = i === center ? 'center' : slot >= 0 ? 'ring' : 'off';
        return <Fruit key={i} f={pool[i]} i={i} role={role} slot={Math.max(slot, 0)} theta={theta} half={half} onPick={pick} />;
      })}
      <p aria-live="polite" className="pointer-events-none absolute inset-x-0 -bottom-[6%] text-center font-display text-sub text-gold">
        {pool[center].name}
      </p>
    </div>
  );
}
