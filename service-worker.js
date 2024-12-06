const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
  '',
  'index.html',
  'styles.css',
  'script.js',
  'img/icon_192.png',
  'img/icon_512.png',
  'img/taskifyAPP.png',
  'img/image-removebg-preview.png',
  'offline.html' // Archivo predeterminado para modo offline
];

// Instalar el Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Archivos cacheados');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Error durante la instalación:', error);
      })
  );
});

// Activar el Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activado');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => 
        Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('Service Worker: Eliminando caché antiguo', cacheName);
              return caches.delete(cacheName);
            }
          })
        )
      )
  );
});

// Interceptar las solicitudes y servir desde el caché
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Si está en caché, devolverlo
        if (cachedResponse) {
          return cachedResponse;
        }
        // Si no está en caché, intentar obtenerlo de la red
        return fetch(event.request).catch(() => {
          // Si falla la red, devolver archivo offline para navegaciones
          if (event.request.mode === 'navigate') {
            return caches.match('./offline.html');
          }
        });
      })
  );
});
