import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef, type ReactNode } from 'react';

const icon = (name: string) => `${import.meta.env.BASE_URL}icons/${name}.svg`;

export function Icon({ name, className = 'size-5' }: { name: string; className?: string }) {
  // Magnific icons are single-color SVGs, tinted through CSS mask so they follow currentColor
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{ WebkitMask: `url("${icon(name)}") center/contain no-repeat`, mask: `url("${icon(name)}") center/contain no-repeat` }}
    />
  );
}

/** Small editorial label: number, thin line, title */
export function Eyebrow({ n, children, tone = 'gold' }: { n?: string; children: ReactNode; tone?: 'gold' | 'deep' }) {
  const color = tone === 'gold' ? 'text-gold' : 'text-gold-deep';
  return (
    <div className={`flex items-center gap-3 text-note font-medium tracking-wide ${color}`}>
      {n && <span className="font-display text-sub font-extralight leading-none">{n}</span>}
      <span className="h-px w-10 bg-current opacity-60" />
      <span>{children}</span>
    </div>
  );
}

/** Fades and lifts children in once they enter the screen */
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Gold line that draws under a key word when it enters the screen */
export function Stroke({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const on = useInView(ref, { once: true, margin: '-15% 0px' });
  return <span ref={ref} className={`stroke ${on ? 'is-on' : ''}`}>{children}</span>;
}

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

/** Text that lights up word by word with the scroll */
export function ScrollWords({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const words = text.split(' ');
  if (reduce) return <p className={className}>{text}</p>;
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </p>
  );
}

export function Button({ href, onClick, children, variant = 'gold', className = '' }: {
  href?: string; onClick?: () => void; children: ReactNode; variant?: 'gold' | 'ghost' | 'ghost-dark'; className?: string;
}) {
  const styles = {
    gold: 'bg-gold text-night hover:bg-[#e4c487] shadow-[0_10px_30px_-12px_rgb(214_178_110/0.7)]',
    ghost: 'border border-cream/30 text-cream hover:border-gold hover:text-gold',
    'ghost-dark': 'border border-ink/25 text-ink hover:border-gold-deep hover:text-gold-deep',
  }[variant];
  const cls = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 py-3.5 text-body font-medium transition-colors duration-300 ${styles} ${className}`;
  if (href) return <a href={href} className={cls} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{children}</a>;
  return <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

/** The only divider between sections: three fruits, a different trio each time */
const trios = [
  ['straw', 'kiwi', 'mint'],
  ['seeds', 'fig', 'mint'],
  ['kiwi', 'seeds', 'straw'],
  ['fig', 'straw', 'mint'],
  ['mint', 'pomegranate', 'seeds'],
  ['straw', 'fig', 'kiwi'],
];
export function FruitTrio({ n }: { n: number }) {
  const reduce = useReducedMotion();
  const set = trios[n % trios.length];
  const tilt = [-14, 6, 18];
  return (
    <div aria-hidden className="flex items-end justify-center gap-5 py-8 md:py-10">
      {set.map((f, i) => (
        <motion.img
          key={f + i}
          src={`${import.meta.env.BASE_URL}img/fruit/${f}.webp`}
          alt=""
          loading="lazy"
          initial={reduce ? false : { opacity: 0, y: 14, rotate: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, y: i === 1 ? -6 : 0, rotate: tilt[i], scale: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ delay: i * 0.1, type: 'spring', stiffness: 220, damping: 16 }}
          className={`w-auto drop-shadow-[0_10px_12px_rgb(20_0_10/0.35)] ${i === 1 ? 'h-12 md:h-14' : 'h-9 md:h-11'}`}
        />
      ))}
    </div>
  );
}
