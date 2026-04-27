const CACHE_NAME = 'cbt-azzahro-v1.0.1';
const OFFLINE_URL = './offline.html'; // Opsional: buat file offline.html sederhana

// Daftar file yang wajib di-cache agar aplikasi bisa terbuka & diinstal
const ASSETS_TO_CACHE = [
  './',
  './login.html',
  './ujian.html',
  './mata-pelajaran.json',
  'https://github.com/masrahmat-id/absensi-barcode-online-smp-smk-azzahro/raw/main/logo-smp-azzahro.png',
  'https://azzahrolocare.github.io/presensi-smp-smk-azzahro//icon-apk-presensi-azzahro.png',
  './manifest.json'
];

// 1. INSTALL: Mengunduh aset ke dalam cache HP
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Mengunduh aset CBT ke cache...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. ACTIVATE: Menghapus cache versi lama jika ada update
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('SW: Menghapus cache lama:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. FETCH: Strategi "Cache First" untuk kecepatan loading
// Menjamin aplikasi tetap terbuka meskipun sinyal di sekolah buruk
self.addEventListener('fetch', (event) => {
  // Biarkan request ke Google Apps Script (validasi login) langsung ke internet (tanpa cache)
  if (event.request.url.includes('script.google.com')) {
    return; 
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika ada di cache gunakan cache, jika tidak ambil dari internet
      return response || fetch(event.request).catch(() => {
        // Jika internet mati dan file tidak ada di cache, arahkan ke offline.html
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});
