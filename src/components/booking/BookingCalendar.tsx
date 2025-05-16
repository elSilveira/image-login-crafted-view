
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Replace fetchProfessionalAvailability with fetchProfessionalAvailableDates
import { fetchProfessionalAvailableDates } from "@/lib/api";
import { format, addDays, startOfWeek, isWithinInterval, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onNext?: () => void;
  professionalId: string;
  serviceId?: string;
  serviceSchedule?: Array<{dayOfWeek: string, startTime: string, endTime: string}>;
}

const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const BookingCalendar = ({
  selectedDate,
  onDateSelect,
  onNext,
  professionalId,
  serviceSchedule,
}: BookingCalendarProps) => {
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  
  useEffect(() => {
    // Map service schedule to numeric days
    if (serviceSchedule && serviceSchedule.length > 0) {
      const numericDays = serviceSchedule.map(schedule => {
        const dayIndex = days.indexOf(schedule.dayOfWeek);
        return dayIndex;
      }).filter(day => day !== -1);
      
      setAvailableDays(numericDays);
    } else {
      // Default to all days if no schedule provided
      setAvailableDays([0, 1, 2, 3, 4, 5, 6]);
    }
  }, [serviceSchedule]);

  // Function to check if a date is disabled
  const isDayDisabled = (date: Date) => {
    const dayOfWeek = date.getDay();
    
    // Disable past dates
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      return true;
    }
    
    // Disable days not in schedule
    return !availableDays.includes(dayOfWeek);
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <CalendarIcon className="mr-2 h-5 w-5 text-iazi-primary" />
          Escolha uma data
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6 pt-2">
        <div className="flex flex-col items-center p-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            disabled={isDayDisabled}
            locale={ptBR}
            className="rounded-md border p-3 shadow-sm pointer-events-auto bg-white"
            showOutsideDays={false}
            fromDate={new Date()}
            toDate={addDays(new Date(), 60)}
            modifiers={{
              available: (date) => !isDayDisabled(date)
            }}
            modifiersClassNames={{
              selected: "bg-iazi-primary text-white hover:bg-iazi-primary hover:text-white",
              available: "hover:bg-muted",
              today: "border border-iazi-primary/30 text-iazi-primary"
            }}
            classNames={{
              day_disabled: "text-muted-foreground opacity-30 hover:bg-white hover:text-muted-foreground"
            }}
          />
          {selectedDate && (
            <div className="w-full mt-4 text-center">
              <p className="text-muted-foreground text-sm">
                Data selecionada: <span className="font-medium text-foreground">{format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCalendar;
