/* NafahLife — Service Worker (অফলাইন সাপোর্ট + অ্যাপের মতো ইনস্টল) */
const CACHE = 'nafahlife-v2';
const CORE = [
  'AAcommon.css',
  'nafah-logo.png',
  'nafah-logo-dark.png',
  'book-placeholder.svg'
];
/* যেসব ফাইল ঘন ঘন বদলায় — সবসময় নতুন লোড হবে (পুরনো ক্যাশ দেখাবে না) */
const ALWAYS_FRESH = ['book.js', 'aabooks-live.js', 'AAcommon.js', 'sitemap.xml'];

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
  /* ঘন ঘন বদলানো ফাইল (book.js ইত্যাদি) — network-first, তাই নতুন বই/দাম সাথে সাথে দেখাবে */
  if (ALWAYS_FRESH.some(name => url.pathname.endsWith(name))) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }
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
