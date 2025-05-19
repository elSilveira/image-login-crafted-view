export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      console.log('🔄 ServiceWorker Debug - Attempting to register ServiceWorker');
      
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ ServiceWorker registrado com sucesso:', registration.scope);
        })
        .catch((error) => {
          console.error('❌ Falha ao registrar o ServiceWorker:', error);
        });
    });
  }
}
