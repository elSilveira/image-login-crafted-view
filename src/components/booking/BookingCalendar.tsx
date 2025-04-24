import React from "react";
import { Calendar } from "@/components/ui/calendar";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onNext: () => void;
}

const BookingCalendar = ({
  selectedDate,
  onDateSelect,
}: BookingCalendarProps) => {
  // In a real app, these would come from an API
  const disabledDays = [
    { from: new Date(2024, 3, 25), to: new Date(2024, 3, 27) },
    { from: new Date(2024, 4, 1), to: new Date(2024, 4, 2) },
  ];

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
        disabled={[
          { before: new Date() },
          ...disabledDays,
        ]}
        className="rounded-md border-iazi-border mx-auto"
      />
    </div>
  );
};

export default BookingCalendar;
