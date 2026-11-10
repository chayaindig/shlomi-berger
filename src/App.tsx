import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { deliveryStatus, israelDate, type CalendarEvent } from './delivery';
import { availability, business, extras, img, money, products, waLink, zones } from './data';
import { watchOrphans } from './noOrphans';
import { watchPageColor } from './pageColor';
import { About, Catalog, Events, Faq, Footer, FruitStory, Hero, HowToOrder, Testimonials, Ticker, Works } from './Sections';
import { Icon } from './ui';
import { AppleBlessing, Carving, PlatterWall } from './Craft';
import { CursorTrail } from './CursorTrail';

const allItems = [...products.map(p => ({ id: p.id, name: p.name, detail: p.size, price: p.price as number | null, from: p.from, tray: true })),
  ...extras.map(x => ({ id: x.id, name: x.name, detail: x.note, price: x.price, from: x.from, tray: false }))];

const nav = [['המגשים', '#catalog'], ['איך מזמינים', '#how'], ['אירועים', '#events'], ['שאלות', '#faq']];

export default function App() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => watchOrphans(), []);
  useEffect(() => watchPageColor(), []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2200); return () => clearTimeout(t); }, [toast]);

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const api = useMemo(() => ({
    qty: (id: string) => cart[id] || 0,
    add: (id: string) => {
      setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
      setToast('נוסף להזמנה · ' + (allItems.find(i => i.id === id)?.name ?? ''));
    },
    openCart: () => setOpen(true),
  }), [cart]);

  return (
    <>
      <a href="#catalog" className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-night">דילוג למגשים</a>
      <Header count={count} onCart={() => setOpen(true)} />
      <main>
        <Hero />
        <FruitStory />
        <Ticker />
        <Works />
        <Carving cart={api} />
        <AppleBlessing cart={api} />
        <PlatterWall cart={api} />
        <Catalog cart={api} />
        <HowToOrder />
        <Events />
        <About />
        <Testimonials />
        <Faq />
      </main>
      <Footer cart={api} />

      {/* Floating WhatsApp, bottom right */}
      <a
        href={waLink('היי שלומי, אשמח לשמוע על מגשי הפירות')}
        target="_blank"
        rel="noreferrer"
        aria-label="וואטסאפ לשלומי"
        className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-8px_rgb(0_0_0/0.5)] transition-transform hover:scale-105"
      >
        <Icon name="whatsapp" className="size-7" />
      </a>

      {/* Order bar on mobile once something is in the order */}
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
      <CursorTrail />
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
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled ? 'bg-night/95 shadow-[0_1px_0_rgb(214_178_110/0.15)]' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
        <a href="#top" aria-label="האמנות שבפרי, לראש העמוד"><img src={img('logo-gold.webp')} alt="האמנות שבפרי" className="h-9 w-auto md:h-11" /></a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="ניווט ראשי">
          {nav.map(([l, h]) => <a key={h} href={h} className="text-note font-medium text-cream/85 transition-colors hover:text-gold">{l}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#catalog" className="hidden whitespace-nowrap rounded-full bg-gold px-5 py-2.5 text-note font-medium text-night transition-colors hover:bg-[#e4c487] sm:inline-flex">להזמין מגש</a>
          <button onClick={onCart} aria-label={`ההזמנה שלי, ${count} פריטים`} className="relative grid size-11 place-items-center rounded-full border border-cream/20 text-cream transition-colors hover:border-gold hover:text-gold">
            <Icon name="basket" className="size-[1.35rem]" />
            {count > 0 && <span className="absolute -left-1 -top-1 grid size-5 place-items-center rounded-full bg-gold text-[0.7rem] font-medium text-night">{count}</span>}
          </button>
          <a href="#catalog" className="whitespace-nowrap rounded-full bg-gold px-4 py-2.5 text-note font-medium text-night sm:hidden">להזמין</a>
        </div>
      </div>
    </header>
  );
}

export function CartDrawer({ open, onClose, cart, setCart }: {
  open: boolean; onClose: () => void; cart: Record<string, number>; setCart: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) {
  const [d, setD] = useState({
    date: '', slot: '', zone: '', name: '', email: '', phone: '', toName: '', toPhone: '', address: '', checkAddress: false, greeting: '', notes: '', apple: '',
  });
  const [error, setError] = useState('');
  const [review, setReview] = useState(false);
  const reviewRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  useEffect(() => { if (review) { reviewRef.current?.scrollIntoView({ block: "center", behavior: "smooth" }); reviewRef.current?.focus({ preventScroll: true }); } }, [review]);
  const [calendar, setCalendar] = useState<CalendarEvent[] | null>(null);
  const [calendarError, setCalendarError] = useState(false);
  const [calendarRetry, setCalendarRetry] = useState(0);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!open) return;
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, [open]);
  const today = israelDate(now);
  const lastDate = new Date(today + 'T12:00:00Z'); lastDate.setUTCDate(lastDate.getUTCDate() + 90);
  const maxDate = lastDate.toISOString().slice(0, 10);
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    let cancelled = false;
    setCalendar(null); setCalendarError(false);
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&c=on&i=on&geo=geoname&geonameid=281184&b=40&lg=he&start=${today}&end=${maxDate}`, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error('Calendar'); return r.json(); })
      .then(data => { if (!Array.isArray(data.items)) throw new Error('Calendar'); if (!cancelled) setCalendar(data.items); })
      .catch(() => { if (!cancelled) setCalendarError(true); })
      .finally(() => clearTimeout(timeout));
    return () => { cancelled = true; clearTimeout(timeout); controller.abort(); };
  }, [open, today, maxDate, calendarRetry]);
  const delivery = deliveryStatus(d.date, calendar, availability.blockedDates, now);
  useEffect(() => { setReview(false); setError(''); }, [d, cart]);
  const lines = allItems.filter(i => cart[i.id]).map(i => ({ ...i, qty: cart[i.id] }));
  const zone = zones.find(z => z.id === d.zone);
  const pickup = d.zone === 'pickup';
  const subtotal = lines.reduce((s, l) => s + (l.price ?? 0) * l.qty, 0);
  const total = subtotal + (zone?.price ?? 0);
  const hasCustom = lines.some(l => l.price === null || l.from) || zone?.price === null;
  const change = (id: string, delta: number) => setCart(c => {
    const n = (c[id] || 0) + delta; const next = { ...c };
    if (n <= 0) delete next[id]; else next[id] = n; return next;
  });
  const set = (k: keyof typeof d) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setD(v => ({ ...v, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));


  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc); return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  const validate = () => {
    if (!lines.some(l => l.tray)) return 'בחרו לפחות מגש אחד.';
    if (subtotal < availability.minOrder) return `ההזמנה המינימלית היא ${money(availability.minOrder)}.`;
    const current = deliveryStatus(d.date, calendar, availability.blockedDates);
    if (current.error) return current.error;
    if (d.date > maxDate) return 'אפשר להזמין עד 90 יום מראש.';
    if (!d.date || !delivery.slot || !d.zone || !d.name.trim() || !d.phone.trim()) return 'חסרים עוד כמה פרטים כדי שהמגש יגיע בזמן.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) return 'כתבו כתובת מייל תקינה לאישור ולמסמך התשלום.';
    if (!/^0[2-9]\d{7,8}$/.test(d.phone.replace(/[\s-]/g, ''))) return 'בדקו שמספר הטלפון כולל קידומת ומספר מלא.';
    if (!pickup && (!d.toName.trim() || !/^0[2-9]\d{7,8}$/.test(d.toPhone.replace(/[\s-]/g, '')))) return 'למשלוח צריך שם ומספר טלפון תקין של המקבל.';
    if (cart['x-apple'] && !d.apple.trim()) return 'כתבו מה לחרוט על התפוח.';
    if (!pickup && !d.address.trim() && !d.checkAddress) return 'כתבו כתובת, או סמנו ששלומי יתאם אותה.';
    return '';
  };
  const message = () => [
    'הזמנה חדשה מהאתר 🍉',
    ...lines.map(l => `${l.qty} × ${l.name} (${l.detail})${l.price ? ' · ' + money(l.price * l.qty) : ''}`),
    '',
    `תאריך: ${d.date.split('-').reverse().join('/')} · ${delivery.slot}`,
    pickup ? 'איסוף עצמי' : `משלוח: ${zone?.label}${zone?.price ? ' · ' + money(zone.price) : ''}`,
    pickup ? null : (d.checkAddress ? 'כתובת: שלומי יתאם עם המקבל' : `כתובת: ${d.address}`),
    `מזמין: ${d.name} · ${d.phone}`,
    `מייל: ${d.email}`,
    d.toName || d.toPhone ? `מקבל: ${d.toName} · ${d.toPhone}` : null,
    cart['x-apple'] ? `חריטה על התפוח: ${d.apple}` : null,
    d.greeting ? `ברכה: ${d.greeting}` : null,
    d.notes ? `הערות: ${d.notes}` : null,
    '',
    `סה״כ: ${money(total)}${hasCustom ? ' + פריטים בתיאום' : ''}`,
  ].filter(x => typeof x === 'string').join('\n');
  const sendWa = () => { const e = validate(); setError(e || (business.whatsapp === '972500000000' ? 'מספר הוואטסאפ של שלומי טרם הוגדר. ההזמנה לא נשלחה.' : '')); if (!e && business.whatsapp !== '972500000000') window.open(waLink(message()), '_blank', 'noopener,noreferrer'); };
  const previewOrder = () => { const e = validate(); setError(e); setReview(!e); };
  const field = 'w-full rounded-xl border border-ink/15 bg-white/70 px-3.5 py-2.5 text-ink focus:border-wine focus:outline-none';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[55] bg-night/70" />
          <motion.aside
            ref={dialogRef} tabIndex={-1} onKeyDown={e => { if (e.key !== "Tab") return; const nodes = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex="0"]') || []).filter(n => n.getClientRects().length); const first = nodes[0], last = nodes[nodes.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); } }} role="dialog" aria-modal="true" aria-label="ההזמנה שלי"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="order-panel fixed inset-y-0 right-0 z-[56] flex w-full max-w-xl flex-col bg-cream text-ink"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="text-sub text-ink">ההזמנה שלי</h2>
              <button onClick={onClose} aria-label="סגירה" className="grid size-10 place-items-center rounded-full border border-ink/15 hover:border-ink/40"><Icon name="close" className="size-6" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {lines.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="font-display text-sub">עוד לא בחרתם מגש</p>
                  <a href={location.pathname.includes("combo") ? "#shop" : "#catalog"} onClick={onClose} className="mt-4 inline-block rounded-full bg-wine px-6 py-3 text-cream">לבחירת מגש</a>
                </div>
              ) : (
                <>
                  <p className="mb-4 text-note text-ink-soft">המגש והתוספות</p>
                  <ul className="space-y-3">
                    {lines.map(l => (
                      <li key={l.id} className="flex items-center gap-3 rounded-2xl bg-white/60 p-2.5">
                        {l.tray && <img src={img(`catalog/${l.id}.webp`)} alt="" className="size-14 rounded-xl object-cover" />}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium leading-tight">{l.name}</p>
                          <p className="truncate text-note text-ink-soft">{l.detail}</p>
                          <p className="text-note">{l.price === null ? 'מחיר בתיאום' : (l.from ? 'החל מ-' : '') + money(l.price * l.qty)}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => change(l.id, -1)} aria-label={`הפחתת ${l.name}`} className="grid size-8 place-items-center rounded-full border border-ink/15"><Icon name="minus" className="size-5" /></button>
                          <span className="w-5 text-center">{l.qty}</span>
                          <button onClick={() => change(l.id, 1)} aria-label={`הוספת ${l.name}`} className="grid size-8 place-items-center rounded-full border border-ink/15"><Icon name="plus" className="size-5" /></button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <p className="font-display text-sub">רגע לפני שסוגרים</p>
                    <p className="text-note text-ink-soft">יין, פרלינים, פיצוחים או תפוח עם ברכה, על אותו מגש.</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {extras.slice(0, 4).map(x => (
                        <button key={x.id} onClick={() => change(x.id, cart[x.id] ? -cart[x.id] : 1)} aria-pressed={!!cart[x.id]}
                          className={`rounded-2xl border px-3 py-2.5 text-right transition-colors ${cart[x.id] ? 'border-wine bg-wine text-cream' : 'border-ink/15 hover:border-wine'}`}>
                          <span className="flex items-center gap-1 font-medium leading-tight"><Icon name={cart[x.id] ? 'check' : 'plus'} className="size-4" />{x.name}</span>
                          <span className={`block text-note ${cart[x.id] ? 'text-cream/80' : 'text-ink-soft'}`}>{x.price === null ? 'מחיר בתיאום' : (x.from ? 'החל מ-' : '') + money(x.price)}</span>
                        </button>
                      ))}
                    </div>
                    <AnimatePresence initial={false}>
                      {!!cart['x-apple'] && (
                        <motion.label
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="block overflow-hidden"
                        >
                          <span className="mt-3 flex items-baseline justify-between text-note text-ink-soft">
                            <span>מה לחרוט על התפוח?</span>
                            <span dir="ltr">{d.apple.length}/21</span>
                          </span>
                          <input value={d.apple} onChange={set('apple')} maxLength={21} className={`${field} mt-1`} placeholder="למשל: אוהבת אותך" />
                        </motion.label>
                      )}
                    </AnimatePresence>
                    <div className="no-scrollbar -mx-6 mt-2 flex gap-2 overflow-x-auto px-6">
                      {extras.slice(4).filter(x => !cart[x.id]).map(x => (
                        <button key={x.id} onClick={() => change(x.id, 1)} className="whitespace-nowrap rounded-full border border-ink/15 px-3.5 py-2 text-note hover:border-wine">
                          <span className="flex items-center gap-1"><Icon name="plus" className="size-4" />{x.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                {review && <div ref={reviewRef} tabIndex={-1} role="status" className="mt-3 max-h-44 overflow-auto rounded-2xl bg-sand p-4 text-note"><strong>הפרטים מוכנים לבדיקה</strong><p>{d.name} · {d.email}</p><p>{d.date.split('-').reverse().join('/')} · {delivery.slot}</p><p>{pickup ? 'איסוף עצמי' : `${d.toName} · ${d.checkAddress ? 'כתובת בתיאום' : d.address}`}</p>{hasCustom && <p className="mt-2 font-medium">הסכום אינו סופי: פריטים בהתאמה אישית דורשים הצעת מחיר.</p>}<p className="mt-2">זו תצוגה מקדימה. ההזמנה לא נשמרה ולא בוצע חיוב.</p></div>}

                  <div className="order-step grid grid-cols-2 gap-3">
                    <p className="col-span-2 text-note text-ink-soft">לאן ומתי?</p>
                    <p className="col-span-2 font-display text-sub">בוחרים אזור אספקה</p>
                    <div className="col-span-2 grid grid-cols-2 gap-2">
                      {zones.map(z => (
                        <label key={z.id} className={`cursor-pointer rounded-2xl border px-3 py-2.5 transition-colors ${d.zone === z.id ? 'border-wine bg-wine text-cream' : 'border-ink/15 hover:border-wine'} ${z.id === 'other' ? 'col-span-2' : ''}`}>
                          <input type="radio" name="zone" value={z.id} checked={d.zone === z.id} onChange={set('zone')} className="sr-only" />
                          <span className="block font-medium leading-tight">{z.label}</span>
                          <span className={`block text-note ${d.zone === z.id ? 'text-cream/80' : 'text-ink-soft'}`}>{z.price === null ? 'מחיר בתיאום' : z.price === 0 ? 'בלי עלות' : money(z.price)}</span>
                        </label>
                      ))}
                    </div>
                    {d.zone && !pickup && (
                      <>
                        <label className="col-span-2"><span className="mb-1 block text-note text-ink-soft">כתובת מדויקת</span><input value={d.address} onChange={set('address')} disabled={d.checkAddress} className={`${field} disabled:opacity-50`} placeholder="רחוב, מספר, קומה ועיר" /></label>
                        <label className="col-span-2 flex items-center gap-2 text-note text-ink-soft">
                          <input type="checkbox" checked={d.checkAddress} onChange={set('checkAddress')} className="size-4 accent-[#7d1846]" />
                          לא בטוחים בכתובת? שלומי יתאם עם המקבל
                        </label>
                      </>
                    )}

                    <label className="col-span-2 mt-3"><span className="mb-1 block font-medium">באיזה יום לשמח אותם?</span><input type="date" min={today} max={maxDate} value={d.date} onInput={e => { const date = e.currentTarget.value; setD(v => ({ ...v, date })); }} onChange={set('date')} disabled={!d.zone} className={`${field} disabled:opacity-40`} /><span className="mt-1 block text-note text-ink-soft">{!d.zone ? 'בחרו קודם אזור או איסוף עצמי.' : 'עד 12:00 אפשר להזמין להיום, בכפוף לזמינות.'}</span></label>
                    <div className="col-span-2 rounded-2xl bg-sand p-4 text-note" aria-live="polite">
                      {calendarError ? <><p>לוח החגים לא נטען. לא ניתן לאשר מועד עד שהבדיקה תושלם.</p><button className="mt-2 underline" onClick={() => setCalendarRetry(v => v + 1)}>לנסות שוב</button></> : d.date ? <p className={delivery.error ? 'text-gold-deep' : 'font-medium'}>{delivery.error || `זמן האספקה: ${delivery.slot}`}</p> : <p>בימי חול: הזמנה עד 12:00 לאספקה בתוך 4–6 שעות. להזמנה מראש: 09:00–16:00.</p>}
                      <p className="mt-2 text-ink-soft">לשישי מזמינים עד חמישי ב־12:00. האספקה מסתיימת שלוש שעות לפני כניסת שבת. בשבת ובחג אנחנו סגורים. ערבי חג בתיאום מראש.</p>
                      <a href="https://www.hebcal.com" target="_blank" rel="noreferrer" className="mt-2 inline-block text-ink-soft underline">זמני שבת וחג: Hebcal · ירושלים</a>
                    </div>
                    <p className="col-span-2 order-step text-note text-ink-soft">פרטים וברכה אישית</p>
                    <p className="col-span-2 font-display text-sub">מי מזמין ומי מקבל?</p>
                    <label><span className="mb-1 block text-note text-ink-soft">השם שלך</span><input value={d.name} onChange={set('name')} className={field} autoComplete="name" /></label>
                    <label><span className="mb-1 block text-note text-ink-soft">הטלפון שלך</span><input type="tel" value={d.phone} onChange={set('phone')} className={field} autoComplete="tel" dir="ltr" /></label>
                    <label className="col-span-2"><span className="mb-1 block text-note text-ink-soft">המייל שלך לאישור ולמסמך התשלום</span><input type="email" value={d.email} onChange={set('email')} className={field} autoComplete="email" dir="ltr" placeholder="name@example.com" /></label>
                    <label><span className="mb-1 block text-note text-ink-soft">שם המקבל</span><input value={d.toName} onChange={set('toName')} className={field} placeholder="אם זו מתנה" /></label>
                    <label><span className="mb-1 block text-note text-ink-soft">טלפון המקבל</span><input type="tel" value={d.toPhone} onChange={set('toPhone')} className={field} dir="ltr" /></label>
                    <label className="col-span-2"><span className="mb-1 block text-note text-ink-soft">ברכה על המגש (לא חובה)</span><input value={d.greeting} onChange={set('greeting')} className={field} placeholder="מזל טוב!" /></label>
                    <label className="col-span-2"><span className="mb-1 block text-note text-ink-soft">הערות (לא חובה)</span><input value={d.notes} onChange={set('notes')} className={field} placeholder="אלרגיות, קוד לבניין, בלי קיווי..." /></label>
                  </div>
                </>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-ink/10 px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-ink-soft">סה״כ</span>
                  <span className="font-display text-sub">{money(total)}{hasCustom && <small className="mr-1 font-sans text-note text-ink-soft">+ בתיאום</small>}</span>
                </div>
                <p className="text-note text-ink-soft">{zone ? (pickup ? 'איסוף עצמי, בלי עלות' : zone.price === null ? 'המשלוח יתואם מול שלומי' : `כולל משלוח ל${zone.label}`) : 'המשלוח מתווסף לפי האזור'}</p>
                {error && <p role="alert" className="mt-2 text-note font-medium text-wine">{error}</p>}
                <button onClick={previewOrder} className="mt-3 w-full rounded-full bg-gold py-3 font-medium text-night">בדיקת פרטים וסיכום הזמנה</button>
                {/* TODO: Grow (Meshulam) checkout, Shlomi already has an account. Bit and PayBox can go through Grow too. */}
                <button disabled title="הסליקה תחובר בקרוב" className="mt-4 w-full cursor-not-allowed rounded-full bg-wine/40 py-3.5 font-medium text-cream">
                  התשלום באתר עדיין לא פעיל
                </button>
                <button onClick={sendWa} className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-wine py-3.5 font-medium text-cream transition-colors hover:bg-plum">
                  <Icon name="whatsapp" /> לתיאום ההזמנה עם שלומי
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
