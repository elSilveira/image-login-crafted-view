import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const ProfessionalIdDebugger = () => {
  const { user } = useAuth();

  useEffect(() => {
    console.log('AuthContext User:', user);
    console.log('Professional ID:', user?.professionalId);
    
    if (!user) {
      console.warn('No user is logged in');
    } else if (!user.professionalId) {
      console.warn('User is logged in but has no professionalId');
    } else {
      console.log('Valid professional ID found:', user.professionalId);
    }
  }, [user]);

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 p-3 rounded shadow-md z-50 text-xs">
      <h4 className="font-bold">Debug Info:</h4>
      <p><strong>User ID:</strong> {user?.id || 'Not logged in'}</p>
      <p><strong>Professional ID:</strong> {user?.professionalId || 'Not available'}</p>
      <p className="mt-2 text-gray-500">Check console for more details</p>
    </div>
  );
};

export default ProfessionalIdDebugger;
