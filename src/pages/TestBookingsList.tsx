import React from "react";
import ProfessionalBookingsList from "@/components/professional/ProfessionalBookingsList";

// Sample appointments data
const dummyAppointments = [
  {
    id: "1",
    startTime: "2025-05-20T09:00:00.000Z",
    endTime: "2025-05-20T10:00:00.000Z",
    status: "pending",
    service: {
      id: "s1",
      name: "Corte de Cabelo",
      duration: 60
    },
    user: {
      id: "u1",
      name: "João Silva"
    }
  },
  {
    id: "2",
    startTime: "2025-05-21T14:00:00.000Z",
    endTime: "2025-05-21T15:30:00.000Z",
    status: "confirmed",
    services: [
      {
        service: {
          id: "s2",
          name: "Tintura",
          duration: 90
        }
      }
    ],
    user: {
      id: "u2",
      name: "Maria Santos"
    }
  }
];

const TestBookingsList = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Teste de Agendamentos</h1>
      <p className="text-gray-600 mb-6">Página de teste com dados estáticos para depuração</p>
      
      <div className="bg-yellow-100 p-4 rounded-md mb-6">
        <p className="font-medium">Dados de teste estáticos</p>
        <p>Esta página contém dados fixos para testar a renderização dos componentes.</p>
      </div>
      
      <ProfessionalBookingsList 
        appointments={dummyAppointments}
        showActions={true}
        emptyMessage="Você não tem agendamentos."
      />
    </div>
  );
};

export default TestBookingsList;
