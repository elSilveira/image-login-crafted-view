// Define custom global type for PWA
declare global {
  interface Window {
    deferredPrompt: any;
  }
}

// Global PWA event handlers
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  console.log('🌐 Global PWA - beforeinstallprompt event captured globally');
});

window.addEventListener('appinstalled', () => {
  console.log('🌐 Global PWA - App was installed');
  window.deferredPrompt = null;
});

// Export to make TypeScript recognize this as a module
export {};
