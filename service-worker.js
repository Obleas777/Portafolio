const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
  'index.html',
  'styles.css',
  'script.js',
  'animcaciones.js',
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
  'offline.html'
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
    caches.keys().then((cacheNames) =>
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
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).catch((error) => {
          console.error('Error al realizar fetch:', error);

          // Si es una navegación y la red falla, devuelve el archivo offline
          if (event.request.mode === 'navigate') {
            return caches.match('offline.html');
          }

          // Para otros casos, devuelve una respuesta de error
          return new Response('Recurso no disponible', { status: 503 });
        });
      })
  );
});
