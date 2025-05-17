import React, { useEffect, useState } from 'react';

/**
 * A debug component that allows toggling between mock data and real API data
 * for testing purposes.
 */
const MockDataToggle = () => {
  const [useMockData, setUseMockData] = useState(() => 
    localStorage.getItem('useMockAppointmentsData') === 'true'
  );
  
  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('useMockAppointmentsData', useMockData ? 'true' : 'false');
  }, [useMockData]);
  
  const toggleMockData = () => {
    setUseMockData(prev => !prev);
  };
  
  return (
    <div className="fixed bottom-20 right-4 bg-yellow-100 p-3 rounded shadow-md z-50 text-xs">
      <h4 className="font-bold">API Mode:</h4>
      <div className="flex items-center gap-2 mt-2">
        <button 
          onClick={toggleMockData}
          className={`px-2 py-1 rounded ${useMockData ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          Mock Data
        </button>
        <button 
          onClick={toggleMockData}
          className={`px-2 py-1 rounded ${!useMockData ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Real API
        </button>
      </div>
      <p className="mt-2 text-gray-700">
        {useMockData ? 'Using mock appointments data' : 'Using real API data'}
      </p>
      <p className="mt-1 text-gray-500 text-[10px]">
        Click a button to toggle
      </p>
    </div>
  );
};

export default MockDataToggle;
