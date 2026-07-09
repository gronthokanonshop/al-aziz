/* NafahLife — Service Worker (অফলাইন সাপোর্ট + অ্যাপের মতো ইনস্টল) */
const CACHE = 'nafahlife-v1';
const CORE = [
  'index.html',
  'AAcommon.css',
  'AAcommon.js',
  'book.js',
  'aabooks-live.js',
  'nafah-logo.png',
  'nafah-logo-dark.png',
  'book-placeholder.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE).map(k => caches.delete(k))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  /* Firebase/API বা অন্য হোস্ট — সবসময় নেটওয়ার্ক (ক্যাশ নয়) */
  if (url.origin !== location.origin || url.pathname.endsWith('.json')) return;
  /* HTML — network-first (নতুন আপডেট সাথে সাথে পায়), fallback ক্যাশ */
  if (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match(req).then(m => m || caches.match('index.html')))
    );
    return;
  }
  /* বাকি অ্যাসেট — cache-first */
  e.respondWith(
    caches.match(req).then(m => m || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
      return res;
    }))
  );
});
