// Everything Shlomi still needs to confirm lives here, so swapping is one place.
export const img = (p: string) => `${import.meta.env.BASE_URL}img/${p}`;

export const business = {
  name: 'האמנות שבפרי',
  owner: 'שלומי ברגר',
  // Shlomi's number (Chaya, 12.11)
  whatsapp: '972545730608',
  phoneDisplay: '054-573-0608',
  instagram: 'https://www.instagram.com/slomobr/',
  areas: ['ירושלים', 'גבעת זאב', 'מודיעין'],
  fromPrice: 285,
};

// Kashrut and cancellation (Shlomi via Chaya, 12.11). Shown in the cart, the footer and the legal pages.
export const kashrut = 'הפירות בהכשר בד״ץ העדה החרדית והרב אפרתי';
export const cancelPolicy = 'אפשר לבטל עד 24 שעות לפני מועד המשלוח או האיסוף, והכסף יוחזר. הזמנה לאותו יום אי אפשר לבטל.';

// Delivery prices from Shlomi (2.11, updated 11.11). TODO: confirm Modiin, he wrote "7" and it's probably 70.
// "other" = anywhere in the country, only for orders over 1,200 ₪, priced by distance.
export type Zone = { id: string; label: string; price: number | null; note?: string; minSubtotal?: number; hospital?: boolean };
export const pickupAddress = 'רחוב הכינור, גבעת זאב';
export const zones: Zone[] = [
  { id: 'pickup', label: 'איסוף עצמי', price: 0, note: 'רחוב הכינור, גבעת זאב' },
  { id: 'givat-zeev', label: 'גבעת זאב', price: 30 },
  { id: 'jerusalem', label: 'ירושלים', price: 65 },
  // Hospitals (Shlomi, 12.11)
  { id: 'hadassah-scopus', label: 'הדסה הר הצופים', price: 100, note: 'בית החולים', hospital: true },
  { id: 'shaare-zedek', label: 'שערי צדק', price: 100, note: 'בית החולים', hospital: true },
  { id: 'hadassah-ein-kerem', label: 'הדסה עין כרם', price: 120, note: 'בית החולים', hospital: true },
  { id: 'mevaseret', label: 'מבשרת ופרוזדור ירושלים', price: 100 },
  { id: 'modiin', label: 'מודיעין', price: 70 },
  { id: 'beit-shemesh', label: 'בית שמש וביתר', price: 180 },
  { id: 'other', label: 'לכל חלקי הארץ', price: null, note: 'בהזמנה מעל 1,200 ₪, מחיר לפי מיקום ומרחק', minSubtotal: 1200 },
];

// Shlomi changes these himself before holidays and busy days.
export const availability = {
  // Dates with no orders at all, as 'YYYY-MM-DD'
  blockedDates: [] as string[],
  // Minimum order in ₪. Default is the smallest tray, holidays can raise it.
  minOrder: 285,
  // Delivery windows the customer picks from (Shlomi, 11.11)
  timeSlots: ['08:00-11:00', '11:00-14:00', '14:00-17:00', '17:00-20:00'],
  // Self pickup from רחוב הכינור, גבעת זאב
  pickupHours: [12, 18] as [number, number],
};

export type Category = 'round' | 'rect' | 'special';
export type Product = { id: string; name: string; size: string; price: number; category: Category; serves: string; from?: boolean; large: boolean };

// Prices from Shlomi's updated list (11.11). "serves" is an estimate, TODO: confirm with Shlomi.
// The index is the photo id (catalog/p<i>.webp), so keep the order and sort below.
const raw: [string, string, number, Category, string, boolean?][] = [
  ['עיגול קלאסי', 'קוטר 30 ס״מ', 285, 'round', '6-8'],
  ['מרובע', '30 × 30 ס״מ', 300, 'rect', '6-8'],
  ['אליפסה בינונית', 'אליפסה בינונית', 340, 'round', '8-10'],
  ['לב', 'מגש בצורת לב', 320, 'special', '6-8'],
  ['עיגול', 'קוטר 35 ס״מ', 370, 'round', '8-10'],
  ['אליפסה גדולה', 'אליפסה גדולה', 430, 'round', '10-12'],
  ['מלבן', '48 × 20 ס״מ', 400, 'rect', '10-12'],
  ['עיגול גדול', 'קוטר 40 ס״מ', 480, 'round', '12-15'],
  ['מלבן', '55 × 23 ס״מ', 500, 'rect', '12-15'],
  ['סירה', 'סירת פלסטיק', 570, 'special', '12-15'],
  ['עיגול ענק', 'קוטר 45 ס״מ', 600, 'round', '15-20'],
  ['אליפסה ענקית', 'אליפסה ענקית', 630, 'round', '15-20'],
  ['מלבן', '50 × 30 ס״מ', 620, 'rect', '15-20'],
  ['מלבן', '60 × 30 ס״מ', 650, 'rect', '18-22'],
  ['לב ענק', 'לב גדול במיוחד', 750, 'special', '18-22'],
  ['מלבן', '70 × 35 ס״מ', 870, 'rect', '22-28'],
  ['מלבן', '85 × 30 ס״מ', 950, 'rect', '25-30'],
  ['מלבן', '100 × 30 ס״מ', 1100, 'rect', '30-35'],
  ['מלבן לאירוע', '100 × 50 ס״מ', 1600, 'rect', '40-50'],
  ['מלבן לאירוע', '130 × 50 ס״מ', 2100, 'rect', '55-70'],
  ['מגשי עץ', 'סירות, גיטרות, מלבנים ועוד', 650, 'special', '15-45', true],
];

// A fruit bouquet only goes on trays of 40 cm and up (Shlomi, 11.11): a measured side of 40+,
// plus the extra large named shapes. TODO: confirm with Shlomi which ovals/hearts count.
const bigNames = ['אליפסה ענקית', 'לב ענק', 'סירה', 'מגשי עץ'];
const isLarge = (name: string, size: string) => bigNames.includes(name) || Math.max(0, ...(size.match(/\d+/g) ?? []).map(Number)) >= 40;

export const products: Product[] = raw.map(([name, size, price, category, serves, from], i) => ({
  id: 'p' + i, name, size, price, category, serves, from, large: isLarge(name, size),
})).sort((a, b) => a.price - b.price);

export const categories: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'כל המגשים' },
  { id: 'round', label: 'עגולים ואליפסות' },
  { id: 'rect', label: 'מלבנים' },
  { id: 'special', label: 'צורות מיוחדות' },
];

// Prices updated by Shlomi 11.11. The first four show as cards in the basket, the rest as chips.
export type Extra = { id: string; name: string; note: string; price: number | null; from?: boolean; largeOnly?: boolean };
export const extras: Extra[] = [
  { id: 'x-apple', name: 'תפוח מגולף', note: 'ברכה חרוטה על המגש', price: 40, from: true },
  { id: 'x-carve', name: 'אבטיח מגולף', note: 'ברכה של עד 5 מילים', price: 420, from: true },
  { id: 'x-bouquet', name: 'זר פירות', note: 'למגשים בקוטר 40 ס״מ ומעלה', price: 350, from: true, largeOnly: true },
  { id: 'x-shake', name: 'שייק פירות 250\u00a0מ״ל', note: 'בקבוק', price: 26 },
  { id: 'x-shake-small', name: 'שייק פירות 180\u00a0מ״ל', note: 'בקבוק', price: 20 },
  { id: 'x-praline', name: 'פרלין בוטיק', note: 'ליחידה', price: 14 },
  { id: 'x-carve-custom', name: 'גילוף דיוקן על אבטיח', note: 'דיוקן אישי בגילוף', price: 650, from: true },
  { id: 'x-nuts', name: 'פיצוחים', note: 'מחיר לפי גודל', price: null },
  { id: 'x-foam', name: 'עיצוב על קלקר', note: 'המחיר לפי העיצוב והגודל', price: null },
];

// Wines and liqueurs for the basket dropdown (Shlomi, 11.11).
// Lines with "/" in his list were split into one option per choice.
export type Drink = { id: string; name: string; price: number; group: 'יין' | 'ליקר' };
const wine: [string, number][] = [
  ['ברטנורה מוסקטו', 60], ['ברטנורה בראקטו', 70], ['רוזה', 80], ['סביון בלאן', 80],
  ['כמיסה אטא בלנד אדום', 90], ['כמיסה אטא קל', 90], ['כמיסה אטא קברנה פרנק', 90],
  ['מרלו פסגות', 105], ['קברנה פסגות', 115], ['פרת פסגות', 120], ['אדום פסגות', 125],
  ['כמיסה סיגמה בלנד', 125], ['כמיסה סיגמה פרי', 125], ['טוקאי לייט הרבסט', 160],
  ['כמיסה פאי בלאן', 170], ['טוקאי אייס', 225], ['סינגל וינארד פסגות', 235],
];
const liqueur: [string, number][] = [
  ['פרפקטו נוגט 500 מ״ל', 85], ['פרפקטו מריר 500 מ״ל', 85], ['פרפקטו טריפל אגוזים 500 מ״ל', 85],
  ['פרפקטו נוגט 250 מ״ל', 55], ['פרפקטו מריר 250 מ״ל', 55],
  ['שמרלינג שוקולד לבן', 120], ['שמרלינג שוקולד מריר', 120], ['שמרלינג קפה', 120],
  ['וולדרוס קפה 200 מ״ל', 45], ['וולדרוס וניל 200 מ״ל', 45], ['וולדרוס וניל 750 מ״ל', 115],
];
export const drinks: Drink[] = [
  ...wine.map(([name, price], i) => ({ id: 'w' + i, name, price, group: 'יין' as const })),
  ...liqueur.map(([name, price], i) => ({ id: 'l' + i, name, price, group: 'ליקר' as const })),
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

// Q&A, also shown on version D since 12.11 (kashrut and cancellations confirmed by Shlomi).
export const faq = [
  { q: 'כמה זמן מראש צריך להזמין?', a: 'להזמנה לאותו יום אפשר להזמין עד 16:00, ובוחרים טווח שעות שעוד פנוי. לשישי מזמינים עד חמישי ב־20:00, ולערב חג עד 20:00 בערב שלפני. בשבת ובחג אין פעילות.' },
  { q: 'כמה עולה משלוח?', a: 'מחירי המגשים לא כוללים משלוח. גבעת זאב 30 ₪, ירושלים 65 ₪, מודיעין 70 ₪, מבשרת ופרוזדור ירושלים 100 ₪, בית שמש וביתר 180 ₪. לבתי החולים הדסה הר הצופים ושערי צדק 100 ₪, ולהדסה עין כרם 120 ₪. בהזמנה מעל 1,200 ₪ שולחים לכל חלקי הארץ, והמחיר לפי מיקום ומרחק. בוחרים טווח של שלוש שעות, בין 08:00 ל־20:00.' },
  { q: 'אפשר לאסוף בעצמי?', a: 'בטח, בלי עלות. האיסוף מרחוב הכינור בגבעת זאב, בין 12:00 ל־18:00.' },
  { q: 'איך יודעים אם יש מקום בתאריך שלי?', a: 'בוחרים אזור ותאריך בהזמנה ורואים את שעות האספקה המתאימות. תאריכים חסומים, שבתות וחגים אינם זמינים. בקשות מיוחדות מתאמים עם שלומי.' },
  { q: 'אפשר לשלוח מגש למישהו אחר?', a: 'בדיוק בשביל זה יש בהזמנה שם וטלפון של מי שמקבל. ואם אתם לא בטוחים בכתובת, מסמנים ושלומי מתאם איתו ישירות.' },
  { q: 'המגש ייראה בדיוק כמו בתמונה?', a: 'כל מגש מעוצב ביד ומתאים את עצמו לפירות הכי טובים של העונה. הצורה, הגודל והסגנון נשארים, והצבעים תמיד מפתיעים לטובה.' },
  { q: 'אפשר להוסיף ברכה או שם?', a: 'בטח. כותבים את הברכה בהזמנה. אבטיח מגולף עם ברכה של עד 5 מילים עולה 420 ₪, ואבטיח עם לוגו או דיוקן מתאמים מול שלומי.' },
  { q: 'יש כשרות?', a: 'כן. הפירות בהכשר בד״ץ העדה החרדית והרב אפרתי.' },
  { q: 'אפשר לבטל הזמנה?', a: 'אפשר לבטל עד 24 שעות לפני מועד המשלוח או האיסוף, והכסף יוחזר. הזמנה לאותו יום אי אפשר לבטל.' },
  { q: 'איך משלמים?', a: 'התשלום באתר עדיין בהקמה. בינתיים אפשר להכין את פרטי ההזמנה ולתאם עם שלומי. להזמנות בהתאמה אישית מקבלים הצעת מחיר לפני תשלום.' },
];

// Placeholders until real quotes arrive (shown as dashed cards).
export const testimonials: { quote: string; who: string }[] = [];

export const waLink = (text: string) => `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;
export const money = (n: number) => n.toLocaleString('he-IL') + ' ₪';
