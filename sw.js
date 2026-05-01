const CACHE_NAME = 'cbt-azzahro-v1.0.1';
const assetsToCache = [
  './login.html',
  './ujian.html',
  './manifest.json',
  './mata-pelajaran.json',
  'https://fonts.googleapis.com/icon?family=Material+Icons+Round'
];

// Tahap Instalasi: Simpan aset ke cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Tahap Fetch: Ambil dari cache jika ada, jika tidak ambil dari network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Update Cache saat ada versi baru
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});
