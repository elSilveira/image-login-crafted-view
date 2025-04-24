import { CalendarDays, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const AppointmentSection = () => {
  // Temporary mock data - will be replaced with real data later
  const appointments = [
    {
      id: 1,
      service: "Corte de Cabelo",
      professional: "João Silva",
      date: "2025-04-25",
      time: "14:00",
    },
    {
      id: 2,
      service: "Manicure",
      professional: "Maria Santos",
      date: "2025-04-26",
      time: "10:00",
    },
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Próximos Agendamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div>
                <h4 className="font-semibold">{appointment.service}</h4>
                <p className="text-sm text-gray-600">{appointment.professional}</p>
                <p className="text-sm text-gray-600">
                  {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                </p>
              </div>
              <Button variant="outline" size="sm" className="hover:bg-[#4664EA] hover:text-white">
                Reagendar
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentSection;
