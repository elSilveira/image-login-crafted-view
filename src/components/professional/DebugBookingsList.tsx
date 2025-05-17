import React, { useEffect } from "react";

// Define appointment interface
interface Service {
  id: string;
  name: string;
  duration?: number;
  price?: number | string;
}

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  location?: string;
  service?: Service;
  services?: { service: Service }[];
  user?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
}

interface DebugBookingsListProps {
  appointments: Appointment[];
  showActions: boolean;
  emptyMessage: string;
}

const DebugBookingsList = ({ 
  appointments, 
  showActions,
  emptyMessage
}: DebugBookingsListProps) => {
  
  useEffect(() => {
    console.log('DebugBookingsList received appointments:', appointments);
    console.log('DebugBookingsList appointments length:', appointments.length);
    
    if (appointments && appointments.length > 0) {
      console.log('First appointment sample:', appointments[0]);
    } else {
      console.log('No appointments received');
    }
  }, [appointments]);

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-gray-50">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Debug Mode: {appointments.length} Appointments</h2>
      
      {appointments.map((appointment) => (
        <div key={appointment.id} className="p-4 border rounded-lg">
          <div className="flex justify-between">
            <div>
              <p><strong>ID:</strong> {appointment.id}</p>
              <p><strong>Status:</strong> {appointment.status}</p>
              <p><strong>Start Time:</strong> {appointment.startTime}</p>
              <p><strong>End Time:</strong> {appointment.endTime}</p>
              <p><strong>Service:</strong> {appointment.service?.name || 
                (appointment.services && appointment.services.length > 0 ? 
                  appointment.services[0].service?.name : 'No service')}</p>
              <p><strong>Client:</strong> {appointment.user?.name || 'Unknown client'}</p>
            </div>
            
            {showActions && (
              <div className="space-y-2">
                <button className="px-3 py-1 bg-green-100 text-green-800 rounded">Confirm</button>
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded">Reschedule</button>
                <button className="px-3 py-1 bg-red-100 text-red-800 rounded">Cancel</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DebugBookingsList;
