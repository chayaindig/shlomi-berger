import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';
import '../index.css';
import { A11yRoot } from '../Floating';

createRoot(document.getElementById('root')!).render(<StrictMode><A11yRoot><App layout="d" /></A11yRoot></StrictMode>);
