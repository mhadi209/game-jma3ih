// يخلي التطبيق يشتغل بدون نت بعد أول فتحة
const CACHE = 'taqzeera-v11';
const FILES = ['./', 'index.html', 'topics.js', 'data.js', 'sj.js', 'feud.js', 'more_topics.js', 'more_topics2.js', 'more_topics3.js', 'more_q.js', 'more_sj.js', 'extra.js', 'data2.js', 'more2.js', 'games3.js', 'board.js', 'online.js', 'cn.js', 'liars.js', 'sudoku.js', 'scrabble.js', 'sfx.js', 'online2.js', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // الملفات تتحدث من النت إذا متوفر، وإذا ما فيه نت تفتح من الكاش
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
