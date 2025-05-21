import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Helper para detectar Safari no iOS
const isSafariOnIOS = (): boolean => {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isSafari = /Safari/i.test(ua) && !/Chrome/i.test(ua);
  return isIOS && isSafari;
};

// Componente que estabiliza a carga inicial no Safari iOS
const PageLoadStabilizer: React.FC = () => {
  const [isStabilized, setIsStabilized] = useState(false);
  
  useEffect(() => {
    // Só aplicar no Safari iOS
    if (!isSafariOnIOS()) {
      setIsStabilized(true);
      return;
    }
    
    // Verificar se já completou o fluxo de estabilização
    const stabilized = sessionStorage.getItem('page_load_stabilized');
    if (stabilized) {
      setIsStabilized(true);
      return;
    }
    
    // Marcar como estabilizado após um curto período
    const timer = setTimeout(() => {
      sessionStorage.setItem('page_load_stabilized', 'true');
      setIsStabilized(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Durante estabilização, exibir tela minimalista para evitar recargas
  if (!isStabilized) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Carregando aplicativo</h2>
          <p className="text-sm text-gray-500">Por favor, aguarde...</p>
        </div>
      </div>
    );
  }
  
  // Quando estabilizado, não renderiza nada (passa para os filhos)
  return null;
};

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`w-full max-w-screen-xl mx-auto px-4 pb-12 ${className}`}>
      <PageLoadStabilizer />
      {children}
    </div>
  );
}
