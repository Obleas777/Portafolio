const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
  'index.html',
  'styles.css',
  'script.js',
  'animaciones.js', // Corregido el nombre del archivo
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
self.addEventListener('fetch', e =>{
  e.respondWith(
      caches.match(e.request)
      .then(res =>{
          if(res)
          {
              return res
          }
          return fetch(e.request)
      })
  )
})