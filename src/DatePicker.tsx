import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './ui';

// Small month calendar that opens right under the date field and closes once a day is picked.
// Only this month and the next one (Chaya, 12.11). Days the delivery rules close are greyed out.
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const DAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
const monthName = (y: number, m: number) => new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m, 15)));
export const longDate = (date: string) => new Intl.DateTimeFormat('he-IL', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z'));

export function DatePicker({ value, onChange, today, maxDate, disabled, closedReason, loading, className = '' }: {
  value: string; onChange: (date: string) => void; today: string; maxDate: string; disabled?: boolean;
  closedReason: (date: string) => string; loading?: boolean; className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [ty, tm] = today.split('-').map(Number);
  const [offset, setOffset] = useState(0); // 0 = this month, 1 = next month
  const box = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const year = ty + Math.floor((tm - 1 + offset) / 12);
  const month = (tm - 1 + offset) % 12;
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  useEffect(() => {
    if (!open) return;
    const out = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', out);
    return () => document.removeEventListener('pointerdown', out);
  }, [open]);
  useEffect(() => { if (open && value) setOffset(value.slice(0, 7) > today.slice(0, 7) ? 1 : 0); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={box} className="relative" onKeyDown={e => { if (e.key === 'Escape' && open) { e.stopPropagation(); setOpen(false); } }}>
      <button type="button" disabled={disabled} onClick={() => setOpen(o => !o)} aria-haspopup="dialog" aria-expanded={open}
        className={`flex items-center justify-between gap-3 text-right ${className}`}>
        <span className={value ? '' : 'text-ink-soft'}>{value ? longDate(value) : 'בחרו תאריך'}</span>
        <Icon name="arrow" className={`size-4 shrink-0 text-ink-soft transition-transform ${open ? '-rotate-90' : 'rotate-90'}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div ref={panel} role="dialog" aria-label="בחירת תאריך"
            onAnimationComplete={() => panel.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })}
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-20 mt-1.5 w-[min(19rem,100%)] rounded-2xl border border-ink/15 bg-cream p-3 shadow-[0_18px_40px_-12px_rgb(42_20_36/0.45)]">
            <div className="mb-2 flex items-center justify-between">
              <button type="button" onClick={() => setOffset(0)} disabled={offset === 0} aria-label="החודש הקודם"
                className="grid size-8 place-items-center rounded-full hover:bg-sand disabled:opacity-25"><Icon name="arrow" className="size-4 rotate-180" /></button>
              <p className="font-medium" aria-live="polite">{monthName(year, month)}</p>
              <button type="button" onClick={() => setOffset(1)} disabled={offset === 1} aria-label="החודש הבא"
                className="grid size-8 place-items-center rounded-full hover:bg-sand disabled:opacity-25"><Icon name="arrow" className="size-4" /></button>
            </div>
            <div className="grid grid-cols-7 text-center text-[0.75rem] text-ink-soft">{DAYS.map(d => <span key={d} className="py-1">{d}</span>)}</div>
            <div className="grid grid-cols-7 gap-y-1 text-center">
              {Array.from({ length: first }, (_, k) => <span key={'e' + k} />)}
              {Array.from({ length: days }, (_, k) => {
                const date = iso(year, month, k + 1);
                const reason = date < today ? 'התאריך כבר עבר' : date > maxDate ? 'מחוץ לטווח ההזמנה' : closedReason(date);
                const picked = date === value;
                return (
                  <button key={date} type="button" disabled={!!reason} title={reason || undefined}
                    aria-label={longDate(date) + (reason ? `, ${reason}` : '')} aria-pressed={picked}
                    onClick={() => { onChange(date); setOpen(false); }}
                    className={`mx-auto grid size-9 place-items-center rounded-full text-[0.95rem] tabular-nums transition-colors
                      ${picked ? 'bg-wine font-medium text-cream' : reason ? 'text-ink/25 line-through decoration-ink/20' : 'hover:bg-sand'}
                      ${date === today && !picked ? 'ring-1 ring-wine/50' : ''}`}>
                    {k + 1}
                  </button>
                );
              })}
            </div>
            {loading && <p className="mt-2 text-center text-note text-ink-soft">בודקים שבתות וחגים...</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
