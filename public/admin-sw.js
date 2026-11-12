// Service worker for Shlomi's admin app: shows order notifications and opens the order on tap.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
// A fetch handler keeps the app installable on every Android version
self.addEventListener('fetch', () => {});

self.addEventListener('push', (e) => {
  let data = { title: 'הזמנה חדשה', body: '', url: '/admin' };
  try { data = { ...data, ...e.data.json() }; } catch { /* plain text push */ }
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    tag: data.tag,
    data: { url: data.url },
    icon: '/admin-icon-192.png',
    badge: '/favicon-32.png',
    dir: 'rtl',
    lang: 'he',
    vibrate: [200, 100, 200],
    requireInteraction: true,
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/admin';
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) if (c.url.includes('/admin')) { await c.focus(); c.navigate(url); return; }
    await self.clients.openWindow(url);
  })());
});
