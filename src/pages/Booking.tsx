
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, AlertCircle } from "lucide-react";
import BookingCalendar from "@/components/booking/BookingCalendar";
import BookingTimeSlots from "@/components/booking/BookingTimeSlots";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

const STEPS = [
  { id: 1, title: "Selecionar Horário" },
  { id: 2, title: "Confirmar Agendamento" },
];

const Booking = () => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = React.useState<string>();
  const navigate = useNavigate();

  // Mock data - In a real app, this would come from an API
  const service = {
    id: "1",
    name: "Corte de Cabelo Masculino",
    price: 80,
    duration: 45,
  };

  const professional = {
    id: "1",
    name: "João Silva",
    avatar: "https://source.unsplash.com/random/100x100/?portrait",
  };

  const progress = (currentStep / STEPS.length) * 100;

  const handleFinishBooking = (formData: any) => {
    // In a real app, this would make an API call
    console.log("Booking confirmed:", {
      service,
      professional,
      date: selectedDate,
      time: selectedTime,
      formData
    });
    
    // Navigate to booking history after successful booking
    navigate("/booking-history");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Selecione uma data</h3>
              <BookingCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onNext={() => selectedDate && setCurrentStep(2)}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Selecione um horário</h3>
              <BookingTimeSlots
                date={selectedDate || new Date()}
                onTimeSelect={setSelectedTime}
                selectedTime={selectedTime}
                onBack={() => {}}
                onNext={() => selectedDate && selectedTime && setCurrentStep(2)}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <BookingConfirmation
            service={service}
            professional={professional}
            date={selectedDate!}
            time={selectedTime!}
            onBack={() => setCurrentStep(1)}
            onSubmit={handleFinishBooking}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <Progress value={progress} className="mb-2" />
            <div className="flex justify-between text-sm">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`${
                    step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </div>
              ))}
            </div>
          </div>

          {/* Service and Professional Info */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{service.name}</h2>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration} minutos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Com {professional.name}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold">R$ {service.price}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Step Content */}
          <div className="bg-card rounded-lg border p-6">
            {renderStep()}
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

export default Booking;
