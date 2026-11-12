import { createClient, type Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { availability, drinks, extras, img, money } from '../data';
import { israelDate } from '../delivery';
import { SUPABASE_KEY, SUPABASE_URL } from '../live';
import { Icon } from '../ui';

/* Shlomi's admin app (12.11.2026): orders with phone notifications, a "closed for today" switch,
   stock switches for add-ons and drinks, and full days to block. Installable on Android. */

const db = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true } });
const VAPID_PUBLIC = 'BNZiLMewPofph0rmX5h3CymRFjDvyGh6RYEi5-VvAE5ZCFt5rAyZEneuAa7IFCPBV0E0CSkBzC3HdCuLFVZRqJU';

type Order = { id: number; created_at: string; status: 'new' | 'in_progress' | 'done' | 'cancelled'; customer_name: string; customer_phone: string; delivery_date: string | null; delivery_slot: string | null; zone: string | null; total: number | null; message: string };
const STATUS: Record<Order['status'], { label: string; tone: string }> = {
  new: { label: 'חדשה', tone: 'bg-wine text-cream' },
  in_progress: { label: 'בהכנה', tone: 'bg-gold text-night' },
  done: { label: 'נמסרה', tone: 'bg-[#2f6b4f] text-cream' },
  cancelled: { label: 'בוטלה', tone: 'bg-ink/15 text-ink-soft' },
};
// What Shlomi can switch off: shakes, pralines, nuts, and every wine and liqueur
const STOCK_GROUPS = [
  { title: 'שייקים, פרלינים ופיצוחים', items: extras.filter(x => ['x-shake', 'x-shake-small', 'x-praline', 'x-nuts'].includes(x.id)).map(x => ({ id: x.id, name: x.name })) },
  { title: 'יינות', items: drinks.filter(x => x.group === 'יין').map(x => ({ id: x.id, name: x.name })) },
  { title: 'ליקרים', items: drinks.filter(x => x.group === 'ליקר').map(x => ({ id: x.id, name: x.name })) },
];
const shortDate = (d: string) => new Intl.DateTimeFormat('he-IL', { weekday: 'short', day: 'numeric', month: 'numeric', timeZone: 'UTC' }).format(new Date(d + 'T12:00:00Z'));
const card = 'rounded-3xl bg-white/80 p-4 shadow-[0_1px_0_rgb(42_20_36/0.06)]';
const SLOTS = availability.timeSlots; // 08:00-11:00, 11:00-14:00, 14:00-17:00, 17:00-20:00
const slotLabel = (x: string) => x.replace(/:00/g, '').replace('-', '–').replace(/^0/, '');

/* Closed time slots for one day, read and toggled straight in the database */
function useDaySlots(day: string | null) {
  const [shut, setShut] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (!day) return;
    db.from('blocked_slots').select('slot').eq('day', day).then(({ data }) => setShut(new Set((data ?? []).map(r => r.slot))));
  }, [day]);
  const toggle = async (slot: string) => {
    if (!day) return;
    const close = !shut.has(slot);
    setShut(s => { const n = new Set(s); if (close) n.add(slot); else n.delete(slot); return n; });
    const { error } = close ? await db.from('blocked_slots').insert({ day, slot }) : await db.from('blocked_slots').delete().eq('day', day).eq('slot', slot);
    if (error) alert('השינוי לא נשמר. נסו שוב.');
  };
  return { shut, toggle };
}

function SlotChips({ shut, toggle, disabled }: { shut: Set<string>; toggle: (s: string) => void; disabled?: boolean }) {
  return (
    <div role="group" aria-label="טווחי שעות" className="mt-2 grid grid-cols-4 gap-1.5">
      {SLOTS.map(x => (
        <button key={x} disabled={disabled} onClick={() => toggle(x)} aria-pressed={shut.has(x)}
          className={`rounded-xl py-2.5 text-note tabular-nums disabled:opacity-40 ${shut.has(x) ? 'bg-wine text-cream line-through decoration-cream/50' : 'bg-sand text-ink'}`}>
          <bdi dir="ltr">{slotLabel(x)}</bdi>
        </button>
      ))}
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    db.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = db.auth.onAuthStateChange((_e, s) => setSession(s));
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' }).catch(() => {});
    return () => data.subscription.unsubscribe();
  }, []);
  if (!ready) return <Shell><p className="py-20 text-center text-ink-soft">טוען...</p></Shell>;
  return <Shell>{session ? <Panel email={session.user.email ?? ''} /> : <Login />}</Shell>;
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-cream pb-28 text-ink">
      <header className="sticky top-0 z-20 bg-night px-5 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <img src={img('logo-gold.webp')} alt="האמנות שבפרי" className="w-24" />
          <span className="text-note text-mist">ניהול האתר</span>
        </div>
      </header>
      <div className="mx-auto max-w-xl px-4 pt-4">{children}</div>
    </div>
  );
}

/* ───────── Login: email and password. First time, the same form creates the password. ───────── */
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [first, setFirst] = useState(false);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg('');
    if (first) {
      const { error } = await db.auth.signUp({ email: email.trim().toLowerCase(), password, options: { emailRedirectTo: `${location.origin}/admin` } });
      setMsg(error ? 'המייל הזה לא מורשה, או שהסיסמה קצרה מדי (לפחות 8 תווים).' : 'שלחנו לך מייל לאישור. אחרי האישור חוזרים לכאן ונכנסים.');
    } else {
      const { error } = await db.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (error) setMsg('המייל או הסיסמה לא נכונים. אם זו הפעם הראשונה, בחרו "כניסה ראשונה".');
    }
    setBusy(false);
  };
  const field = 'w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-ink focus:border-wine focus:outline-none';
  return (
    <form onSubmit={submit} className={`${card} mt-8 space-y-4 p-6`}>
      <h1 className="font-display text-section font-bold leading-none">{first ? 'כניסה ראשונה' : 'כניסה'}</h1>
      <label className="block"><span className="mb-1 block text-note text-ink-soft">מייל</span><input type="email" dir="ltr" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className={field} /></label>
      <label className="block"><span className="mb-1 block text-note text-ink-soft">{first ? 'בחירת סיסמה (לפחות 8 תווים)' : 'סיסמה'}</span><input type="password" dir="ltr" autoComplete={first ? 'new-password' : 'current-password'} required minLength={first ? 8 : 1} value={password} onChange={e => setPassword(e.target.value)} className={field} /></label>
      {msg && <p role="alert" className="text-note font-medium text-wine">{msg}</p>}
      <button disabled={busy} className="w-full rounded-full bg-wine py-3.5 font-medium text-cream disabled:opacity-50">{first ? 'יצירת סיסמה' : 'כניסה'}</button>
      <button type="button" onClick={() => { setFirst(f => !f); setMsg(''); }} className="w-full text-note text-wine underline underline-offset-4">{first ? 'כבר יש לי סיסמה' : 'כניסה ראשונה? יצירת סיסמה'}</button>
    </form>
  );
}

/* ───────── The panel ───────── */
function Panel({ email }: { email: string }) {
  const [tab, setTab] = useState<'orders' | 'stock' | 'days'>('orders');
  return (
    <>
      <ClosedToday />
      <div className="mt-4">
        {tab === 'orders' && <Orders />}
        {tab === 'stock' && <Stock />}
        {tab === 'days' && <Days />}
      </div>
      <Notifications />
      <InstallHint />
      <p className="mt-6 text-center text-note text-ink-soft">מחובר/ת בתור <bdi dir="ltr">{email}</bdi> · <button onClick={() => db.auth.signOut()} className="underline underline-offset-4">יציאה</button></p>
      <nav aria-label="מסכים" className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-cream/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        <div className="mx-auto grid max-w-xl grid-cols-3 px-4">
          {([['orders', 'הזמנות'], ['stock', 'מלאי'], ['days', 'ימים ושעות']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined}
              className={`rounded-2xl py-3 font-medium ${tab === id ? 'bg-wine text-cream' : 'text-ink-soft'}`}>{label}</button>
          ))}
        </div>
      </nav>
    </>
  );
}

/* One big switch: closes ordering for today on the site, reopens by itself tomorrow */
function ClosedToday() {
  const today = israelDate();
  const [closed, setClosed] = useState<boolean | null>(null);
  const load = useCallback(() => db.from('site_settings').select('closed_today').eq('id', 1).single().then(({ data }) => setClosed(data?.closed_today === today)), [today]);
  useEffect(() => { load(); }, [load]);
  const toggle = async () => {
    const next = !closed; setClosed(next);
    const { error } = await db.from('site_settings').update({ closed_today: next ? today : null, updated_at: new Date().toISOString() }).eq('id', 1);
    if (error) { setClosed(!next); alert('השינוי לא נשמר. נסו שוב.'); }
  };
  const { shut, toggle: toggleSlot } = useDaySlots(today);
  return (
    <div className="space-y-2">
    <button onClick={toggle} disabled={closed === null} role="switch" aria-checked={!!closed}
      className={`flex w-full items-center justify-between gap-4 rounded-3xl p-5 text-right transition-colors ${closed ? 'bg-wine text-cream' : 'bg-white/80 text-ink'}`}>
      <span>
        <span className="block font-display text-sub font-bold">{closed ? 'ההזמנות להיום סגורות' : 'מקבלים הזמנות להיום'}</span>
        <span className={`block text-note ${closed ? 'text-cream/80' : 'text-ink-soft'}`}>{closed ? 'לקוחות רואים הודעה ויכולים להזמין לימים הבאים. נפתח מחדש מחר בבוקר.' : 'לחיצה סוגרת הזמנות להיום בלבד.'}</span>
      </span>
      <span aria-hidden className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${closed ? 'bg-cream/30' : 'bg-ink/15'}`}>
        <span className={`absolute top-1 size-6 rounded-full bg-white shadow transition-all ${closed ? 'left-1' : 'left-7'}`} />
      </span>
    </button>
    {!closed && (
      <div className="rounded-3xl bg-white/80 px-5 py-4">
        <p className="text-note text-ink-soft">או לסגור רק חלק מהשעות היום:</p>
        <SlotChips shut={shut} toggle={toggleSlot} />
      </div>
    )}
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [openId, setOpenId] = useState<number | null>(() => Number(location.hash.match(/order-(\d+)/)?.[1]) || null);
  const load = useCallback(() => db.from('orders').select('*').order('created_at', { ascending: false }).limit(100).then(({ data }) => setOrders((data as Order[]) ?? [])), []);
  useEffect(() => {
    load();
    const ch = db.channel('orders').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, () => load()).subscribe();
    const back = () => document.visibilityState === 'visible' && load();
    const hash = () => setOpenId(Number(location.hash.match(/order-(\d+)/)?.[1]) || null);
    document.addEventListener('visibilitychange', back); window.addEventListener('hashchange', hash);
    return () => { db.removeChannel(ch); document.removeEventListener('visibilitychange', back); window.removeEventListener('hashchange', hash); };
  }, [load]);
  const setStatus = async (id: number, status: Order['status']) => {
    setOrders(o => o?.map(x => (x.id === id ? { ...x, status } : x)) ?? null);
    await db.from('orders').update({ status }).eq('id', id);
  };
  if (!orders) return <p className="py-10 text-center text-ink-soft">טוען הזמנות...</p>;
  if (!orders.length) return <p className={`${card} text-center text-ink-soft`}>עוד אין הזמנות מהאתר. כשתגיע הזמנה, היא תופיע כאן ותקבל התראה.</p>;
  const fresh = orders.filter(o => o.status === 'new').length;
  return (
    <section aria-label="הזמנות" className="space-y-3">
      <div className="flex items-baseline justify-between px-1">
        <h1 className="font-display text-sub font-bold">הזמנות</h1>
        <button onClick={load} className="text-note text-wine underline underline-offset-4">רענון</button>
      </div>
      {fresh > 0 && <p className="px-1 text-note text-wine">{fresh === 1 ? 'הזמנה חדשה אחת מחכה' : `${fresh} הזמנות חדשות מחכות`}</p>}
      {orders.map(o => {
        const isOpen = openId === o.id;
        const wa = '972' + o.customer_phone.replace(/\D/g, '').replace(/^0/, '');
        return (
          <article key={o.id} id={`order-${o.id}`} className={card}>
            <button onClick={() => setOpenId(isOpen ? null : o.id)} aria-expanded={isOpen} className="flex w-full items-start justify-between gap-3 text-right">
              <span>
                <span className="block font-medium">#{o.id} · {o.customer_name}</span>
                <span className="block text-note text-ink-soft">{[o.delivery_date && shortDate(o.delivery_date), o.delivery_slot, o.zone].filter(Boolean).join(' · ')}</span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-1">
                <span className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium ${STATUS[o.status].tone}`}>{STATUS[o.status].label}</span>
                {o.total ? <span className="text-note font-medium">{money(o.total)}</span> : null}
              </span>
            </button>
            {isOpen && (
              <div className="mt-3 border-t border-ink/10 pt-3">
                <p className="whitespace-pre-wrap text-note leading-relaxed">{o.message}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#25d366] px-4 py-2 text-note font-medium text-white"><Icon name="whatsapp-logo" className="size-4" />וואטסאפ ללקוח</a>
                  <a href={`tel:${o.customer_phone}`} className="rounded-full border border-ink/20 px-4 py-2 text-note font-medium">חיוג</a>
                </div>
                <div role="group" aria-label="סטטוס" className="mt-3 grid grid-cols-4 gap-1.5">
                  {(Object.keys(STATUS) as Order['status'][]).map(s => (
                    <button key={s} onClick={() => setStatus(o.id, s)} aria-pressed={o.status === s}
                      className={`rounded-xl py-2 text-note ${o.status === s ? STATUS[s].tone : 'bg-sand text-ink-soft'}`}>{STATUS[s].label}</button>
                  ))}
                </div>
                <p className="mt-2 text-[0.75rem] text-ink-soft">התקבלה {new Date(o.created_at).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' })}</p>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}

function Stock() {
  const [off, setOff] = useState<Set<string> | null>(null);
  useEffect(() => { db.from('stock').select('id').eq('available', false).then(({ data }) => setOff(new Set((data ?? []).map(r => r.id)))); }, []);
  const toggle = async (id: string) => {
    const nowOff = !off!.has(id);
    setOff(s => { const n = new Set(s); if (nowOff) n.add(id); else n.delete(id); return n; });
    const { error } = await db.from('stock').upsert({ id, available: !nowOff, updated_at: new Date().toISOString() });
    if (error) { alert('השינוי לא נשמר. נסו שוב.'); setOff(s => { const n = new Set(s); if (nowOff) n.delete(id); else n.add(id); return n; }); }
  };
  if (!off) return <p className="py-10 text-center text-ink-soft">טוען מלאי...</p>;
  return (
    <section aria-label="מלאי" className="space-y-4">
      <p className="px-1 text-note text-ink-soft">מה שכבוי מופיע באתר כ"אזל כרגע" ואי אפשר להזמין אותו.</p>
      {STOCK_GROUPS.map(g => (
        <div key={g.title} className={card}>
          <h2 className="mb-1 font-display text-sub font-bold">{g.title}</h2>
          <ul>
            {g.items.map(i => {
              const on = !off.has(i.id);
              return (
                <li key={i.id} className="border-t border-ink/10 first:border-0">
                  <button role="switch" aria-checked={on} onClick={() => toggle(i.id)} className="flex w-full items-center justify-between gap-3 py-3 text-right">
                    <span className={on ? '' : 'text-ink-soft line-through decoration-ink/30'}>{i.name}</span>
                    <span className="flex items-center gap-2 text-note">
                      <span className={on ? 'text-[#2f6b4f]' : 'text-wine'}>{on ? 'במלאי' : 'אזל'}</span>
                      <span aria-hidden className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-[#2f6b4f]' : 'bg-ink/20'}`}><span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${on ? 'left-0.5' : 'left-[1.375rem]'}`} /></span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}

/* Tap a day to pick it, then close the whole day or only some time slots. This month and the next, like the site. */
function Days() {
  const today = israelDate();
  const [blocked, setBlocked] = useState<Set<string> | null>(null);
  const [partial, setPartial] = useState<Record<string, number>>({});
  const [offset, setOffset] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const { shut, toggle: toggleSlot } = useDaySlots(picked);
  const load = useCallback(() => {
    db.from('blocked_dates').select('day').gte('day', today).then(({ data }) => setBlocked(new Set((data ?? []).map(r => r.day))));
    db.from('blocked_slots').select('day').gte('day', today).then(({ data }) => setPartial((data ?? []).reduce<Record<string, number>>((m, r) => ((m[r.day] = (m[r.day] ?? 0) + 1), m), {})));
  }, [today]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (picked) setPartial(p => ({ ...p, [picked]: shut.size })); }, [shut, picked]);
  useEffect(() => { if (picked) document.getElementById('day-editor')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [picked]);
  const [ty, tm] = today.split('-').map(Number);
  const year = ty + Math.floor((tm - 1 + offset) / 12), month = (tm - 1 + offset) % 12;
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const iso = (dd: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
  const title = new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month, 15)));
  const toggleDay = async (day: string) => {
    const close = !blocked!.has(day);
    setBlocked(s => { const n = new Set(s); if (close) n.add(day); else n.delete(day); return n; });
    const { error } = close ? await db.from('blocked_dates').insert({ day }) : await db.from('blocked_dates').delete().eq('day', day);
    if (error) alert('השינוי לא נשמר. נסו שוב.');
  };
  const list = useMemo(() => [...new Set([...(blocked ?? []), ...Object.keys(partial).filter(k => partial[k] > 0)])].sort(), [blocked, partial]);
  if (!blocked) return <p className="py-10 text-center text-ink-soft">טוען...</p>;
  const pickedClosed = !!picked && blocked.has(picked);
  return (
    <section aria-label="ימים ושעות סגורים" className="space-y-4">
      <p className="px-1 text-note text-ink-soft">בוחרים יום, ואז סוגרים את כולו או רק חלק מהשעות. שבתות וחגים כבר סגורים אוטומטית.</p>
      <div className={card}>
        <div className="mb-2 flex items-center justify-between">
          <button onClick={() => setOffset(0)} disabled={offset === 0} aria-label="החודש הקודם" className="grid size-10 place-items-center rounded-full disabled:opacity-25"><Icon name="arrow" className="size-5 rotate-180" /></button>
          <p className="font-medium" aria-live="polite">{title}</p>
          <button onClick={() => setOffset(1)} disabled={offset === 1} aria-label="החודש הבא" className="grid size-10 place-items-center rounded-full disabled:opacity-25"><Icon name="arrow" className="size-5" /></button>
        </div>
        <div className="grid grid-cols-7 text-center text-[0.75rem] text-ink-soft">{['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'].map(x => <span key={x} className="py-1">{x}</span>)}</div>
        <div className="grid grid-cols-7 gap-y-1.5 text-center">
          {Array.from({ length: first }, (_, k) => <span key={'e' + k} />)}
          {Array.from({ length: days }, (_, k) => {
            const day = iso(k + 1), past = day < today, sat = new Date(day + 'T12:00:00Z').getUTCDay() === 6;
            const full = blocked.has(day), some = !full && (partial[day] ?? 0) > 0, isPicked = picked === day;
            return (
              <button key={day} disabled={past || sat} onClick={() => setPicked(isPicked ? null : day)} aria-pressed={isPicked}
                aria-label={`${k + 1}${full ? ', סגור' : some ? ', סגור חלקית' : ''}`}
                className={`relative mx-auto grid size-10 place-items-center rounded-full tabular-nums disabled:text-ink/25 ${full ? 'bg-wine font-medium text-cream' : 'hover:bg-sand'} ${isPicked ? 'ring-2 ring-gold ring-offset-2 ring-offset-white' : day === today && !full ? 'ring-1 ring-wine/50' : ''}`}>
                {k + 1}
                {some && <span aria-hidden className="absolute bottom-1 size-1.5 rounded-full bg-wine" />}
              </button>
            );
          })}
        </div>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.75rem] text-ink-soft">
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-wine" />סגור כל היום</span>
          <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-wine" />חלק מהשעות סגורות</span>
        </p>
      </div>
      {picked && (
        <div id="day-editor" className={card}>
          <h2 className="font-display text-sub font-bold">{shortDate(picked)}</h2>
          <button role="switch" aria-checked={pickedClosed} onClick={() => toggleDay(picked)}
            className={`mt-2 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-right ${pickedClosed ? 'bg-wine text-cream' : 'bg-sand'}`}>
            <span className="font-medium">{pickedClosed ? 'כל היום סגור' : 'לסגור את כל היום'}</span>
            <span aria-hidden className={`relative h-6 w-11 rounded-full ${pickedClosed ? 'bg-cream/30' : 'bg-ink/20'}`}><span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${pickedClosed ? 'left-0.5' : 'left-[1.375rem]'}`} /></span>
          </button>
          <p className="mt-3 text-note text-ink-soft">{pickedClosed ? 'כשכל היום סגור, השעות לא משנות.' : 'או לסגור רק חלק מהשעות:'}</p>
          <SlotChips shut={shut} toggle={toggleSlot} disabled={pickedClosed} />
        </div>
      )}
      <div className={card}>
        <h2 className="font-display text-sub font-bold">סגור בימים הקרובים</h2>
        {list.length ? (
          <ul className="mt-2">{list.map(dd => (
            <li key={dd} className="flex items-center justify-between border-t border-ink/10 py-2.5 first:border-0">
              <span>{shortDate(dd)} <span className="text-note text-ink-soft">· {blocked.has(dd) ? 'כל היום' : `${partial[dd]} טווחי שעות`}</span></span>
              <button onClick={() => setPicked(dd)} className="text-note text-wine underline underline-offset-4">עריכה</button>
            </li>
          ))}</ul>
        ) : <p className="mt-1 text-note text-ink-soft">אין ימים או שעות סגורים.</p>}
      </div>
    </section>
  );
}

/* Turn on order notifications on this phone */
function Notifications() {
  const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  const [state, setState] = useState<'checking' | 'on' | 'off' | 'blocked'>('checking');
  useEffect(() => {
    if (!supported) return;
    if (Notification.permission === 'denied') { setState('blocked'); return; }
    navigator.serviceWorker.ready.then(r => r.pushManager.getSubscription()).then(s => setState(s ? 'on' : 'off'));
  }, [supported]);
  const enable = async () => {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { setState(perm === 'denied' ? 'blocked' : 'off'); return; }
    const reg = await navigator.serviceWorker.ready;
    const key = Uint8Array.from(atob(VAPID_PUBLIC.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
    const j = sub.toJSON();
    const { data } = await db.auth.getUser();
    const { error } = await db.from('push_subscriptions').upsert({ endpoint: j.endpoint!, p256dh: j.keys!.p256dh, auth: j.keys!.auth, email: data.user?.email });
    setState(error ? 'off' : 'on');
    if (error) alert('ההתראות לא נשמרו. נסו שוב.');
  };
  if (!supported) return <p className={`${card} mt-4 text-note text-ink-soft`}>הדפדפן הזה לא תומך בהתראות. בטלפון אנדרואיד, פתחו את הקישור בכרום והתקינו את האפליקציה.</p>;
  return (
    <div className={`${card} mt-4 flex items-center justify-between gap-3`}>
      <span>
        <span className="block font-medium">התראות על הזמנות</span>
        <span className="block text-note text-ink-soft">{state === 'on' ? 'פעיל בטלפון הזה. כל הזמנה מהאתר תקפוץ כהתראה.' : state === 'blocked' ? 'ההתראות חסומות. פתחו את הגדרות האתר בכרום ואפשרו התראות.' : 'הפעילו כדי לקבל התראה על כל הזמנה חדשה.'}</span>
      </span>
      {(state === 'off' || state === 'checking') && <button onClick={enable} className="shrink-0 rounded-full bg-wine px-4 py-2.5 text-note font-medium text-cream">הפעלה</button>}
      {state === 'on' && <span className="shrink-0 rounded-full bg-[#2f6b4f] px-3 py-1 text-note text-cream">פעיל</span>}
    </div>
  );
}

/* Android: offer "install as an app" when Chrome allows it */
type InstallEvent = Event & { prompt: () => Promise<void> };
function InstallHint() {
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  useEffect(() => {
    const on = (e: Event) => { e.preventDefault(); setEvt(e as InstallEvent); };
    window.addEventListener('beforeinstallprompt', on);
    return () => window.removeEventListener('beforeinstallprompt', on);
  }, []);
  if (!evt) return null;
  return (
    <button onClick={() => { evt.prompt(); setEvt(null); }} className={`${card} mt-4 flex w-full items-center justify-between text-right`}>
      <span><span className="block font-medium">התקנה כאפליקציה</span><span className="block text-note text-ink-soft">אייקון במסך הבית, נפתח בלי דפדפן.</span></span>
      <span className="rounded-full bg-wine px-4 py-2.5 text-note font-medium text-cream">התקנה</span>
    </button>
  );
}
