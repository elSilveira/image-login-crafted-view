export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      console.log('🔄 ServiceWorker Debug - Attempting to register ServiceWorker');
      
      try {
        // Verificar se já existe um service worker
        const existingRegistration = await navigator.serviceWorker.getRegistration();
        
        // Se estiver no iOS, forçar a atualização do service worker
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        if (isIOS && existingRegistration) {
          console.log('📱 iOS detectado - Atualizando ServiceWorker');
          await existingRegistration.update();
        }
        
        // Registrar o novo service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ ServiceWorker registrado com sucesso:', registration.scope);
        
        // Em iOS, precisamos garantir que o service worker está ativo
        if (isIOS && registration.waiting) {
          console.log('📱 iOS - Forçando ativação do ServiceWorker');
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      } catch (error) {
        console.error('❌ Falha ao registrar o ServiceWorker:', error);
      }
    });
  }
}
