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
    } catch (error) {
      console.error('❌ Erro ao limpar caches:', error);
    }
  }
}

// Função para verificar e atualizar o Service Worker
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      console.log('🔄 ServiceWorker Debug - Attempting to register ServiceWorker');
      
      try {
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
        
        // Verificar registros existentes
        const existingRegistrations = await navigator.serviceWorker.getRegistrations();
        
        // Verificar se precisamos atualizar registros existentes
        if (existingRegistrations.length > 0) {
          console.log(`🔄 ${existingRegistrations.length} Service Worker(s) registrado(s)`);
          
          for (const reg of existingRegistrations) {
            if (isIOS || reg.waiting || forceClear) {
              console.log('🔄 Atualizando ServiceWorker existente');
              await reg.update();
              
              if (reg.waiting) {
                console.log('⏭️ ServiceWorker em waiting - enviando SKIP_WAITING');
                reg.waiting.postMessage({ type: 'SKIP_WAITING' });
              }
            }
          }
        }
        
        // Registrar com uma marca de tempo para evitar cache do navegador
        const swUrl = `/sw.js?v=${Date.now()}`;
        console.log(`🔄 Registrando ServiceWorker de: ${swUrl}`);
        
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
                
                // Se no iOS, forçar ativação imediatamente
                if (isIOS) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              }
            });
          }
        });
        
        // Configurar ouvinte para controllerchange
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('🔄 Service Worker controller changed - reloading page');
          // Recarregar a página quando o controlador mudar
          window.location.reload();
        });
        
      } catch (error) {
        console.error('❌ Falha ao registrar o ServiceWorker:', error);
      }
    });
  }
}
