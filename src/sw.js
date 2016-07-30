var staticCacheName = 'mapclopedia-static-v1';
var allCaches = [
  staticCacheName
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/fonts',
        '/maps',
        '/maps/scripts',
        '/maps/styles',
        '/scripts',
        '/styles',
        'index.html'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      console.log(cacheNames);
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('mapclopedia-') &&
            !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          console.log(cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});


self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
