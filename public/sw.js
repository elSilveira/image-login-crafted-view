// This is the Service Worker file for the iAzi PWA
const CACHE_NAME = 'iazi-app-v1';

// Resources to cache immediately when SW installs
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Service Worker Install Event
self.addEventListener('install', event => {
  console.log('Service Worker instalado ✅');
  
  // Skip waiting forces the waiting service worker to become the active service worker
  self.skipWaiting();
  
  // Precaching static resources
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('Recursos iniciais em cache ✅');
      })
  );
});

// Service Worker Activate Event - Clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker ativado ✅');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('Removendo cache antigo:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Claim any clients that match the worker's scope
      return self.clients.claim();
    })
  );
});

// Service Worker Fetch Event - Network first, then cache, with fallback
self.addEventListener('fetch', event => {
  // Skip cross-origin requests like API calls
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-HTTP(S) requests (e.g., websocket)
  if (event.request.method !== 'GET') {
    return;
  }

  // Network first strategy
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If we got a valid response, clone it and put it in the cache
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // If the network fails, try from the cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // If this is a HTML navigation and it's not in the cache,
          // return the cached index.html as a fallback
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          
          // If the request failed and it wasn't a navigation, fallback to a default response
          return new Response('Não foi possível carregar o recurso. Por favor, verifique sua conexão.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// Listen for push notifications
self.addEventListener('push', event => {
  const title = 'iAzi';
  const options = {
    body: event.data && event.data.text() || 'Notificação iAzi',
    icon: '/public/lovable-uploads/15a72fb5-bede-4307-816e-037a944ec286.png',
    badge: '/favicon.ico'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Listen for notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
