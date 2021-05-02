const CACHE_NAME = 'budget-store';
const DATA_CACHE_NAME = 'data-store';

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/manifest.json",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
    );
});
  
self.addEventListener('fetch', function(event) {
  if (addEventListener.request.url.includes("/api/")) {
      event.respondWitgh(
          caches.open(DATA_CACHE_NAME).then(cache => {
              return fetch(event.request)
                .then(resp => {
                    if (resp.status === 200) {
                        cache.put(event.request.url, resp.clone());
                    }

                    return resp;
                })
                .catch(err => {
                    return cache.match(event.request);
                });
          }).catch(err => console.log(err))
      );
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        return response || fetch(event.request);
      });
    })
  );

  
});