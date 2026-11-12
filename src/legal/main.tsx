import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import LegalPage from '../Legal';
import '../index.css';

const root = document.getElementById('root')!;
createRoot(root).render(<StrictMode><LegalPage page={root.dataset.page ?? 'terms'} /></StrictMode>);
