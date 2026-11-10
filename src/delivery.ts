// Calendar: Hebcal Israel, Jerusalem candle-lighting convention (40 minutes).
// Revalidate on the server before charging when the production backend is connected.
export type CalendarEvent = { date: string; category: string; yomtov?: boolean; hebrew?: string };
export const israelDate = (now = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
export const israelHour = (now = new Date()) => Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jerusalem', hour: '2-digit', hourCycle: 'h23' }).format(now));
export function deliveryStatus(date: string, events: CalendarEvent[] | null, blocked: string[], now = new Date()) {
  const today = israelDate(now);
  if (!date) return { error: '', slot: '' };
  if (date < today) return { error: 'התאריך כבר עבר. בחרו יום אחר.', slot: '' };
  if (blocked.includes(date)) return { error: 'היום הזה מלא. נשמח להכין לכם מגש בתאריך אחר.', slot: '' };
  const weekday = new Date(date + 'T12:00:00Z').getUTCDay();
  if (weekday === 6) return { error: 'בשבת אין הזמנות או משלוחים. בחרו יום אחר.', slot: '' };
  if (!events) return { error: 'בודקים את לוח החגים וזמני האספקה. אם הבדיקה אינה זמינה, נסו שוב בהמשך.', slot: '' };
  const onDay = events.filter(e => e.date.slice(0, 10) === date);
  if (onDay.some(e => e.yomtov)) return { error: 'בחג אין הזמנות או משלוחים. בחרו יום אחר.', slot: '' };
  const todayClosed = new Date(today + 'T12:00:00Z').getUTCDay() === 6 || events.some(e => e.date.slice(0, 10) === today && e.yomtov);
  if (todayClosed) return { error: 'קבלת ההזמנות סגורה בשבת ובחג. אפשר לחזור ולהזמין ביום הפעילות הבא.', slot: '' };
  const candles = onDay.find(e => e.category === 'candles');
  if (weekday === 5 || candles) {
    if (weekday !== 5) return { error: 'לאספקה בערב חג נדרש תיאום עם שלומי לפני ההזמנה.', slot: '' };
    const previous = new Date(date + 'T12:00:00Z'); previous.setUTCDate(previous.getUTCDate() - 1);
    const cutoffDate = previous.toISOString().slice(0, 10);
    if (today > cutoffDate || (today === cutoffDate && israelHour(now) >= 12)) return { error: 'ההזמנות לשישי נסגרו בחמישי ב־12:00. בקשה חריגה אפשר לתאם עם שלומי.', slot: '' };
    if (!candles) return { error: 'זמן כניסת השבת עדיין לא זמין. נסו שוב בהמשך.', slot: '' };
    const end = new Date(new Date(candles.date).getTime() - 3 * 3600000);
    const time = new Intl.DateTimeFormat('he-IL', { timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit' }).format(end);
    return { error: '', slot: `עד ${time} · שלוש שעות לפני כניסת שבת` };
  }
  if (date === today && israelHour(now) >= 12) return { error: 'ההזמנות להיום נסגרו ב־12:00. בחרו את יום הפעילות הבא או תאריך מאוחר יותר.', slot: '' };
  return { error: '', slot: date === today ? 'בתוך 4–6 שעות מאישור ההזמנה' : '09:00–16:00' };
}
