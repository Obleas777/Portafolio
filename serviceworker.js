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
];

//Funcion de instalacion
//almacena el nombre y los archivos que van a ir guardados en cache

self.addEventListener('install', e =>{
  e.waitUntil( //le decimos que detenga el evento hasta que se ejecute lo siguiente
      caches.open(CACHE_NAME)
      .then(cache =>{
          return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting)
      })

  )
})

self.addEventListener('activate', e =>{
  const listaBlancaCache = [CACHE_NAME];

  e.waitUntil(
      caches.keys()
      .then(nombresCache => {
          return Promise.all(
              nombresCache.map(nombresCache =>{
                  if(listaBlancaCache.indexOf(nombresCache) === -1){
                      return caches.delete(nombresCache)
                  }
              })
          )
      })
      //activamos la cache actualizada
      .then(()=> self.clients.claim())
  )

})


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