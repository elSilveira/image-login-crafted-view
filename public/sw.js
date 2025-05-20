// This is the Service Worker file for the iAzi PWA
const CACHE_VERSION = '2';
const CACHE_NAME = `iazi-app-v${CACHE_VERSION}`;

// Lista de versões antigas para serem excluídas
const OLD_CACHES = [
  'iazi-app-v1',
  'iazi-app-v1.1',
];

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
  console.log('Service Worker instalado ✅ - Nova versão:', CACHE_VERSION);
  
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
  console.log('Service Worker ativado ✅ - Versão:', CACHE_VERSION);
  
  // Limpar todos os caches antigos
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        console.log('Caches existentes:', cacheNames);
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              // Remover caches antigos conhecidos e qualquer outro que não seja o atual
              return (OLD_CACHES.includes(cacheName) || cacheName !== CACHE_NAME);
            })
            .map(cacheName => {
              console.log('Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('Limpeza de cache concluída');
        // Claim any clients that match the worker's scope
        return self.clients.claim();
      })
  );
});

// Service Worker Fetch Event - Estratégia otimizada para evitar problemas de cache
self.addEventListener('fetch', event => {
  // Ignorar solicitações não-GET, APIs, e cross-origin
  if (
    event.request.method !== 'GET' || 
    event.request.url.includes('/api/') ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }
  
  const requestURL = new URL(event.request.url);
  
  // Adicionar parâmetro de versão para evitar cache do navegador
  // para recursos importantes como HTML e JavaScript
  const shouldBypassCache = (
    requestURL.pathname.endsWith('.html') || 
    requestURL.pathname.endsWith('.js') || 
    requestURL.pathname.endsWith('.json') ||
    requestURL.pathname === '/'
  );
  
  if (shouldBypassCache) {
    // Para recursos críticos, sempre verificar a rede primeiro
    const networkFirstStrategy = async () => {
      try {
        // Tentar buscar da rede com cabeçalho cache-control para evitar cache
        const networkRequest = new Request(event.request.url, {
          cache: 'no-store',
          headers: new Headers({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          })
        });
        
        const networkResponse = await fetch(networkRequest);
        
        // Se tiver sucesso, atualizar o cache
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, responseClone);
        }
        
        return networkResponse;
      } catch (error) {
        // Se falhar, tentar o cache
        const cachedResponse = await caches.match(event.request);
        return cachedResponse || caches.match('/index.html');
      }
    };
    
    event.respondWith(networkFirstStrategy());
  } else {
    // Para outros recursos, usar estratégia de cache first
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // Retornar do cache, mas também atualizar em segundo plano
            const fetchPromise = fetch(event.request)
              .then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                  const responseClone = networkResponse.clone();
                  caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, responseClone));
                }
                return networkResponse;
              })
              .catch(() => cachedResponse);
            
            // Usar o que está em cache enquanto atualiza em segundo plano
            return cachedResponse;
          }
          
          // Se não estiver no cache, buscar da rede
          return fetch(event.request)
            .then(response => {
              if (!response || response.status !== 200) {
                return response;
              }
              
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseClone));
              
              return response;
            });
        })
    );
  }
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

// Evento para lidar com mensagens, incluindo skip waiting
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Recebido comando para pular waiting');
    self.skipWaiting();
  }
});
