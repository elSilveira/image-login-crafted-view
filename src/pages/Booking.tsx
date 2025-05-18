import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, AlertCircle } from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ServiceProviders from "@/components/ServiceProviders";
import BookingCalendar from "@/components/booking/BookingCalendar";
import BookingTimeSlots from "@/components/booking/BookingTimeSlots";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import ServiceSelector from "@/components/booking/ServiceSelector";
import Navigation from "@/components/Navigation";
import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchServiceDetails, fetchProfessionalDetails, fetchProfessionalAppointments } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { getAvailableSlotsForDate, parseDurationToMinutes, formatDuration } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import ServicesList from "@/components/booking/ServicesList";

const STEPS = [
  { id: 1, title: "Selecionar Profissional" },
  { id: 2, title: "Selecionar Serviços" },
  { id: 3, title: "Selecionar Horário" },
  { id: 4, title: "Confirmar Agendamento" },
];

const Booking = () => {
  const { serviceId } = useParams();
  const serviceIds = serviceId ? serviceId.split(',') : [];
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const professionalParam = searchParams.get('professional') || undefined;
  const dateParam = searchParams.get('date');
  const timeParam = searchParams.get('time');
  const isCompanyBooking = location.search.includes('company=true');
  // If serviceIds are present, skip service selection (step 2)
  const initialStep = serviceIds.length > 0 ? 3 : (isCompanyBooking ? 1 : 2);
  const [currentStep, setCurrentStep] = React.useState(initialStep);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = React.useState<string>();
  const [selectedProfessional, setSelectedProfessional] = React.useState<string | undefined>();
  // State for storing multiple selected services
  const [selectedServices, setSelectedServices] = React.useState<any[]>([]);
  const navigate = useNavigate();

  // Fetch all service details in parallel if multiple IDs
  const serviceQueries = useQueries({
    queries: serviceIds.map(id => ({
      queryKey: ['service', id],
      queryFn: () => fetchServiceDetails(id),
      enabled: !!id,
    }))
  });
  const allServices = serviceQueries.map(q => q.data).filter(Boolean);
  const allServicesLoaded = serviceQueries.every(q => q.isSuccess);

  // If serviceIds are present, preselect the services once loaded
  React.useEffect(() => {
    if (serviceIds.length > 0 && allServicesLoaded && allServices.length && selectedServices.length === 0) {
      setSelectedServices(allServices);
    }
  }, [serviceIds.length, allServicesLoaded, allServices]);

  // Direct navigation to confirmation step if all params are present
  React.useEffect(() => {
    if (serviceId && professionalParam && dateParam && timeParam) {
      // Parse date (YYYY-MM-DD)
      const parsedDate = new Date(dateParam);
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate);
        setSelectedTime(timeParam);
        setSelectedProfessional(professionalParam);
        setCurrentStep(4);
      }
    }
  }, [serviceId, professionalParam, dateParam, timeParam]);

  // On page load, select today's date and show slots
  React.useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
  }, []);

  // Determine which professional to use: URL param or selected
  const professionalIdUsed = professionalParam || selectedProfessional;
  const { data: professionalData, isLoading: loadingProfessional, isError: errorProfessionalFlag, error: errorProfessional } = useQuery({
    queryKey: ['professional', professionalIdUsed],
    queryFn: () => fetchProfessionalDetails(professionalIdUsed!),
    enabled: !!professionalIdUsed,
  });

  // Initialize selectedServices when all service data is loaded
  React.useEffect(() => {
    if (allServicesLoaded && allServices.length && selectedServices.length === 0) {
      setSelectedServices(allServices);
    }
  }, [allServicesLoaded, allServices]);
  
  // Calculate total duration and price from selected services
  const totalDuration = React.useMemo(() => {
    return selectedServices.reduce((sum, service) => {
      const duration = parseDurationToMinutes(service?.duration || 0);
      return sum + duration;
    }, 0);
  }, [selectedServices]);

  const totalPrice = React.useMemo(() => {
    return selectedServices.reduce((sum, service) => sum + (service?.price || 0), 0);
  }, [selectedServices]);

  // Handle adding or removing a service from selection
  const handleServiceSelection = (service: any, isSelected: boolean) => {
    if (isSelected) {
      setSelectedServices(prev => [...prev, service]);
    } else {
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    }
  };

  // Handle loading and error states
  if (serviceIds.length === 0 || serviceQueries.some(q => q.isLoading) || loadingProfessional) {
    return <div className="min-h-screen bg-[#F4F3F2] flex justify-center items-center"><Progress value={0} /></div>;
  }
  
  if (serviceQueries.some(q => q.isError) || errorProfessionalFlag) {
    return <div className="min-h-screen bg-[#F4F3F2] flex justify-center items-center text-red-500">Erro ao carregar dados.</div>;
  }
  
  const professional = professionalData!;
  const progress = (currentStep / STEPS.length) * 100;

  const handleProfessionalSelect = (professionalId: string) => {
    setSelectedProfessional(professionalId);
    // Clear previously selected services when changing professionals
    setSelectedServices([]);
    setCurrentStep(2);
  };

  const handleFinishBooking = (formData: any) => {
    console.log("Booking confirmed:", {
      services: selectedServices,
      professional,
      date: selectedDate,
      time: selectedTime,
      formData
    });
    navigate("/booking-history");
  };

  // In renderStep, skip step 2 if serviceIds are present
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
        // If serviceIds are present, skip this step
        if (serviceIds.length > 0) {
          setCurrentStep(3);
          return null;
        }
        // Só renderiza ServiceSelector se professional e selectedServices existirem
        if (!professional || !professional.id) return null;
        return (
          <div>
            <ServiceSelector 
              professionalId={professional.id}
              selectedServices={selectedServices}
              onServiceSelect={handleServiceSelection}
            />
            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => setCurrentStep(3)} 
                disabled={selectedServices.length === 0}
                className="bg-iazi-primary hover:bg-iazi-primary/90"
              >
                Próximo
              </Button>
            </div>
          </div>
        );
      case 3:
        if (!professional || !professional.id) return null;
        
        // Merge schedules for all selected services
        let mergedServiceSchedule: Array<{ dayOfWeek: string; startTime: string; endTime: string }> = [];
        if (selectedServices.length > 0 && professional.services) {
          // Get all schedules for selected services
          const schedules = selectedServices
            .map(svc => professional.services.find((ps: any) => ps.id === svc.id)?.schedule)
            .filter(Boolean);
          
          // Flatten and merge by dayOfWeek
          const scheduleMap: Record<string, { startTime: string; endTime: string }> = {};
          for (const schArr of schedules) {
            for (const sch of schArr) {
              if (!scheduleMap[sch.dayOfWeek]) {
                scheduleMap[sch.dayOfWeek] = { startTime: sch.startTime, endTime: sch.endTime };
              } else {
                // Earliest start
                if (sch.startTime < scheduleMap[sch.dayOfWeek].startTime) {
                  scheduleMap[sch.dayOfWeek].startTime = sch.startTime;
                }
                // Latest end
                if (sch.endTime > scheduleMap[sch.dayOfWeek].endTime) {
                  scheduleMap[sch.dayOfWeek].endTime = sch.endTime;
                }
              }
            }
          }
          mergedServiceSchedule = Object.entries(scheduleMap).map(([dayOfWeek, { startTime, endTime }]) => ({ dayOfWeek, startTime, endTime }));
        }
        
        return (
          <>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <BookingCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  onNext={() => {}}
                  professionalId={professional.id}
                  serviceSchedule={mergedServiceSchedule}
                />
              </div>
              <div className="flex-1">
                {selectedDate && (
                  <BookingTimeSlots
                    key={`booking-slots-${selectedDate?.toISOString()}-${selectedServices.map(s=>s.id).join(',')}-${professional.id}`}
                    date={selectedDate}
                    selectedTime={selectedTime}
                    onTimeSelect={setSelectedTime}
                    onNext={() => selectedDate && selectedTime && setCurrentStep(4)}
                    professionalId={professional.id}
                    selectedServices={selectedServices}
                    serviceSchedule={mergedServiceSchedule}
                  />
                )}
              </div>
            </div>
            
            {selectedDate && selectedTime && (
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setCurrentStep(4)}
                  className="bg-iazi-primary hover:bg-iazi-primary/90"
                >
                  Próximo
                </Button>
              </div>
            )}
          </>
        );
      case 4:
        return (
          <BookingConfirmation
            services={selectedServices}
            professional={professional}
            date={selectedDate!}
            time={selectedTime!}
            onBack={() => setCurrentStep(3)}
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
      <div className="container mx-auto px-4 py-6 mt-6">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <Progress value={progress} className="mb-2 h-2" />
            <div className="flex justify-between text-sm">
              {STEPS.slice(isCompanyBooking ? 0 : 1).map((step) => (
                <div
                  key={step.id}
                  className={`${
                    step.id <= currentStep ? "text-iazi-primary" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </div>
              ))}
            </div>
          </div>

          {/* Service and Professional Info */}
          <Card className="mb-8 shadow-sm border-none">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  {selectedServices.length === 1 ? (
                    <h2 className="text-2xl font-semibold mb-2">{selectedServices[0]?.name}</h2>
                  ) : (
                    <h2 className="text-2xl font-semibold mb-2">Múltiplos Serviços ({selectedServices.length})</h2>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-iazi-primary" />
                      <span>{formatDuration(totalDuration)}</span>
                    </div>
                    {currentStep > 1 && professional && professional.name && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-iazi-primary" />
                        <span>Com {professional.name}</span>
                      </div>
                    )}
                  </div>
                  
                  {selectedServices.length > 1 && (
                    <div className="mt-4">
                      <ServicesList 
                        services={selectedServices}
                        compact={true}
                        showPrice={false}
                      />
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-iazi-primary">R$ {totalPrice}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Step Content */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            {renderStep()}
          </div>

          {/* Cancellation Policy */}
          <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mt-0.5 text-iazi-primary" />
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
