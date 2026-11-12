import { useEffect, type ReactNode } from 'react';
import { business, cancelPolicy, img, waLink } from './data';
import { watchOrphans } from './noOrphans';

// Thank-you page (opens in a new tab after payment) and the 404 page (12.11.2026).
// The GitHub preview keeps the earlier versions at the root, so "home" there is d.html
export const HOME = location.hostname.endsWith('github.io') ? './d.html' : '/';
const asset = (p: string) => img(p);

const btn = 'inline-flex items-center justify-center rounded-full px-7 py-3.5 font-medium transition-colors';

function Stage({ title, children, pieces }: { title: string; children: ReactNode; pieces: [string, string][] }) {
  useEffect(() => {
    document.title = `${title} | האמנות שבפרי`;
    return watchOrphans();
  }, [title]);
  return (
    <main className="pom-skin relative grid min-h-dvh place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_30%,#6b1440,#3e0925_55%,#2a0618)] px-5 py-16 text-center text-cream">
      {/* Fruit pieces drifting around the edges, decoration only */}
      {pieces.map(([src, pos], i) => (
        <img key={src + i} src={asset(src)} alt="" aria-hidden draggable={false}
          className={`bob pointer-events-none absolute w-[clamp(4.5rem,11vw,9rem)] drop-shadow-[0_18px_16px_rgb(0_0_0/0.35)] ${pos}`}
          style={{ ['--bob' as string]: `${5 + i * 0.9}s` }} />
      ))}
      <div className="relative z-10 mx-auto max-w-xl">
        <a href={HOME} aria-label="האמנות שבפרי, לדף הבית" className="mx-auto mb-10 block w-fit">
          <img src={asset('logo-gold.webp')} alt="" width={785} height={378} className="w-32" />
        </a>
        {children}
      </div>
    </main>
  );
}

export function ThanksPage() {
  return (
    <Stage title="תודה על ההזמנה" pieces={[
      ['hero/strawberries.webp', 'right-[4%] top-[8%]'],
      ['fruit/mint.webp', 'left-[6%] top-[14%]'],
      ['hero/grapes.webp', 'left-[4%] bottom-[8%]'],
      ['fruit/pomegranate-open.webp', 'right-[6%] bottom-[10%]'],
    ]}>
      <img src={asset('hero/melons/rose.webp')} alt="" aria-hidden width={884} height={900}
        className="mx-auto w-[min(46vw,13rem)] drop-shadow-[0_26px_22px_rgb(0_0_0/0.4)]" />
      <h1 className="mt-6 font-script text-section">
        <span className="gold-text">תודה רבה!</span>
      </h1>
      <p className="mt-2 font-display text-sub font-bold text-cream">ההזמנה שלכם התקבלה</p>
      <p className="mx-auto mt-5 max-w-md text-body text-mist">
        שלומי כבר רואה את ההזמנה, ויחזור אליכם בוואטסאפ לאישור. אישור התשלום יישלח למייל שמסרתם.
      </p>
      <p className="mx-auto mt-3 max-w-md text-note text-mist/80">{cancelPolicy}</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <a href={HOME} className={`${btn} bg-gold text-night hover:bg-[#e3c487]`}>חזרה לאתר</a>
        <a href={waLink('היי שלומי, ביצעתי עכשיו הזמנה באתר')} target="_blank" rel="noreferrer"
          className={`${btn} border border-cream/30 text-cream hover:border-gold hover:text-gold`}>שאלה לשלומי בוואטסאפ</a>
      </div>
      <p className="mt-6 text-note text-mist/70">או בטלפון <bdi dir="ltr">{business.phoneDisplay}</bdi></p>
    </Stage>
  );
}

export function NotFoundPage() {
  return (
    <Stage title="הדף לא נמצא" pieces={[
      ['hero/strawberries.webp', 'right-[5%] top-[10%]'],
      ['fruit/kiwi.webp', 'left-[5%] top-[12%]'],
      ['hero/grapes.webp', 'right-[7%] bottom-[8%]'],
      ['fruit/straw.webp', 'left-[6%] bottom-[12%]'],
    ]}>
      <p aria-hidden dir="ltr" className="flex items-center justify-center gap-[0.04em] font-script text-[clamp(6rem,24vw,13rem)] leading-none">
        <span className="gold-text">4</span>
        <img src={asset('hero/watermelon.webp')} alt="" className="bob -mx-[0.05em] h-[0.82em] w-auto drop-shadow-[0_20px_18px_rgb(0_0_0/0.4)]" />
        <span className="gold-text">4</span>
      </p>
      <h1 className="mt-6 font-script text-section">
        <span className="gold-text">אופס, הדף הזה נאכל.</span>
      </h1>
      <p className="mx-auto mt-5 max-w-md text-body text-mist">
        חיפשנו בכל המגשים, הפכנו כל אבטיח ובדקנו אפילו מתחת לענבים. נראה שמישהו פשוט לא התאפק.
      </p>
      <p className="mx-auto mt-2 max-w-md text-body text-gold">הבשורה הטובה: המגשים עצמם שלמים ומחכים לכם.</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <a href={HOME} className={`${btn} bg-gold text-night hover:bg-[#e3c487]`}>חזרה לדף הבית</a>
        <a href={`${HOME}#catalog`} className={`${btn} border border-cream/30 text-cream hover:border-gold hover:text-gold`}>לבחירת מגש</a>
      </div>
    </Stage>
  );
}
