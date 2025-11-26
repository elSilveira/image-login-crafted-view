// Função para limpar caches de aplicação
async function clearAppCaches() {
  if ('caches' in window) {
    try {
      // Listar todos os caches disponíveis
      const cacheNames = await caches.keys();
      console.log('🧹 Limpando caches antigos:', cacheNames);

      // Excluir todos os caches que começam com 'iazi-'
      const deletionPromises = cacheNames
        .filter(name => name.startsWith('iazi-'))
        .map(name => {
          console.log(`🧹 Removendo cache: ${name}`);
          return caches.delete(name);
        });

      await Promise.all(deletionPromises);
      console.log('🧹 Limpeza de cache concluída');
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar caches:', error);
      return false;
    }
  }
  return false;
}

// Verificar se o dispositivo está online
function isOnline(): boolean {
  return navigator.onLine;
}

// Detectar Safari no iOS
function isSafariOnIOS(): boolean {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isSafari = /Safari/i.test(ua) && !/Chrome/i.test(ua);
  return isIOS && isSafari;
}

// Chave para armazenar a última vez que a página foi recarregada
const RELOAD_TIMESTAMP_KEY = 'sw_last_reload_timestamp';
// Tempo mínimo entre recargas (5 segundos)
const MIN_TIME_BETWEEN_RELOADS = 5000;

// Verificar se uma recarga já ocorreu recentemente
function hasReloadedRecently(): boolean {
  try {
    const lastReloadTimestamp = localStorage.getItem(RELOAD_TIMESTAMP_KEY);
    if (!lastReloadTimestamp) return false;
    
    const lastReload = parseInt(lastReloadTimestamp, 10);
    const now = Date.now();
    return (now - lastReload) < MIN_TIME_BETWEEN_RELOADS;
  } catch (e) {
    return false;
  }
}

// Registrar que ocorreu uma recarga
function markReload(): void {
  try {
    localStorage.setItem(RELOAD_TIMESTAMP_KEY, Date.now().toString());
  } catch (e) {
    console.error('Erro ao marcar recarga:', e);
  }
}

// Função para verificar e atualizar o Service Worker
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    // Usar setTimeout para dar tempo para a página carregar primeiro
    setTimeout(() => {
      console.log('🔄 ServiceWorker Debug - Attempting to register ServiceWorker');
      
      // Detecção de plataforma
      const onIOS = isSafariOnIOS();
      console.log(`📱 Plataforma detectada: ${onIOS ? 'Safari no iOS' : 'Outro navegador'}`);
      
      // No Safari iOS, usar uma abordagem mais conservadora
      if (onIOS) {
        registerSafelyForIOS();
      } else {
        registerNormally();
      }
    }, 1000); // Aguardar 1 segundo antes de iniciar o registro
  }
}

// Registro seguro para iOS
function registerSafelyForIOS() {
  console.log('🍏 Usando estratégia de registro seguro para iOS');
  
  // Verificar se já recarregou recentemente
  if (hasReloadedRecently()) {
    console.log('🛑 Detectada recarga recente, pulando registro do SW para evitar loops');
    return;
  }
  
  // Em iOS, apenas registrar o SW, sem atualizações automáticas ou recargas
  if (isOnline()) {
    const swUrl = `/sw.js?v=${Date.now()}`;
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('✅ ServiceWorker registrado com sucesso (iOS):', registration.scope);
        
        // Não ativar skipWaiting automaticamente em iOS
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              console.log(`🔄 ServiceWorker estado alterado: ${newWorker.state}`);
            });
          }
        });
      })
      .catch(error => {
        console.error('❌ Falha ao registrar o ServiceWorker (iOS):', error);
      });
  } else {
    console.log('📵 Dispositivo offline - pulando registro do Service Worker');
  }
}

// Registro normal para outros navegadores
function registerNormally() {
  // Evitar recarregamentos infinitos em caso de falha de rede
  let isRegistering = false;
  
  // Função principal de registro
  const registerSW = async () => {
    try {
      // Se já estiver tentando registrar, não tente novamente
      if (isRegistering) return;
      isRegistering = true;
      
      // Em casos de problemas de cache, tentar limpar caches
      // Verificar se há um parâmetro especial na URL para forçar limpeza
      const urlParams = new URLSearchParams(window.location.search);
      const forceClear = urlParams.get('clear_cache') === 'true';
      
      if (forceClear) {
        console.log('🧹 Forçando limpeza de cache por parâmetro de URL');
        await clearAppCaches();
      }
      
      // Verificar registros existentes apenas se online
      if (isOnline()) {
        const existingRegistrations = await navigator.serviceWorker.getRegistrations();
        
        // Verificar se precisamos atualizar registros existentes
        if (existingRegistrations.length > 0) {
          console.log(`🔄 ${existingRegistrations.length} Service Worker(s) registrado(s)`);
          
          for (const reg of existingRegistrations) {
            console.log('🔄 Atualizando ServiceWorker existente');
            
            try {
              await reg.update();
            } catch (updateError) {
              console.error('❌ Erro ao atualizar registro existente:', updateError);
              // Não interromper a execução por falha na atualização
            }
            
            if (reg.waiting) {
              console.log('⏭️ ServiceWorker em waiting - enviando SKIP_WAITING');
              // Ativar automaticamente o novo service worker
              reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
          }
        }
      } else {
        console.log('📵 Dispositivo offline - pulando atualização do Service Worker');
      }
      
      // Registrar com uma marca de tempo para evitar cache do navegador
      const swUrl = `/sw.js?v=${Date.now()}`;
      console.log(`🔄 Registrando ServiceWorker de: ${swUrl}`);
      
      // Registrar o service worker mesmo offline (usará a versão em cache)
      const registration = await navigator.serviceWorker.register(swUrl);
      console.log('✅ ServiceWorker registrado com sucesso:', registration.scope);
      
      // Configurar ouvinte para atualizações futuras
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            console.log(`🔄 ServiceWorker estado alterado: ${newWorker.state}`);
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🆕 Nova versão do ServiceWorker instalada');
              
              // Sempre ativar automaticamente o novo service worker
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        }
      });
      
      // Configurar ouvinte para controllerchange - com proteção contra recargas repetidas
      let reloadAttempted = false;
      
      // Marcar que a página está em carga inicial
      const pageLoadTime = Date.now();
      const MIN_TIME_BEFORE_RELOAD = 3000; // Não recarregar nos primeiros 3 segundos
      
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Service Worker controller changed');
        
        // Não recarregar se a página acabou de carregar (evita loops)
        const timeSinceLoad = Date.now() - pageLoadTime;
        if (timeSinceLoad < MIN_TIME_BEFORE_RELOAD) {
          console.log('🛑 Evitando recarga: página acabou de carregar');
          return;
        }
        
        // Verificar se já recarregou recentemente para evitar loops
        if (!hasReloadedRecently() && isOnline() && !reloadAttempted) {
          reloadAttempted = true;
          markReload(); // Registrar timestamp da recarga
          console.log('🔁 Recarregando página após alteração do controller');
          window.location.reload();
        } else {
          console.log('🛑 Evitando recarga repetida: recarga recente ou dispositivo offline');
        }
      });
      
    } catch (error) {
      console.error('❌ Falha ao registrar o ServiceWorker:', error);
    } finally {
      isRegistering = false;
    }
  };
  
  // Executar o registro inicial
  registerSW();
}
