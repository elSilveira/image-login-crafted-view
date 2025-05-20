// This is the Service Worker file for the iAzi PWA
const CACHE_NAME = 'iazi-app-v1.1';

// Resources to cache immediately when SW installs
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  // Adicionando estilos e scripts principais
  '/src/index.css',
  '/src/main.tsx',
];

// Lista de páginas principais para cache de fallback
const APP_SHELL_URLS = [
  '/',
  '/login',
  '/register',
  '/search',
  '/booking-history',
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

// Service Worker Fetch Event - Estratégia otimizada para iOS
self.addEventListener('fetch', event => {
  // Pular solicitações não-GET e chamadas de API
  if (event.request.method !== 'GET' || 
      event.request.url.includes('/api/') ||
      !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Criar uma URL para comparar sem query parameters para navegação
  const requestURL = new URL(event.request.url);
  const isNavigationRequest = 
    event.request.mode === 'navigate' || 
    (event.request.headers.get('accept') && 
     event.request.headers.get('accept').includes('text/html'));
  
  // Estratégia para solicitações de navegação (HTML)
  if (isNavigationRequest) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response || response.status !== 200) {
            throw new Error('Navigation fetch failed');
          }
          
          // Clone a resposta para o cache
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          
          return response;
        })
        .catch(() => {
          // Se a navegação falhar, tente encontrar no cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // Se não encontrar no cache, retorne a página inicial como fallback
              return caches.match('/index.html');
            });
        })
    );
    return;
  }
  
  // Estratégia para recursos estáticos - Cache First com Network Fallback
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Retorna do cache primeiro
          return cachedResponse;
        }
        
        // Se não estiver no cache, tente a rede
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200) {
              return response;
            }
            
            // Clone a resposta antes de usar
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
            
            return response;
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

// Evento para lidar com mensagens, incluindo skip waiting
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
