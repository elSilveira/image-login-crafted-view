
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onNext: () => void;
}

const BookingCalendar = ({
  selectedDate,
  onDateSelect,
  onNext,
}: BookingCalendarProps) => {
  // In a real app, these would come from an API
  const disabledDays = [
    { from: new Date(2024, 3, 25), to: new Date(2024, 3, 27) },
    { from: new Date(2024, 4, 1), to: new Date(2024, 4, 2) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Selecione uma data</h3>
        <p className="text-muted-foreground">
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
        className="rounded-md border mx-auto"
      />

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selectedDate}>
          Próximo
        </Button>
      </div>
    </div>
  );
};

export default BookingCalendar;
