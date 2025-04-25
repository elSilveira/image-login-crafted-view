
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const appointments = [
  {
    id: 1,
    client: {
      name: "João Silva",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    service: "Corte de Cabelo",
    time: "10:00",
    date: "Hoje",
  },
  {
    id: 2,
    client: {
      name: "Maria Oliveira",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    service: "Manicure e Pedicure",
    time: "11:30",
    date: "Hoje",
  },
  {
    id: 3,
    client: {
      name: "Pedro Santos",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    service: "Barba",
    time: "14:00",
    date: "Hoje",
  },
  {
    id: 4,
    client: {
      name: "Ana Costa",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    service: "Hidratação",
    time: "09:30",
    date: "Amanhã",
  },
];

export const CompanyUpcomingAppointments = () => {
  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-center gap-3 p-2 border rounded-md">
          <Avatar>
            <AvatarImage src={appointment.client.avatar} />
            <AvatarFallback>
              {appointment.client.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{appointment.client.name}</p>
            <p className="text-sm text-muted-foreground truncate">{appointment.service}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{appointment.time}</p>
            <p className="text-sm text-muted-foreground">{appointment.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
