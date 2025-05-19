import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { useIsMobile } from '@/hooks/use-mobile';

export function InstallAppBanner() {
  const [dismissed, setDismissed] = React.useState(() => 
    localStorage.getItem('pwa-banner-dismissed') === 'true'
  );
  const { canInstall, handleInstallPWA, isPWA } = usePwaInstall();
  const isMobile = useIsMobile();

  // Don't show if not on mobile, already a PWA, or user dismissed
  if (!isMobile || isPWA || dismissed || !canInstall) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <h3 className="font-medium text-sm">Instale o app iAzi</h3>
          <p className="text-xs text-gray-500">Para melhor experiência, instale o app no seu dispositivo</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={handleInstallPWA}
          >
            <Download className="h-4 w-4 mr-1" />
            Instalar
          </Button>
        </div>
      </div>
    </div>
  );
}
