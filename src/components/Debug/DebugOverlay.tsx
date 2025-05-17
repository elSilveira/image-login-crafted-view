import React from 'react';

interface DebugOverlayProps {
  data: any;
  show?: boolean;
  title?: string;
}

const DebugOverlay: React.FC<DebugOverlayProps> = ({ 
  data, 
  show = true,
  title = "Debug Data" 
}) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-0 right-0 p-4 bg-black bg-opacity-80 text-white max-w-md max-h-96 overflow-auto rounded-tl-md z-50">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <pre className="text-xs whitespace-pre-wrap">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default DebugOverlay;
