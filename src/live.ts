import { useEffect, useState } from 'react';
import { israelDate } from './delivery';

// Live settings Shlomi changes from his admin panel (Supabase, 12.11.2026):
// sold-out add-ons and drinks, full days, and "closed for today".
// The publishable key is public by design; the tables only allow reading.
export const SUPABASE_URL = 'https://snryyscqmbqfcmjwwwuv.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_MjyZe37629VmNCB_GBl_lw_EtAGMGEf';

export type Live = { soldOut: Set<string>; blocked: string[]; closedToday: boolean; ready: boolean };
const EMPTY: Live = { soldOut: new Set(), blocked: [], closedToday: false, ready: false };

const get = (path: string) =>
  fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: { apikey: SUPABASE_KEY } }).then(r => (r.ok ? r.json() : Promise.reject(r.status)));

let cache: Promise<Live> | null = null;
export function loadLive(force = false): Promise<Live> {
  if (!cache || force) {
    cache = Promise.all([
      get('stock?select=id&available=eq.false'),
      get(`blocked_dates?select=day&day=gte.${israelDate()}`),
      get('site_settings?select=closed_today&id=eq.1'),
    ]).then(([stock, days, settings]: [{ id: string }[], { day: string }[], { closed_today: string | null }[]]) => ({
      soldOut: new Set(stock.map(s => s.id)),
      blocked: days.map(d => d.day),
      closedToday: settings[0]?.closed_today === israelDate(),
      ready: true,
    })).catch(() => ({ ...EMPTY, ready: true }));
  }
  return cache;
}

/** Live settings; refreshes whenever `refresh` changes (e.g. each time the cart opens). */
export function useLive(refresh: unknown = 0): Live {
  const [live, setLive] = useState<Live>(EMPTY);
  useEffect(() => {
    let on = true;
    loadLive(refresh !== 0).then(l => on && setLive(l));
    return () => { on = false; };
  }, [refresh]);
  return live;
}

/** Saves the order and notifies Shlomi's phone. Fire and forget: WhatsApp still opens if this fails. */
export function saveOrder(order: { name: string; phone: string; date: string; slot: string; zone: string; total: number; items: { name: string; qty: number; price: number | null }[]; message: string }) {
  try {
    fetch(`${SUPABASE_URL}/functions/v1/new-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
      keepalive: true,
    }).catch(() => {});
  } catch { /* never block the order */ }
}
