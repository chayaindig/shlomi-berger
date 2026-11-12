import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { waLink } from './data';
import { Icon } from './ui';

/* Floating buttons (12.11): WhatsApp bottom right on phones only, accessibility menu bottom left
   on every screen, same size, height and look. Icons from Magnific. */

type Prefs = { size: 0 | 1 | 2; contrast: boolean; gray: boolean; links: boolean; still: boolean; readable: boolean };
const START: Prefs = { size: 0, contrast: false, gray: false, links: false, still: false, readable: false };
const KEY = 'a11y-prefs';
const SIZES = ['100%', '115%', '130%'];

function load(): Prefs {
  try { return { ...START, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return START; }
}

function apply(p: Prefs) {
  const html = document.documentElement;
  html.style.fontSize = p.size ? SIZES[p.size] : '';
  html.classList.toggle('a11y-contrast', p.contrast);
  html.classList.toggle('a11y-gray', p.gray);
  html.classList.toggle('a11y-links', p.links);
  html.classList.toggle('a11y-still', p.still);
  html.classList.toggle('a11y-readable', p.readable);
}

const OPTIONS: { key: Exclude<keyof Prefs, 'size'>; label: string }[] = [
  { key: 'contrast', label: 'ניגודיות גבוהה' },
  { key: 'gray', label: 'גווני אפור' },
  { key: 'links', label: 'הדגשת קישורים' },
  { key: 'still', label: 'עצירת אנימציות' },
  { key: 'readable', label: 'גופן קריא' },
];

const round = 'fixed bottom-5 z-40 grid size-14 place-items-center rounded-full text-white shadow-[0_12px_30px_-8px_rgb(0_0_0/0.5)] transition-transform hover:scale-105';

export function A11yRoot({ children, whatsapp = true, statement = location.hostname.endsWith('github.io') ? './accessibility' : '/accessibility' }: { children: ReactNode; whatsapp?: boolean; statement?: string }) {
  const [prefs, setPrefs] = useState<Prefs>(load);
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apply(prefs);
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch { /* private mode */ }
  }, [prefs]);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector('button')?.focus();
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    const out = (e: PointerEvent) => { if (!panel.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setOpen(false); };
    window.addEventListener('keydown', key);
    document.addEventListener('pointerdown', out);
    return () => { window.removeEventListener('keydown', key); document.removeEventListener('pointerdown', out); };
  }, [open]);

  const toggle = (k: Exclude<keyof Prefs, 'size'>) => setPrefs(p => ({ ...p, [k]: !p[k] }));
  const changed = JSON.stringify(prefs) !== JSON.stringify(START);
  const chip = 'rounded-2xl border px-3 py-2.5 text-right text-note transition-colors';
  const on = 'border-wine bg-wine text-cream';
  const off = 'border-ink/15 bg-cream text-ink hover:border-wine/50';

  return (
    <MotionConfig reducedMotion={prefs.still ? 'always' : 'user'}>
      {children}

      {whatsapp && (
        <a href={waLink('היי שלומי, אשמח לשמוע על מגשי הפירות')} target="_blank" rel="noreferrer" aria-label="וואטסאפ לשלומי"
          className={`${round} right-5 bg-[#25d366] md:hidden`}>
          <Icon name="whatsapp-logo" className="size-7" />
        </a>
      )}

      <button ref={btn} type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls="a11y-panel" aria-label="תפריט נגישות"
        className={`${round} a11y-fab left-5 bg-wine ring-1 ring-gold/40`}>
        <Icon name="accessibility" className="size-7" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div ref={panel} id="a11y-panel" role="dialog" aria-label="תפריט נגישות"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.18 }}
            className="a11y-panel fixed bottom-24 left-5 z-[70] w-[min(20rem,calc(100vw-2.5rem))] rounded-3xl bg-cream p-5 text-ink shadow-[0_24px_50px_-14px_rgb(0_0_0/0.55)]">
            <div className="flex items-center justify-between">
              <p className="font-display text-sub font-bold">נגישות</p>
              <button type="button" onClick={() => { setOpen(false); btn.current?.focus(); }} aria-label="סגירת תפריט הנגישות"
                className="grid size-9 place-items-center rounded-full border border-ink/15 hover:bg-sand"><Icon name="close" className="size-4" /></button>
            </div>

            <p className="mt-4 text-note text-ink-soft" id="a11y-size">גודל טקסט</p>
            <div role="group" aria-labelledby="a11y-size" className="mt-1.5 grid grid-cols-3 gap-2">
              {['רגיל', 'גדול', 'גדול מאוד'].map((l, i) => (
                <button key={l} type="button" aria-pressed={prefs.size === i} onClick={() => setPrefs(p => ({ ...p, size: i as Prefs['size'] }))}
                  className={`${chip} text-center ${prefs.size === i ? on : off}`}>{l}</button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {OPTIONS.map(o => (
                <button key={o.key} type="button" aria-pressed={prefs[o.key]} onClick={() => toggle(o.key)} className={`${chip} ${prefs[o.key] ? on : off}`}>{o.label}</button>
              ))}
              <button type="button" disabled={!changed} onClick={() => setPrefs(START)} className={`${chip} ${off} disabled:opacity-40`}>איפוס</button>
            </div>

            <a href={statement} className="mt-4 block text-note text-wine underline underline-offset-4">להצהרת הנגישות</a>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
