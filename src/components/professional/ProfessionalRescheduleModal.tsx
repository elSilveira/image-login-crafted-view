import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, addDays, getHours, getMinutes, parseISO, set, isBefore, isEqual } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Loader2, AlertCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { rescheduleAppointment } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define time slot type
interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}

// Create time slots from 8:00 to 20:00, every 30 minutes
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 8; hour <= 20; hour++) {
    slots.push({ hour, minute: 0, label: `${hour}:00` });
    if (hour < 20) {
      slots.push({ hour, minute: 30, label: `${hour}:30` });
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  service?: { 
    id: string;
    name: string;
    duration?: number;
  };
  services?: { 
    service: {
      id: string;
      name: string;
      duration?: number;
    }
  }[];
  user?: {
    id: string;
    name: string;
  };
}

interface ProfessionalRescheduleModalProps {
  appointment: Appointment;
  onComplete: () => void;
  onCancel: () => void;
}

const ProfessionalRescheduleModal = ({
  appointment,
  onComplete,
  onCancel,
}: ProfessionalRescheduleModalProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date(appointment.startTime));
  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(() => {
    const startDate = new Date(appointment.startTime);
    const hour = getHours(startDate);
    const minute = getMinutes(startDate);
    return TIME_SLOTS.find(slot => slot.hour === hour && slot.minute === minute) || null;
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get appointment duration in minutes
  const getAppointmentDuration = (): number => {
    if (appointment.service?.duration) {
      return appointment.service.duration;
    }
    
    if (appointment.services && appointment.services.length > 0) {
      // Sum of all service durations or default to 60 minutes
      return appointment.services.reduce(
        (total, s) => total + (s.service?.duration || 60), 
        0
      );
    }
    
    // Default duration: 60 minutes
    return 60;
  };

  // Handle date change
  useEffect(() => {
    // Clear any previous errors when date changes
    if (error) setError(null);
  }, [date, timeSlot]);

  // Handle rescheduling submission
  const handleReschedule = async () => {
    if (!date || !timeSlot) {
      toast({
        title: "Dados incompletos",
        description: "Por favor selecione uma data e horário.",
        variant: "destructive",
      });
      return;
    }
    
    // Don't allow scheduling in the past
    const now = new Date();
    const selectedDateTime = set(date, { 
      hours: timeSlot.hour, 
      minutes: timeSlot.minute,
      seconds: 0,
      milliseconds: 0
    });
    
    if (isBefore(selectedDateTime, now)) {
      setError("Não é possível reagendar para uma data e hora no passado.");
      return;
    }
    
    // Don't allow same date/time as current appointment
    const currentStart = new Date(appointment.startTime);
    if (isEqual(selectedDateTime, currentStart)) {
      setError("Por favor selecione uma data e hora diferente da atual.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Calculate end time based on service duration
      const duration = getAppointmentDuration();
      const endTime = new Date(selectedDateTime.getTime() + duration * 60 * 1000);
      
      // Update appointment with new times
      await rescheduleAppointment(
        appointment.id,
        selectedDateTime.toISOString(),
        endTime.toISOString()
      );
      
      toast({
        title: "Reagendamento concluído",
        description: "O agendamento foi reagendado com sucesso.",
        variant: "default",
      });
      
      setIsOpen(false);
      onComplete();
    } catch (error: any) {
      console.error("Erro ao reagendar:", error);
      setError(error.message || "Não foi possível reagendar o agendamento.");
      
      toast({
        title: "Erro no reagendamento",
        description: error.message || "Não foi possível reagendar o agendamento.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onCancel();
    }
  };

  // Get service name for display
  const getServiceName = (): string => {
    if (appointment.service?.name) {
      return appointment.service.name;
    }
    
    if (appointment.services && appointment.services.length > 0) {
      const serviceCount = appointment.services.length;
      const firstServiceName = appointment.services[0].service?.name || "Serviço";
      
      return serviceCount > 1 
        ? `${firstServiceName} + ${serviceCount - 1} ${serviceCount > 2 ? 'serviços' : 'serviço'}`
        : firstServiceName;
    }
    
    return "Serviço não identificado";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reagendar Agendamento</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div>
            <p className="text-sm font-medium mb-1">Serviço</p>
            <p className="text-sm">{getServiceName()}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Cliente</p>
            <p className="text-sm">{appointment.user?.name || "Cliente"}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Data atual</p>
            <p className="text-sm">
              {format(new Date(appointment.startTime), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Nova data</p>
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "dd 'de' MMMM, yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date() || date > addDays(new Date(), 60)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Novo horário</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !timeSlot && "text-muted-foreground"
                  )}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {timeSlot ? (
                    timeSlot.label
                  ) : (
                    <span>Selecione um horário</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0">
                <div className="max-h-[200px] overflow-y-auto p-1">
                  {TIME_SLOTS.map((slot) => (
                    <Button
                      key={slot.label}
                      variant="ghost"
                      className={cn(
                        "justify-start w-full",
                        timeSlot?.label === slot.label && "bg-accent"
                      )}
                      onClick={() => setTimeSlot(slot)}
                    >
                      {slot.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleReschedule} disabled={!date || !timeSlot || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando
              </>
            ) : (
              "Reagendar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalRescheduleModal;
