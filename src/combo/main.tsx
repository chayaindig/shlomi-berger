import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ComboApp from './ComboApp';
import '../index.css';
import '../melon/melon.css';
import '../melon/cursor.css';

createRoot(document.getElementById('root')!).render(<StrictMode><ComboApp /></StrictMode>);
