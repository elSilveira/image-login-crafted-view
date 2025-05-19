import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Show brief confirmation that we're back online
      setShowOfflineMessage(true);
      setTimeout(() => setShowOfflineMessage(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineMessage) return null;

  return (
    <div 
      className={`fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50 py-2 px-4 rounded-full shadow-lg flex items-center space-x-2 ${
        isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      } animate-bounce-in`}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          <span className="text-sm font-medium">Conexão restaurada</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">Você está offline</span>
        </>
      )}
    </div>
  );
}
