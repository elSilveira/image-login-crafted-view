
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import BookingCalendar from "@/components/booking/BookingCalendar";
import BookingTimeSlots from "@/components/booking/BookingTimeSlots";

const BookingReschedule = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>();
  
  // Mock data - In a real app, this would come from an API
  const booking = {
    id: bookingId,
    service: "Corte de Cabelo Masculino",
    professional: {
      id: "1",
      name: "João Silva",
      avatar: "https://source.unsplash.com/random/100x100/?portrait",
    },
    date: new Date(),
    time: "14:00",
    price: 80,
    duration: 45,
  };

  const handleReschedule = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma data e horário",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be an API call
    toast({
      title: "Agendamento remarcado",
      description: `Seu agendamento foi remarcado para ${selectedDate.toLocaleDateString('pt-BR')} às ${selectedTime}`,
    });
    
    navigate("/booking-history");
  };

  const handleCancel = () => {
    navigate("/booking-history");
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Reagendar Agendamento</h1>
          
          {/* Current Booking Info */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{booking.service}</h2>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{booking.duration} minutos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Com {booking.professional.name}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm font-medium">
                    Agendado para: {booking.date.toLocaleDateString('pt-BR')} às {booking.time}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold">R$ {booking.price}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Date Selection */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Selecione uma nova data e horário</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <BookingCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  onNext={() => {}}
                />
              </div>
              <div>
                {selectedDate && (
                  <BookingTimeSlots
                    date={selectedDate}
                    onTimeSelect={setSelectedTime}
                    selectedTime={selectedTime}
                    onNext={() => {}}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleReschedule}>
                Confirmar Reagendamento
              </Button>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <p>
              Cancelamentos podem ser feitos gratuitamente com até 4 horas de
              antecedência. Após esse prazo, poderá haver cobrança de taxa.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingReschedule;
