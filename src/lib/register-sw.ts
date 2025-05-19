export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      console.log('🔄 ServiceWorker Debug - Attempting to register ServiceWorker');
      
      navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      })
        .then((registration) => {
          console.log('✅ ServiceWorker registrado com sucesso:', registration.scope);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
            console.log('🔄 Checking for ServiceWorker updates');
          }, 60 * 60 * 1000); // Check every hour
        })
        .catch((error) => {
          console.error('❌ Falha ao registrar o ServiceWorker:', error);
        });
    });
  }
}
