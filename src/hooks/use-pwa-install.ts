import { useState, useEffect } from 'react';

declare global {
  interface Window {
    deferredPrompt: any;
  }
}

export function usePwaInstall() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Check if the app is already installed (in standalone or full screen mode)
    const isInStandaloneMode = () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.matchMedia('(display-mode: fullscreen)').matches || 
      (window.navigator as any).standalone === true;
    
    setIsPWA(isInStandaloneMode());

    // Event listener for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setCanInstall(true);
      console.log('🌐 PWA - BeforeInstallPrompt detected in hook');
    };

    // Add event listener
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Event listener for app installed
    const handleAppInstalled = () => {
      setCanInstall(false);
      setIsPWA(true);
      window.deferredPrompt = null;
      console.log('🌐 PWA - App was installed');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installable
    setCanInstall(!!window.deferredPrompt);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!window.deferredPrompt) {
      console.log('🌐 PWA - No installation prompt available');
      return;
    }

    setIsInstalling(true);

    try {
      // Show the installation prompt
      window.deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const choiceResult = await window.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('🌐 PWA - User accepted the installation prompt');
        setIsPWA(true);
      } else {
        console.log('🌐 PWA - User dismissed the installation prompt');
      }
      
      // Clear the saved prompt
      window.deferredPrompt = null;
      setCanInstall(false);
    } catch (err) {
      console.error('🌐 PWA - Error during installation:', err);
    } finally {
      setIsInstalling(false);
    }
  };

  return { 
    canInstall, 
    isInstalling, 
    isPWA, 
    handleInstallPWA 
  };
}