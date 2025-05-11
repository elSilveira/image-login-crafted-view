import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceItem } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem;
  onSave: (service: ServiceItem) => void;
}

const daysOfWeek = [
  { label: "Segunda-feira", value: "MONDAY" },
  { label: "Terça-feira", value: "TUESDAY" },
  { label: "Quarta-feira", value: "WEDNESDAY" },
  { label: "Quinta-feira", value: "THURSDAY" },
  { label: "Sexta-feira", value: "FRIDAY" },
  { label: "Sábado", value: "SATURDAY" },
  { label: "Domingo", value: "SUNDAY" }
];

const EditServiceDialog: React.FC<EditServiceDialogProps> = ({ isOpen, onClose, service, onSave }) => {
  const [price, setPrice] = useState(service.price || "");
  const [description, setDescription] = useState(service.description || "");
  const [duration, setDuration] = useState(service.duration?.toString() || "");
  const [categoryId, setCategoryId] = useState(service.categoryId || "");
  const [schedule, setSchedule] = useState(
    Array.isArray(service.schedule) && service.schedule.length > 0
      ? service.schedule
      : [{ dayOfWeek: "MONDAY", startTime: "09:00", endTime: "17:00" }]
  );

  // TODO: Fetch categories from API if needed
  const categories = [
    { id: "1", name: "Cabelo" },
    { id: "2", name: "Estética" },
    { id: "3", name: "Massagem" },
    // ...
  ];

  const handleScheduleChange = (idx: number, field: string, value: string) => {
    setSchedule((prev) => prev.map((slot, i) => i === idx ? { ...slot, [field]: value } : slot));
  };

  const handleAddSlot = () => {
    // Find next available day
    const usedDays = schedule.map(s => s.dayOfWeek);
    const nextDay = daysOfWeek.find(d => !usedDays.includes(d.value));
    setSchedule([
      ...schedule,
      { dayOfWeek: nextDay?.value || "MONDAY", startTime: "09:00", endTime: "17:00" }
    ]);
  };

  const handleRemoveSlot = (idx: number) => {
    setSchedule(schedule.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    let parsedDuration = Number(duration);
    if (isNaN(parsedDuration)) parsedDuration = 0;
    onSave({
      ...service,
      price,
      description,
      duration: parsedDuration,
      categoryId,
      schedule,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <Input value={service.name} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preço (R$)</label>
            <Input value={price} onChange={e => setPrice(e.target.value)} type="number" min={0} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <Input value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duração (minutos)</label>
            <Input value={duration} onChange={e => setDuration(e.target.value)} type="number" min={0} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Horários do serviço</label>
            {schedule.map((slot, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <select
                  className="border rounded p-1"
                  value={slot.dayOfWeek}
                  onChange={e => handleScheduleChange(idx, "dayOfWeek", e.target.value)}
                >
                  {daysOfWeek.map(day => (
                    <option key={day.value} value={day.value}>{day.label}</option>
                  ))}
                </select>
                <input
                  type="time"
                  className="border rounded p-1"
                  value={slot.startTime}
                  onChange={e => handleScheduleChange(idx, "startTime", e.target.value)}
                />
                <span>-</span>
                <input
                  type="time"
                  className="border rounded p-1"
                  value={slot.endTime}
                  onChange={e => handleScheduleChange(idx, "endTime", e.target.value)}
                />
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => handleRemoveSlot(idx)}
                >Remover</button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 px-3 py-1 bg-primary text-white rounded"
              onClick={handleAddSlot}
              disabled={schedule.length >= 7}
            >Adicionar horário</button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceDialog;
