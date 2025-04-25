
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BookingTimeSlots from "@/components/booking/BookingTimeSlots";
import ServiceProviders from "@/components/ServiceProviders";
import Navigation from "@/components/Navigation";
import { services } from "@/lib/mock-services";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

const CompanyBooking = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [currentStep, setCurrentStep] = useState<"service" | "provider" | "datetime">("service");

  // Filter services by company_id
  const companyServices = services.filter(
    (service) => service.company_id === companyId
  );

  const handleServiceSelect = (serviceId: number) => {
    setSelectedService(serviceId);
    setCurrentStep("provider");
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    setCurrentStep("datetime");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const handleBack = () => {
    if (currentStep === "datetime") {
      setCurrentStep("provider");
    } else if (currentStep === "provider") {
      setCurrentStep("service");
    }
  };

  const handleBookingSubmit = () => {
    if (!selectedService || !selectedProvider || !selectedDate || !selectedTime) {
      return;
    }

    // In a real app, you would send this data to an API
    toast.success("Agendamento realizado com sucesso!");
    navigate("/booking-history");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container max-w-7xl mx-auto py-8 px-4 pt-20">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-playfair mb-2">Agendar Serviço</h1>
            <p className="text-muted-foreground">
              Selecione o serviço e o profissional de sua preferência
            </p>
          </div>

          <div className="grid gap-6">
            {currentStep === "service" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Serviços Disponíveis</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {companyServices.map((service) => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all ${
                        selectedService === service.id
                          ? "border-primary shadow-md"
                          : "hover:border-border-hover"
                      }`}
                      onClick={() => handleServiceSelect(service.id)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription>
                          {service.duration} • R$ {service.price}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {currentStep === "provider" && selectedService && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Profissionais Disponíveis
                  </h2>
                  <Button variant="outline" onClick={handleBack}>
                    Voltar
                  </Button>
                </div>
                <ServiceProviders 
                  serviceId={selectedService} 
                  onProviderSelect={handleProviderSelect} 
                />
              </div>
            )}

            {currentStep === "datetime" && selectedService && selectedProvider && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Escolha Data e Horário</h2>
                  <Button variant="outline" onClick={handleBack}>
                    Voltar
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Selecione uma data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        className="rounded-md border"
                        disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Selecione um horário</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedDate ? (
                        <BookingTimeSlots
                          date={selectedDate}
                          selectedTime={selectedTime}
                          onTimeSelect={handleTimeSelect}
                          onNext={handleBookingSubmit}
                        />
                      ) : (
                        <p className="text-muted-foreground">
                          Selecione uma data primeiro
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyBooking;
