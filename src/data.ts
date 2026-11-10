// Everything Shlomi still needs to confirm lives here, so swapping is one place.
export const img = (p: string) => `${import.meta.env.BASE_URL}img/${p}`;

export const business = {
  name: 'האמנות שבפרי',
  owner: 'שלומי ברגר',
  // TODO: מספר וואטסאפ אמיתי של שלומי (פורמט בינלאומי בלי +)
  whatsapp: '972500000000',
  phoneDisplay: '050-000-0000',
  instagram: '#', // TODO
  areas: ['ירושלים', 'גבעת זאב', 'מודיעין'],
  fromPrice: 285,
};

// Delivery prices from Shlomi (2.11). TODO: confirm Modiin, he wrote "7" and it's probably 70.
export const zones = [
  { id: 'pickup', label: 'איסוף עצמי', price: 0 },
  { id: 'givat-zeev', label: 'גבעת זאב', price: 30 },
  { id: 'jerusalem', label: 'ירושלים', price: 65 },
  { id: 'modiin', label: 'מודיעין', price: 70 },
  { id: 'center', label: 'מרכז ובית שמש', price: 180 },
  { id: 'other', label: 'אזור אחר, שלומי יבדוק', price: null as number | null },
];

// Shlomi changes these himself before holidays and busy days.
export const availability = {
  // Dates with no orders at all, as 'YYYY-MM-DD'
  blockedDates: [] as string[],
  // Minimum order in ₪. Default is the smallest tray, holidays can raise it.
  minOrder: 285,
  // TODO: delivery hour windows, Shlomi wants to sit on this (like his colleague's site)
  timeSlots: ['8:00-11:00', '11:00-14:00', '14:00-17:00', '17:00-20:00'],
};

export type Category = 'round' | 'rect' | 'special';
export type Product = { id: string; name: string; size: string; price: number; category: Category; serves: string; from?: boolean };

// Prices from the price list Shlomi sent. "serves" is an estimate, TODO: confirm with Shlomi.
const raw: [string, string, number, Category, string, boolean?][] = [
  ['עיגול קלאסי', 'קוטר 30 ס״מ', 285, 'round', '6-8'],
  ['מרובע', '30 × 30 ס״מ', 300, 'rect', '6-8'],
  ['אליפסה בינונית', 'אליפסה בינונית', 320, 'round', '8-10'],
  ['לב', 'מגש בצורת לב', 320, 'special', '6-8'],
  ['עיגול', 'קוטר 35 ס״מ', 350, 'round', '8-10'],
  ['אליפסה גדולה', 'אליפסה גדולה', 400, 'round', '10-12'],
  ['מלבן', '48 × 20 ס״מ', 420, 'rect', '10-12'],
  ['עיגול גדול', 'קוטר 40 ס״מ', 450, 'round', '12-15'],
  ['מלבן', '55 × 23 ס״מ', 470, 'rect', '12-15'],
  ['סירה', 'מגש בצורת סירה', 530, 'special', '12-15'],
  ['עיגול ענק', 'קוטר 45 ס״מ', 580, 'round', '15-20'],
  ['אליפסה ענקית', 'אליפסה ענקית', 600, 'round', '15-20'],
  ['מלבן', '50 × 30 ס״מ', 620, 'rect', '15-20'],
  ['מלבן', '60 × 30 ס״מ', 650, 'rect', '18-22'],
  ['לב ענק', 'לב גדול במיוחד', 750, 'special', '18-22'],
  ['מלבן', '70 × 35 ס״מ', 870, 'rect', '22-28'],
  ['מלבן', '85 × 30 ס״מ', 950, 'rect', '25-30'],
  ['מלבן', '100 × 30 ס״מ', 1100, 'rect', '30-35'],
  ['מלבן לאירוע', '100 × 50 ס״מ', 1600, 'rect', '40-50'],
  ['מלבן לאירוע', '130 × 50 ס״מ', 2100, 'rect', '55-70'],
  ['סירת עץ', '70 × 25 ס״מ', 800, 'special', '20-25', true],
  ['סירת עץ גדולה', '100 × 35 ס״מ', 1350, 'special', '35-45', true],
];

export const products: Product[] = raw.map(([name, size, price, category, serves, from], i) => ({
  id: 'p' + i, name, size, price, category, serves, from,
}));

export const categories: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'כל המגשים' },
  { id: 'round', label: 'עגולים ואליפסות' },
  { id: 'rect', label: 'מלבנים' },
  { id: 'special', label: 'צורות מיוחדות' },
];

export type Extra = { id: string; name: string; note: string; price: number | null; from?: boolean };
export const extras: Extra[] = [
  { id: 'x-apple', name: 'תפוח מגולף', note: 'ברכה חרוטה על המגש', price: 40, from: true },
  { id: 'x-praline', name: 'פרלינים', note: 'ליחידה', price: 12 },
  { id: 'x-nuts', name: 'פיצוחים', note: 'מחיר לפי גודל', price: null },
  { id: 'x-wine', name: 'בקבוק יין', note: 'לפי בחירה, מחיר בתיאום', price: null },
  { id: 'x-carve', name: 'אבטיח מגולף', note: 'ברכה, שם או ציור, מגולפים ביד', price: 420, from: true },
  { id: 'x-bouquet', name: 'זר פירות', note: 'זר מפירות טריים במקום פרחים', price: 350, from: true },
  { id: 'x-shake', name: 'שייק פירות 250 מ״ל', note: 'סחוט טרי', price: 26 },
];

export const works = [
  { src: img('real-platter.webp'), title: 'מגש בר מצווה', text: 'אבטיח מגולף עם ספר תורה, ומסביב פרחים מפפאיה, ליצ׳י ותפוחים.', tag: 'גילוף אישי' },
  { src: img('real-bouquet.webp'), title: 'זר פירות על מגש', text: 'זר מפסיפלורה, תות וקיווי, עם ורד ממנגו בחזית.', tag: 'זרי פירות' },
];

// Event services Shlomi listed. TODO: confirm wording of "קאייקי פירות".
export const eventServices = [
  { n: '01', title: 'שולחנות פירות לאירוע', text: 'בר מצווה, חתונה, ברית או כנס. שולחן שלם שנבנה במקום, עם גילופים במרכז.' },
  { n: '02', title: 'בר פירות', text: 'עמדה מעוצבת שהאורחים ניגשים אליה, עם פירות חתוכים, שייקים ופינוקים.' },
  { n: '03', title: 'עוגות פירות', text: 'עוגה שכולה פרי, לימי הולדת ולמי שמחפש משהו מתוק אחר.' },
  { n: '04', title: 'מארזים לעסקים ולחגים', text: 'מגשים עם פרלינים, פיצוחים ויין, ללקוחות, לספקים או לצוות. משלוח לכמה כתובות בתיאום.' },
];

// TODO: real answers from Shlomi. Kashrut is a placeholder until he confirms.
export const faq = [
  { q: 'כמה זמן מראש צריך להזמין?', a: 'בימי חול מזמינים עד 12:00 לאספקה באותו יום, בתוך 4–6 שעות ובכפוף לזמינות. אחרי 12:00 בוחרים יום פעילות עתידי. לשישי מזמינים עד חמישי ב־12:00; האספקה עד שלוש שעות לפני כניסת שבת. ערבי חג בתיאום, ובשבת ובחג אין פעילות.' },
  { q: 'כמה עולה משלוח?', a: 'גבעת זאב 30 ₪, ירושלים 65 ₪, מודיעין 70 ₪, ומרכז ובית שמש 180 ₪. אפשר גם לאסוף בעצמכם בלי עלות. לאזור אחר כותבים בהזמנה ושלומי בודק.' },
  { q: 'איך יודעים אם יש מקום בתאריך שלי?', a: 'בוחרים אזור ותאריך בהזמנה ורואים את שעות האספקה המתאימות. תאריכים חסומים, שבתות וחגים אינם זמינים. בקשות מיוחדות מתאמים עם שלומי.' },
  { q: 'אפשר לשלוח מגש למישהו אחר?', a: 'בדיוק בשביל זה יש בהזמנה שם וטלפון של מי שמקבל. ואם אתם לא בטוחים בכתובת, מסמנים ושלומי מתאם איתו ישירות.' },
  { q: 'המגש ייראה בדיוק כמו בתמונה?', a: 'כל מגש מעוצב ביד ומתאים את עצמו לפירות הכי טובים של העונה. הצורה, הגודל והסגנון נשארים, והצבעים תמיד מפתיעים לטובה.' },
  { q: 'אפשר להוסיף ברכה או שם?', a: 'בטח. כותבים את הברכה בהזמנה, ואפשר להוסיף אבטיח מגולף עם שם או ציור.' },
  { q: 'יש כשרות?', a: 'כאן תיכנס התשובה של שלומי לגבי כשרות.' },
  { q: 'איך משלמים?', a: 'התשלום באתר עדיין בהקמה. בינתיים אפשר להכין את פרטי ההזמנה ולתאם עם שלומי. להזמנות בהתאמה אישית מקבלים הצעת מחיר לפני תשלום.' },
];

// Placeholders until real quotes arrive (shown as dashed cards).
export const testimonials: { quote: string; who: string }[] = [];

export const waLink = (text: string) => `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;
export const money = (n: number) => n.toLocaleString('he-IL') + ' ₪';
