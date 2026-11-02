import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { business, extras, img, money, products, waLink } from './data';
import { watchOrphans } from './noOrphans';
import { watchPageColor } from './pageColor';
import { About, Catalog, Events, Faq, Footer, FruitStory, Hero, HowToOrder, Testimonials, Ticker, Works } from './Sections';
import { FruitTrio, Icon } from './ui';
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
        <FruitTrio n={0} />
        <Carving cart={api} />
        <FruitTrio n={1} />
        <AppleBlessing cart={api} />
        <PlatterWall cart={api} />
        <FruitTrio n={2} />
        <Catalog cart={api} />
        <HowToOrder />
        <FruitTrio n={3} />
        <Events />
        <FruitTrio n={4} />
        <About />
        <Testimonials />
        <FruitTrio n={5} />
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
            <span>להמשך ←</span>
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
            <Icon name="bag" />
            {count > 0 && <span className="absolute -left-1 -top-1 grid size-5 place-items-center rounded-full bg-gold text-[0.7rem] font-medium text-night">{count}</span>}
          </button>
          <a href="#catalog" className="whitespace-nowrap rounded-full bg-gold px-4 py-2.5 text-note font-medium text-night sm:hidden">להזמין</a>
        </div>
      </div>
    </header>
  );
}

function CartDrawer({ open, onClose, cart, setCart }: {
  open: boolean; onClose: () => void; cart: Record<string, number>; setCart: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) {
  const [d, setD] = useState({ date: '', time: '', name: '', phone: '', address: '', greeting: '' });
  const [error, setError] = useState('');
  const lines = allItems.filter(i => cart[i.id]).map(i => ({ ...i, qty: cart[i.id] }));
  const total = lines.reduce((s, l) => s + (l.price ?? 0) * l.qty, 0);
  const hasCustom = lines.some(l => l.price === null || l.from);
  const change = (id: string, delta: number) => setCart(c => {
    const n = (c[id] || 0) + delta; const next = { ...c };
    if (n <= 0) delete next[id]; else next[id] = n; return next;
  });
  const set = (k: keyof typeof d) => (e: React.ChangeEvent<HTMLInputElement>) => setD(v => ({ ...v, [k]: e.target.value }));
  const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc); return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  const validate = () => {
    if (!lines.some(l => l.tray)) return 'בחרו לפחות מגש אחד.';
    if (!d.date || !d.time || !d.name || !d.phone || !d.address) return 'חסרים עוד כמה פרטים כדי שהמגש יגיע בזמן.';
    return '';
  };
  const message = () =>
    `הזמנה חדשה מהאתר 🍉\n${lines.map(l => `${l.qty} × ${l.name} (${l.detail})${l.price ? ' · ' + money(l.price * l.qty) : ''}`).join('\n')}\n\nתאריך: ${d.date.split('-').reverse().join('/')} · ${d.time}\nכתובת: ${d.address}\nשם: ${d.name} · ${d.phone}${d.greeting ? '\nברכה: ' + d.greeting : ''}\n\nסה״כ משוער: ${money(total)}${hasCustom ? ' + פריטים בתיאום' : ''}`;
  const sendWa = () => { const e = validate(); setError(e); if (!e) window.open(waLink(message()), '_blank'); };
  const field = 'w-full rounded-xl border border-ink/15 bg-white/70 px-3.5 py-2.5 text-ink focus:border-wine focus:outline-none';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[55] bg-night/70" />
          <motion.aside
            role="dialog" aria-modal="true" aria-label="ההזמנה שלי"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[56] flex w-full max-w-md flex-col bg-cream text-ink"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="text-sub text-ink">ההזמנה שלי</h2>
              <button onClick={onClose} aria-label="סגירה" className="grid size-10 place-items-center rounded-full border border-ink/15 text-2xl leading-none hover:border-ink/40">×</button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {lines.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="font-display text-sub">עוד לא בחרתם מגש</p>
                  <a href="#catalog" onClick={onClose} className="mt-4 inline-block rounded-full bg-wine px-6 py-3 text-cream">לבחירת מגש</a>
                </div>
              ) : (
                <>
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
                          <button onClick={() => change(l.id, -1)} aria-label={`הפחתת ${l.name}`} className="grid size-8 place-items-center rounded-full border border-ink/15">−</button>
                          <span className="w-5 text-center">{l.qty}</span>
                          <button onClick={() => change(l.id, 1)} aria-label={`הוספת ${l.name}`} className="grid size-8 place-items-center rounded-full border border-ink/15">+</button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <p className="text-note font-medium text-ink-soft">עוד נגיעה קטנה?</p>
                    <div className="no-scrollbar -mx-6 mt-2 flex gap-2 overflow-x-auto px-6">
                      {extras.filter(x => !cart[x.id]).map(x => (
                        <button key={x.id} onClick={() => change(x.id, 1)} className="whitespace-nowrap rounded-full border border-ink/15 px-3.5 py-2 text-note hover:border-wine">
                          + {x.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <p className="col-span-2 font-display text-sub">מתי ולאן?</p>
                    <label><span className="mb-1 block text-note text-ink-soft">תאריך</span><input type="date" min={tomorrow} value={d.date} onChange={set('date')} className={field} /></label>
                    <label><span className="mb-1 block text-note text-ink-soft">שעה</span><input type="time" value={d.time} onChange={set('time')} className={field} /></label>
                    <label className="col-span-2"><span className="mb-1 block text-note text-ink-soft">כתובת למשלוח</span><input value={d.address} onChange={set('address')} className={field} placeholder={`רחוב, מספר ועיר (${business.areas.join(', ')})`} /></label>
                    <label><span className="mb-1 block text-note text-ink-soft">שם</span><input value={d.name} onChange={set('name')} className={field} autoComplete="name" /></label>
                    <label><span className="mb-1 block text-note text-ink-soft">טלפון</span><input type="tel" value={d.phone} onChange={set('phone')} className={field} autoComplete="tel" dir="ltr" /></label>
                    <label className="col-span-2"><span className="mb-1 block text-note text-ink-soft">ברכה על המגש (לא חובה)</span><input value={d.greeting} onChange={set('greeting')} className={field} placeholder={cart['x-apple'] ? 'ברכה למגש, ומה לחרוט על התפוח' : 'מזל טוב!'} /></label>
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
                <p className="text-note text-ink-soft">משלוח לפי אזור, יעודכן באישור ההזמנה</p>
                {error && <p role="alert" className="mt-2 text-note font-medium text-wine">{error}</p>}
                {/* TODO: payment provider (Morning / Meshulam) once Shlomi picks one */}
                <button disabled title="הסליקה תחובר בקרוב" className="mt-4 w-full cursor-not-allowed rounded-full bg-wine/40 py-3.5 font-medium text-cream">
                  לתשלום מאובטח · בקרוב
                </button>
                <button onClick={sendWa} className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-wine py-3.5 font-medium text-cream transition-colors hover:bg-plum">
                  <Icon name="whatsapp" /> לשלוח את ההזמנה בוואטסאפ
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
