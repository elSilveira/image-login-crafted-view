import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import App from './App.tsx';
// import TestApp from './TestApp.tsx';
// import SimpleApp from './SimpleApp.tsx';
// import GradualApp from './GradualApp.tsx';
// import WorkingApp from './WorkingApp.tsx';
import PwaApp from './PwaApp.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 3, // Limitar a 3 tentativas
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial com máximo de 30 segundos
      refetchOnWindowFocus: false, // Evitar refetch quando a janela ganha foco
    },
  },
});

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PwaApp />
    </QueryClientProvider>
  </React.StrictMode>
);
