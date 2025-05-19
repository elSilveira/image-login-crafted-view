// This is the Service Worker file for the iAzi PWA
const CACHE_NAME = 'iazi-app-v1';

// Resources to cache immediately when SW installs
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Added routes that should be handled by the SPA
const KNOWN_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/profile',
  '/services',
  '/settings',
  '/notifications',
  '/professionals',
  '/search',
  '/booking-history',
  '/company',
  '/gamification',
  '/reviews'
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
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests like API calls
  if (!url.origin.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-HTTP(S) requests (e.g., websocket)
  if (event.request.method !== 'GET') {
    return;
  }

  // For navigation requests or known routes, serve index.html
  const isNavigationRequest = event.request.mode === 'navigate';
  const isKnownRoute = KNOWN_ROUTES.some(route => 
    url.pathname === route || url.pathname.startsWith(`${route}/`)
  );

  if (isNavigationRequest || isKnownRoute) {
    event.respondWith(
      caches.match('/index.html')
        .then(cachedResponse => {
          // Return cached index.html if available
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Otherwise fetch from network
          return fetch('/index.html')
            .then(response => {
              // Cache the index.html response for future use
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put('/index.html', responseClone);
              });
              return response;
            })
            .catch(() => {
              // If all else fails, return a generic offline page
              return new Response(
                '<html><body><h1>App Offline</h1><p>Por favor, verifique sua conexão.</p></body></html>',
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: new Headers({
                    'Content-Type': 'text/html'
                  })
                }
              );
            });
        })
    );
    return;
  }

  // For static assets, use a cache-first approach
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, try network
        return fetch(event.request)
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
            // If the request is for an image, you could return a placeholder
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('/placeholder.svg');
            }
            
            // For other resources, return a simple offline message
            return new Response(
              'Recurso indisponível offline',
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/plain'
                })
              }
            );
          });
      })
  );
});

// Listen for push notifications
self.addEventListener('push', event => {
  const title = 'iAzi';
  const options = {
    body: event.data && event.data.text() || 'Notificação iAzi',
    icon: '/lovable-uploads/15a72fb5-bede-4307-816e-037a944ec286.png',
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
