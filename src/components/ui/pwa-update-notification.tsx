import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export function PwaUpdateNotification() {
  const [waitingServiceWorker, setWaitingServiceWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Armazenar referência ao service worker em espera
                setWaitingServiceWorker(newWorker);
                
                // Acionar atualização automática
                if (newWorker) {
                  console.log('🔄 Nova versão disponível - atualizando automaticamente');
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              }
            });
          }
        });
      });
    }
  }, []);

  // Não renderizar nada, pois a atualização é automática
  return null;
}
