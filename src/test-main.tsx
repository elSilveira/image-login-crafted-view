import React from 'react';
import { createRoot } from 'react-dom/client';

function TestApp() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600">IAZI App Test Page</h1>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
);
