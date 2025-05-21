// This is the Service Worker file for the iAzi PWA
const CACHE_VERSION = '2.3';
const CACHE_NAME = `iazi-app-v${CACHE_VERSION}`;

// Lista de versões antigas para serem excluídas
const OLD_CACHES = [
  'iazi-app-v1',
  'iazi-app-v1.1',
  'iazi-app-v2',
  'iazi-app-v2.1',
  'iazi-app-v2.2',
];

// Resources to cache immediately when SW installs
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Lista de páginas principais para cache de fallback
const APP_SHELL_URLS = [
  '/',
  '/login',
  '/register',
  '/search',
  '/booking-history',
  '/settings',
  '/profile',
  '/profile/professional',
  '/profile/professional/services',
  '/profile/professional/dashboard',
  '/profile/professional/bookings',
  '/profile/professional/reviews',
  '/profile/professional/calendar',
  '/profile/professional/settings',
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando nova versão v' + CACHE_VERSION);
  
  // Forçar o serviço worker atual a se tornar o serviço worker ativo
  self.skipWaiting();

  // Fazer cache dos arquivos essenciais
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching app shell');
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando nova versão v' + CACHE_VERSION);
  
  // Tomar controle de todas as páginas clientes sem recarregar
  event.waitUntil(self.clients.claim());
  
  // Apagar caches antigos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return (
              cacheName.startsWith('iazi-app-') && 
              cacheName !== CACHE_NAME && 
              OLD_CACHES.includes(cacheName)
            );
          })
          .map((cacheName) => {
            console.log('[Service Worker] Excluindo cache antigo:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
});

// Estratégia de interceptação de solicitações
self.addEventListener('fetch', (event) => {
  // Extrair a URL e o método da solicitação
  const requestUrl = new URL(event.request.url);
  const requestMethod = event.request.method;
  
  // Verificar se é uma requisição de navegação (HTML)
  const isNavigationRequest = event.request.mode === 'navigate';
  
  // Verificar se é uma requisição para a mesma origem
  const isFromSameOrigin = requestUrl.origin === self.location.origin;
  
  // Verificar se é uma requisição GET
  const isGetRequest = requestMethod === 'GET';

  // Para requisições de navegação (quando o usuário acessa uma URL diretamente)
  if (isNavigationRequest && isFromSameOrigin) {
    // Sempre retornar o index.html para requisições de navegação
    event.respondWith(
      caches.match('/index.html')
        .then(cachedResponse => {
          // Se temos um cache de index.html, usamos ele
          if (cachedResponse) {
            // Tenta atualizar o cache em segundo plano
            fetch('/index.html')
              .then(networkResponse => {
                if (networkResponse && networkResponse.ok) {
                  caches.open(CACHE_NAME).then(cache => {
                    cache.put('/index.html', networkResponse.clone());
                  });
                }
              })
              .catch(() => {
                // Se falhar, usaremos o cache que já temos
              });
              
            return cachedResponse;
          }
          
          // Se não temos cache, tenta obter da rede
          return fetch('/index.html')
            .then(response => {
              if (!response || response.status !== 200) {
                return response;
              }
              
              // Cache a resposta para uso futuro
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put('/index.html', responseToCache);
              });
              
              return response;
            })
            .catch(() => {
              // Se tudo mais falhar, retorna uma página de erro offline
              return new Response('Você está offline. Por favor, verifique sua conexão.', {
                headers: { 'Content-Type': 'text/html' }
              });
            });
        })
    );
    return;
  }

  // Para recursos estáticos e outras requisições não-navegação
  if (isGetRequest) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        // Se temos um cache, usamos ele
        if (cachedResponse) {
          // Tenta atualizar o cache em segundo plano
          fetch(event.request)
            .then(networkResponse => {
              if (networkResponse && networkResponse.ok) {
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, networkResponse.clone());
                });
              }
            })
            .catch(() => {
              // Se falhar, usaremos o cache que já temos
            });
            
          return cachedResponse;
        }
        
        // Se não temos cache, tenta obter da rede
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200) {
              return response;
            }
            
            // Cache a resposta para uso futuro
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            
            return response;
          })
          .catch(error => {
            // Se a requisição for para uma página da aplicação, retornamos o index.html
            if (isFromSameOrigin && APP_SHELL_URLS.some(url => requestUrl.pathname.startsWith(url))) {
              return caches.match('/index.html');
            }
            
            console.error('[Service Worker] Erro ao buscar:', error);
            return new Response('Falha ao carregar o recurso. Por favor, tente novamente.', {
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
    );
  }
});

// Sincronizar dados quando ficar online novamente
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('[Service Worker] Sincronizando dados');
    // Implementar lógica de sincronização
  }
});

// Receber mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName.startsWith('iazi-');
          })
          .map((cacheName) => {
            console.log('[Service Worker] Limpando cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    });
  }
});

// Lidar com notificações push
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      data: {
        url: data.url
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Lidar com cliques em notificações
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
