// Calendar: Hebcal Israel, Jerusalem candle-lighting convention (40 minutes).
// Revalidate on the server before charging when the production backend is connected.
// Rules from Shlomi (11.11): same day until 16:00, Friday until Thursday 20:00,
// holiday eves until 20:00 the evening before. Pickup 12:00-18:00.
import { availability } from './data';

export type CalendarEvent = { date: string; category: string; yomtov?: boolean; hebrew?: string };
export const israelDate = (now = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
export const israelHour = (now = new Date()) => Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jerusalem', hour: '2-digit', hourCycle: 'h23' }).format(now));
const israelTime = (d: Date) => new Intl.DateTimeFormat('he-IL', { timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d);
const hours = (t: string) => { const [h, m] = t.split(':').map(Number); return h + m / 60; };
const pad = (h: number) => `${String(h).padStart(2, '0')}:00`;

type Status = { error: string; slots: string[]; note: string };
const fail = (error: string): Status => ({ error, slots: [], note: '' });

export function deliveryStatus(date: string, events: CalendarEvent[] | null, blocked: string[], now = new Date(), pickup = false): Status {
  const today = israelDate(now);
  const hour = israelHour(now);
  if (!date) return { error: '', slots: [], note: '' };
  if (date < today) return fail('התאריך כבר עבר. בחרו יום אחר.');
  if (blocked.includes(date)) return fail('היום הזה מלא. נשמח להכין לכם מגש בתאריך אחר.');
  const weekday = new Date(date + 'T12:00:00Z').getUTCDay();
  if (weekday === 6) return fail('בשבת אין הזמנות או משלוחים. בחרו יום אחר.');
  if (!events) return fail('בודקים את לוח החגים וזמני האספקה. אם הבדיקה אינה זמינה, נסו שוב בהמשך.');
  const onDay = events.filter(e => e.date.slice(0, 10) === date);
  if (onDay.some(e => e.yomtov)) return fail('בחג אין הזמנות או משלוחים. בחרו יום אחר.');
  const todayClosed = new Date(today + 'T12:00:00Z').getUTCDay() === 6 || events.some(e => e.date.slice(0, 10) === today && e.yomtov);
  if (todayClosed) return fail('קבלת ההזמנות סגורה בשבת ובחג. אפשר לחזור ולהזמין ביום הפעילות הבא.');

  // Latest hour the day allows. On Friday and holiday eves: three hours before candle lighting.
  let end = 24;
  let note = '';
  const candles = onDay.find(e => e.category === 'candles');
  if (weekday === 5 || candles) {
    const previous = new Date(date + 'T12:00:00Z'); previous.setUTCDate(previous.getUTCDate() - 1);
    const cutoffDate = previous.toISOString().slice(0, 10);
    if (today > cutoffDate || (today === cutoffDate && hour >= 20)) {
      return fail(weekday === 5 ? 'ההזמנות לשישי נסגרו בחמישי ב־20:00. בקשה חריגה אפשר לתאם עם שלומי.' : 'ההזמנות לערב חג נסגרו ב־20:00 בערב שלפני. בקשה חריגה אפשר לתאם עם שלומי.');
    }
    if (!candles) return fail('זמן כניסת השבת עדיין לא זמין. נסו שוב בהמשך.');
    const last = new Date(new Date(candles.date).getTime() - 3 * 3600000);
    end = hours(israelTime(last));
    note = `${weekday === 5 ? 'ביום שישי' : 'בערב חג'} מסיימים עד ${israelTime(last)}, שלוש שעות לפני כניסת ${weekday === 5 ? 'שבת' : 'החג'}.`;
  } else if (date === today && hour >= 16) {
    return fail('ההזמנות להיום נסגרו ב־16:00. בחרו את יום הפעילות הבא או תאריך מאוחר יותר.');
  }

  if (pickup) {
    const [open, close] = availability.pickupHours;
    const from = date === today ? Math.max(open, hour + 1) : open;
    const until = Math.min(close, end);
    if (until <= from) return fail('ביום הזה כבר אין איסוף עצמי. בחרו יום אחר.');
    const untilLabel = until === close ? pad(close) : israelTime(new Date(new Date(candles!.date).getTime() - 3 * 3600000));
    return { error: '', slots: [`איסוף בין ${pad(from)} ל־${untilLabel}`], note };
  }

  const slots = availability.timeSlots.filter(s => {
    const [a, b] = s.split('-').map(hours);
    return b <= end && (date !== today || a > hour);
  });
  if (!slots.length) return fail('ביום הזה לא נשארו טווחי שעות פנויים. בחרו יום אחר.');
  return { error: '', slots, note };
}
