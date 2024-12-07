const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
  'index.html',
  'styles.css',
  'script.js',
  'animaciones.js',
  'img/icon_192.png',
  'img/icon_512.png',
  'img/taskifyAPP.png',
  'img/image-removebg-preview.png',
  'img/candys.png',
  'img/logs.png',
  'img/motoko1.png',
  'img/motoko2.png',
  'img/pasteleria.png',
  'img/screenshot1.png',
  'img/screenshot2.png',
  'img/sopiletras.png',
];

// Instalación
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activación
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepción de solicitudes (fetch)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      if (res) {
        return res; // Recurso desde la caché
      }
      return fetch(e.request).catch(() => {
        // Manejo de fallos de red
        if (e.request.destination === 'document') {
          return caches.match('index.html'); // Página por defecto
        }
      });
    })
  );
});
