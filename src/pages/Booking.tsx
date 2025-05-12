import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, AlertCircle } from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ServiceProviders from "@/components/ServiceProviders";
import BookingCalendar from "@/components/booking/BookingCalendar";
import BookingTimeSlots from "@/components/booking/BookingTimeSlots";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import Navigation from "@/components/Navigation";
import { useQuery } from '@tanstack/react-query';
import { fetchServiceDetails, fetchProfessionalDetails } from '@/lib/api';

const STEPS = [
  { id: 1, title: "Selecionar Profissional" },
  { id: 2, title: "Selecionar Horário" },
  { id: 3, title: "Confirmar Agendamento" },
];

const Booking = () => {
  const { serviceId } = useParams();
  const location = useLocation();
  // Extract professional ID from URL or state
  const searchParams = new URLSearchParams(location.search);
  const professionalParam = searchParams.get('professional') || undefined;
  const isCompanyBooking = location.search.includes('company=true');
  const [currentStep, setCurrentStep] = React.useState(isCompanyBooking ? 1 : 2);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = React.useState<string>();
  const [selectedProfessional, setSelectedProfessional] = React.useState<string | undefined>();
  const navigate = useNavigate();

  // Fetch service details
  const { data: serviceData, isLoading: loadingService, isError: errorServiceFlag, error: errorService } = useQuery<any, Error>({
    queryKey: ['service', serviceId],
    queryFn: () => fetchServiceDetails(serviceId!),
    enabled: !!serviceId,
  });

  // Determine which professional to use: URL param or selected
  const professionalIdUsed = professionalParam || selectedProfessional;
  const { data: professionalData, isLoading: loadingProfessional, isError: errorProfessionalFlag, error: errorProfessional } = useQuery<any, Error>({
    queryKey: ['professional', professionalIdUsed],
    queryFn: () => fetchProfessionalDetails(professionalIdUsed!),
    enabled: !!professionalIdUsed,
  });

  // Handle loading and error states
  if (loadingService || loadingProfessional) {
    return <div className="min-h-screen bg-gray-50 flex justify-center items-center"><Progress value={0} /></div>;
  }
  if (errorServiceFlag || errorProfessionalFlag) {
    return <div className="min-h-screen bg-gray-50 flex justify-center items-center text-red-500">Erro ao carregar dados.</div>;
  }
  const service = serviceData!;
  const professional = professionalData!;

  const progress = (currentStep / STEPS.length) * 100;

  const handleProfessionalSelect = (professionalId: string) => {
    setSelectedProfessional(professionalId);
    setCurrentStep(2);
  };

  const handleFinishBooking = (formData: any) => {
    console.log("Booking confirmed:", {
      service,
      professional,
      date: selectedDate,
      time: selectedTime,
      formData
    });
    navigate("/booking-history");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return isCompanyBooking ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Selecione o Profissional</h2>
            <ServiceProviders 
              serviceId={Number(serviceId)} 
              onProviderSelect={handleProfessionalSelect}
            />
          </div>
        ) : null;
      case 2:
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <BookingCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onNext={() => {}}
                professionalId={professional.id}
                serviceSchedule={professional.services?.find((s: any) => s.id === service.id)?.schedule}
              />
            </div>
            <div>
              {selectedDate && (
                <BookingTimeSlots
                  date={selectedDate}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                  onNext={() => selectedDate && selectedTime && setCurrentStep(3)}
                  professionalId={professional.id}
                  serviceId={service.id}
                  // Pass schedule for the selected service
                  serviceSchedule={professional.services?.find((s: any) => s.id === service.id)?.schedule}
                />
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <BookingConfirmation
            service={service}
            professional={professional}
            date={selectedDate!}
            time={selectedTime!}
            onBack={() => setCurrentStep(2)}
            onSuccess={handleFinishBooking}
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
              {STEPS.slice(isCompanyBooking ? 0 : 1).map((step) => (
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
                    {currentStep > 1 && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>Com {professional.name}</span>
                      </div>
                    )}
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
