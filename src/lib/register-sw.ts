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

// Função para verificar e atualizar o Service Worker
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      console.log('🔄 ServiceWorker Debug - Attempting to register ServiceWorker');
      
      // Evitar recarregamentos infinitos em caso de falha de rede
      let isRegistering = false;
      
      try {
        // Se já estiver tentando registrar, não tente novamente
        if (isRegistering) return;
        isRegistering = true;
        
        // Detectar plataforma
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        console.log(`📱 Plataforma detectada: ${isIOS ? 'iOS' : 'Não iOS'}`);
        
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
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('🔄 Service Worker controller changed');
          
          // Só recarregar se estiver online e for o primeiro controllerchange
          if (isOnline() && !reloadAttempted) {
            reloadAttempted = true;
            console.log('🔁 Recarregando página após alteração do controller');
            window.location.reload();
          } else {
            console.log('🛑 Evitando recarga repetida ou dispositivo offline');
          }
        });
        
      } catch (error) {
        console.error('❌ Falha ao registrar o ServiceWorker:', error);
      } finally {
        isRegistering = false;
      }
    });
  }
}
