import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, RefreshCw, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import ServicesList from "./ServicesList";

interface BookingHistoryListProps {
  status: "scheduled" | "completed" | "cancelled";
}

const BookingHistoryList = ({ status }: BookingHistoryListProps) => {
  // Mock data - in a real app this would come from an API
  const appointments = [
    {
      id: 1,
      services: [
        { id: "s1", name: "Corte de Cabelo Masculino", price: 80, duration: 30 },
        { id: "s2", name: "Barba", price: 40, duration: 20 }
      ],
      professional: "João Silva",
      date: "2025-05-15",
      time: "14:00",
      totalPrice: 120,
      status: "scheduled",
    },
    {
      id: 2,
      services: [
        { id: "s2", name: "Barba", price: 40, duration: 20 }
      ],
      professional: "João Silva",
      date: "2025-05-10",
      time: "15:30",
      totalPrice: 40,
      status: "scheduled",
    },
    {
      id: 3,
      services: [
        { id: "s3", name: "Coloração", price: 150, duration: 60 },
        { id: "s4", name: "Hidratação", price: 80, duration: 45 }
      ],
      professional: "Maria Santos",
      date: "2025-03-25",
      time: "10:00",
      totalPrice: 230,
      status: "completed",
    },
    {
      id: 4,
      services: [
        { id: "s5", name: "Manicure", price: 60, duration: 40 }
      ],
      professional: "Ana Oliveira",
      date: "2025-03-20",
      time: "16:00",
      totalPrice: 60,
      status: "completed",
    },
    {
      id: 5,
      services: [
        { id: "s6", name: "Pedicure", price: 80, duration: 50 }
      ],
      professional: "Ana Oliveira",
      date: "2025-03-15",
      time: "09:00",
      totalPrice: 80,
      status: "cancelled",
    }
  ].filter(appointment => appointment.status === status);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-iazi-primary">Confirmado</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="border-red-500 text-red-500">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  const getActionButtons = (status: string, id: number) => {
    switch (status) {
      case "scheduled":
        return (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-50 font-inter" asChild>
              <Link to={`/booking/${id}/cancel`}>Cancelar</Link>
            </Button>
            <Button size="sm" variant="outline" className="font-inter" asChild>
              <Link to={`/booking/${id}/reschedule`}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Reagendar
              </Link>
            </Button>
          </div>
        );
      case "completed":
        return (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="font-inter" asChild>
              <Link to={`/reviews/create/${id}`}>
                <Star className="h-3 w-3 mr-1" />
                Avaliar
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="font-inter" asChild>
              <Link to={`/booking/${id}/receipt`}>
                <FileText className="h-3 w-3 mr-1" />
                Recibo
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="bg-iazi-primary text-white hover:bg-iazi-primary-hover font-inter" asChild>
              <Link to={`/booking/${id}/reschedule`}>Agendar Novamente</Link>
            </Button>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="bg-iazi-primary text-white hover:bg-iazi-primary-hover font-inter" asChild>
              <Link to={`/booking/${id}/reschedule`}>Agendar Novamente</Link>
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-md transition-shadow border-iazi-border">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-1">
                  <div className="bg-iazi-background-alt rounded-md p-3 text-center min-w-[70px]">
                    <p className="text-sm font-medium font-inter">
                      {new Date(appointment.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </p>
                    <div className="flex items-center justify-center mt-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {appointment.time}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    {/* Display services using ServicesList component */}
                    <ServicesList 
                      services={appointment.services} 
                      showPrice={false} 
                      compact={appointment.services.length > 1}
                    />
                    
                    <Link 
                      to={`/professional/${appointment.professional.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-muted-foreground hover:text-iazi-primary font-inter block mt-1"
                    >
                      com {appointment.professional}
                    </Link>
                    
                    <div className="flex items-center justify-between mt-2">
                      {getStatusBadge(appointment.status)}
                      <span className="font-medium font-inter text-iazi-text">
                        R$ {appointment.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 md:mt-0">
                  {getActionButtons(appointment.status, appointment.id)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center p-10">
          <p className="text-muted-foreground font-inter">Nenhum agendamento encontrado</p>
        </div>
      )}
    </div>
  );
};

export default BookingHistoryList;
