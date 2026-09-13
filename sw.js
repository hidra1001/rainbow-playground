/* 무지개 놀이터 서비스 워커: 오프라인에서도 놀 수 있게 파일을 저장해요 */
const VERSION = 'rainbow-202609132007';
const CORE = ['./', './index.html', './math.html', './hangul.html', './brain.html', './arcade.html', './voice.js', './audio/list.json', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  const isFont = url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('gstatic.com');
  if (url.origin !== location.origin && !isFont) return;
  // 저장된 것을 먼저 주고, 뒤에서 새 버전을 받아 둬요 (stale-while-revalidate)
  e.respondWith(caches.open(VERSION).then(async cache => {
    const cached = await cache.match(e.request, { ignoreSearch: url.origin === location.origin });
    const fetching = fetch(e.request).then(res => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(e.request, res.clone());
      return res;
    }).catch(() => cached);
    return cached || fetching;
  }));
});
