import React from "react";
import { ClearCacheButton } from "@/components/ui/clear-cache-button";

export const PWADiagnostics = () => {
  const [swInfo, setSwInfo] = React.useState<{
    registered: boolean;
    controller: boolean;
    version?: string;
  }>({
    registered: false,
    controller: false
  });
  
  const [cacheInfo, setCacheInfo] = React.useState<{
    available: boolean;
    names: string[];
  }>({
    available: false,
    names: []
  });
  
  React.useEffect(() => {
    // Verificar Service Worker
    const checkServiceWorker = async () => {
      try {
        const registered = 'serviceWorker' in navigator;
        const controller = !!navigator.serviceWorker.controller;
        
        let version = 'Desconhecida';
        if (registered) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          if (registrations.length > 0) {
            // Tentar obter a versão do cache do SW
            const scope = registrations[0].scope;
            version = `Escopo: ${scope}`;
          }
        }
        
        setSwInfo({ registered, controller, version });
      } catch (err) {
        console.error('Erro ao verificar SW:', err);
      }
    };
    
    // Verificar Cache
    const checkCache = async () => {
      try {
        const available = 'caches' in window;
        let names: string[] = [];
        
        if (available) {
          names = await caches.keys();
        }
        
        setCacheInfo({ available, names });
      } catch (err) {
        console.error('Erro ao verificar cache:', err);
      }
    };
    
    checkServiceWorker();
    checkCache();
  }, []);
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Diagnóstico do PWA</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium mb-2">Service Worker</h4>
        <ul className="text-sm">
          <li className="mb-1">
            <span className="font-medium">Disponível:</span>{' '}
            <span className={swInfo.registered ? 'text-green-600' : 'text-red-600'}>
              {swInfo.registered ? 'Sim' : 'Não'}
            </span>
          </li>
          <li className="mb-1">
            <span className="font-medium">Ativo:</span>{' '}
            <span className={swInfo.controller ? 'text-green-600' : 'text-red-600'}>
              {swInfo.controller ? 'Sim' : 'Não'}
            </span>
          </li>
          {swInfo.version && (
            <li className="mb-1">
              <span className="font-medium">Versão:</span> {swInfo.version}
            </li>
          )}
        </ul>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium mb-2">Cache</h4>
        <ul className="text-sm">
          <li className="mb-1">
            <span className="font-medium">Disponível:</span>{' '}
            <span className={cacheInfo.available ? 'text-green-600' : 'text-red-600'}>
              {cacheInfo.available ? 'Sim' : 'Não'}
            </span>
          </li>
          {cacheInfo.names.length > 0 && (
            <li className="mb-1">
              <span className="font-medium">Caches:</span>{' '}
              <ul className="ml-4 list-disc">
                {cacheInfo.names.map(name => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      </div>
      
      <div className="mt-4">
        <ClearCacheButton />
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Para forçar uma atualização completa, você também pode acessar:</p>
        <code className="bg-gray-100 p-1 rounded">/?clear_cache=true</code>
      </div>
    </div>
  );
}; 