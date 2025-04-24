
import { CalendarDays, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const AppointmentSection = () => {
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
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl font-playfair">
          <Clock className="h-5 w-5" />
          Próximos Agendamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col gap-2">
                <div>
                  <h4 className="font-playfair font-semibold text-base">{appointment.service}</h4>
                  <p className="text-sm text-gray-600 font-inter">{appointment.professional}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 font-inter">
                    {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                  </p>
                  <Button variant="outline" size="sm" className="hover:bg-[#4664EA] hover:text-white font-inter">
                    Reagendar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentSection;
