import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function PwaUpdateNotification() {
  const [waitingServiceWorker, setWaitingServiceWorker] = useState<ServiceWorker | null>(null);
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingServiceWorker(newWorker);
                setShowReload(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleReload = () => {
    if (waitingServiceWorker) {
      // Send a message to the waiting service worker to skip waiting
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page when the new service worker takes over
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    } else {
      // If for some reason the service worker isn't available, just reload
      window.location.reload();
    }
  };

  if (!showReload) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-2 bg-primary text-white shadow-lg text-center animate-slide-down">
      <div className="flex items-center justify-center space-x-2">
        <p className="text-sm">Uma nova versão está disponível</p>
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={handleReload}
          className="bg-white text-primary hover:bg-gray-100"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Atualizar
        </Button>
      </div>
    </div>
  );
}
