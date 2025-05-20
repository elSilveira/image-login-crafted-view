import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

async function clearAppCaches() {
  if ('caches' in window) {
    try {
      // Listar todos os caches disponíveis
      const cacheNames = await caches.keys();
      console.log('🧹 Limpando caches:', cacheNames);

      // Excluir todos os caches encontrados
      const deletionPromises = cacheNames.map(cacheName => {
        console.log(`🧹 Removendo cache: ${cacheName}`);
        return caches.delete(cacheName);
      });

      await Promise.all(deletionPromises);
      console.log('🧹 Limpeza de cache concluída');
      
      // Verificar service workers e atualizá-los
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        
        for (const registration of registrations) {
          console.log('🔄 Atualizando ServiceWorker');
          await registration.update();
          
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar caches:', error);
      return false;
    }
  }
  return false;
}

export function ClearCacheButton() {
  const [isClearing, setIsClearing] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleClearCache = async () => {
    setIsClearing(true);
    
    try {
      const cleared = await clearAppCaches();
      
      if (cleared) {
        setShowSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setIsClearing(false);
      }
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      setIsClearing(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={handleClearCache}
        disabled={isClearing || showSuccess}
        className="flex items-center space-x-1"
      >
        <RefreshCw className={`h-4 w-4 mr-1 ${isClearing ? 'animate-spin' : ''}`} />
        <span>
          {isClearing
            ? 'Limpando cache...'
            : showSuccess
            ? 'Cache limpo! Recarregando...'
            : 'Limpar cache do app'}
        </span>
      </Button>
      
      {showSuccess && (
        <p className="text-xs text-green-600 mt-1">
          Cache limpo com sucesso! A página será recarregada.
        </p>
      )}
    </div>
  );
} 