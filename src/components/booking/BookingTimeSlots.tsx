import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BookingTimeSlotsProps {
  date: Date;
  selectedTime: string | undefined;
  onTimeSelect: (time: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const BookingTimeSlots = ({
  date,
  selectedTime,
  onTimeSelect,
  onNext,
}: BookingTimeSlotsProps) => {
  // Mock data - In a real app, these would come from an API
  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Escolha um horário</h3>
        <p className="text-muted-foreground">
          Horários disponíveis para {date.toLocaleDateString('pt-BR')}
        </p>
      </div>

      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? "default" : "outline"}
              onClick={() => onTimeSelect(time)}
              className="w-full"
              disabled={!date}
            >
              {time}
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selectedTime}>
          Próximo
        </Button>
      </div>
    </div>
  );
};

export default BookingTimeSlots;
