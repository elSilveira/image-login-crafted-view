import React from "react";
import { Calendar } from "@/components/ui/calendar";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onNext: () => void;
  professionalId?: string;
  serviceSchedule?: Array<{ dayOfWeek: string; startTime: string; endTime: string }>;
}

const BookingCalendar = ({
  selectedDate,
  onDateSelect,
  serviceSchedule,
}: BookingCalendarProps) => {
  // Determine allowed weekdays from service schedule
  const dayMap: Record<string, number> = { SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6 };
  const allowedDays = serviceSchedule?.map(s => dayMap[s.dayOfWeek]!).filter(d => d !== undefined) || [];

  return (
    <div className="space-y-6 max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
      <div>
        <h3 className="text-lg font-playfair font-semibold mb-2 text-iazi-text">Selecione uma data</h3>
        <p className="text-muted-foreground font-lato">
          Escolha o dia para seu agendamento
        </p>
      </div>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={dateItem => {
          const today = new Date(); today.setHours(0,0,0,0);
          // disable past
          if (dateItem < today) return true;
          // disable if not in service schedule weekdays
          const weekday = dateItem.getDay();
          if (allowedDays.length > 0 && !allowedDays.includes(weekday)) return true;
          return false;
        }}
        className="rounded-md border-iazi-border mx-auto"
      />
    </div>
  );
};

export default BookingCalendar;
