
import React from "react";
import ProfessionalBookingsList from "@/components/professional/ProfessionalBookingsList";
import { PageContainer } from "@/components/ui/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays } from "lucide-react";

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
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-iazi-primary" />
            <h1 className="text-2xl font-bold">Agendamentos de Teste</h1>
          </div>
        </div>

        <Card className="border-iazi-border">
          <CardHeader className="bg-muted/30 pb-3">
            <CardTitle className="text-lg">Dados de Teste</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-gray-600 mb-2">Esta página contém dados estáticos para testar a renderização dos componentes.</p>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
              <p className="text-sm text-yellow-700">
                Esta página usa dados simulados. Para ver seus agendamentos reais, acesse a página principal.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-iazi-border">
          <CardHeader className="bg-muted/30 pb-3">
            <CardTitle className="text-lg">Lista de Agendamentos</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ProfessionalBookingsList 
              appointments={dummyAppointments}
              showActions={true}
              emptyMessage="Você não tem agendamentos."
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default TestBookingsList;
