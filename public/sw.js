// This is the Service Worker file for the iAzi PWA
const CACHE_VERSION = '1.0.1';
const CACHE_NAME = 'iazi-app-v' + CACHE_VERSION;

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

// Arquivos essenciais para funcionamento offline
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/logo.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];

// Detectar se estamos em ambiente de desenvolvimento
const isDev = self.location.hostname === 'localhost';

// Detectar navegadores problemáticos (Safari em iOS)
const isSafariOnIOS = () => {
  // Service Worker não tem acesso ao navigator.userAgent, então usamos heurísticas
  // para detectar se há comportamentos problemáticos
  const clientId = self.registration.scope;
  return clientId.includes('icloud') || clientId.includes('apple');
};

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker: Instalando...');
  
  // Verificar se estamos em um ambiente problemático
  const isProblematicBrowser = isSafariOnIOS();
  
  if (isProblematicBrowser) {
    console.log('⚠️ Detectado navegador com comportamento problemático - instalação conservadora');
    // Configuração mínima para Safari no iOS
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        // Apenas cache mínimo para evitar problemas em iOS
        return cache.addAll(['/']);
      })
    );
  } else {
    // Instalação normal para outros navegadores
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log('📦 Caching arquivos estáticos');
        return cache.addAll(STATIC_ASSETS);
      })
    );
  }
  
  // Skip waiting apenas em ambientes não problemáticos
  if (!isProblematicBrowser) {
    self.skipWaiting();
  }
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker: Ativando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('iazi-') && cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          console.log('🧹 Removendo cache antigo:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Agora está ativo e controlando a página');
      return self.clients.claim();
    })
  );
});

// Estratégia de interceptação de solicitações
self.addEventListener('fetch', (event) => {
  // Não interceptar requisições de API em desenvolvimento
  if (isDev && event.request.url.includes('/api/')) {
    return;
  }
  
  // Evitar interceptar requisições para analytics, reCAPTCHA, etc.
  if (
    event.request.url.includes('google-analytics.com') ||
    event.request.url.includes('googletagmanager.com') ||
    event.request.url.includes('recaptcha') ||
    event.request.url.includes('analytics')
  ) {
    return;
  }
  
  // Estratégia de cache para navegação e arquivos estáticos
  if (
    event.request.mode === 'navigate' ||
    (event.request.method === 'GET' && 
     (event.request.destination === 'style' || 
      event.request.destination === 'script' || 
      event.request.destination === 'image' || 
      event.request.destination === 'font'))
  ) {
    event.respondWith(
      caches.match(event.request).then((cacheResponse) => {
        // Network first para navegação em Safari/iOS para evitar problemas
        if (event.request.mode === 'navigate' && isSafariOnIOS()) {
          return fetch(event.request)
            .then((networkResponse) => {
              // Se a resposta foi bem-sucedida, adiciona ao cache
              if (networkResponse && networkResponse.ok && networkResponse.status === 200) {
                const clonedResponse = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, clonedResponse);
                });
              }
              return networkResponse;
            })
            .catch(() => {
              // Em caso de falha na rede, usa o cache
              return cacheResponse || caches.match('/');
            });
        }
        
        // Para outros recursos, tenta o cache primeiro, depois a rede
        return cacheResponse || fetch(event.request).then((response) => {
          // Só faz cache de respostas bem-sucedidas
          if (response && response.ok && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        }).catch(() => {
          // Se for uma requisição de página e não tem cache, redireciona para a página inicial
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return null;
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
    console.log('⏭️ Service Worker: Recebido comando para SKIP_WAITING');
    
    // No Safari iOS, não ativar skip_waiting para evitar loops de recarga
    if (!isSafariOnIOS()) {
      self.skipWaiting();
    } else {
      console.log('⚠️ Comando SKIP_WAITING ignorado em Safari iOS para evitar loops');
    }
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
