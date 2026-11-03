import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MelonApp from './MelonApp';
import '../index.css';
import './melon.css';
import './cursor.css';

createRoot(document.getElementById('root')!).render(<StrictMode><MelonApp /></StrictMode>);
