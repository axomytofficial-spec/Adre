// Network first, falls back to the last saved copy when offline.
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => {
      const copy = res.clone();
      caches.open('adre-v1').then(c => c.put(r, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(r))
  );
});
