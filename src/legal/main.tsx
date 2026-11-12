import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { A11yRoot } from '../Floating';
import LegalPage from '../Legal';
import { NotFoundPage, ThanksPage } from '../Pages';
import '../index.css';

// One entry for the small pages: legal pages, thank-you and 404 (data-page on #root)
const root = document.getElementById('root')!;
const page = root.dataset.page ?? 'terms';
const view = page === 'thanks' ? <ThanksPage /> : page === '404' ? <NotFoundPage /> : <LegalPage page={page} />;
createRoot(root).render(<StrictMode><A11yRoot>{view}</A11yRoot></StrictMode>);
