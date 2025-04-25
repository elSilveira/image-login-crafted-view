
import React from "react";
import { Bell, Calendar, MessageSquare, Star, User } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "booking",
    message: "Novo agendamento realizado por João Silva",
    time: "Há 10 minutos",
    icon: Calendar,
  },
  {
    id: 2,
    type: "review",
    message: "Nova avaliação recebida (5 estrelas)",
    time: "Há 2 horas",
    icon: Star,
  },
  {
    id: 3,
    type: "message",
    message: "Mensagem recebida de Maria Oliveira",
    time: "Há 3 horas",
    icon: MessageSquare,
  },
  {
    id: 4,
    type: "user",
    message: "Novo usuário seguiu sua empresa",
    time: "Há 5 horas",
    icon: User,
  },
];

export const CompanyNotifications = () => {
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id} className="flex items-start gap-3 p-2">
          <div className="rounded-full bg-muted p-2 h-8 w-8 flex items-center justify-center">
            <notification.icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{notification.message}</p>
            <p className="text-xs text-muted-foreground">{notification.time}</p>
          </div>
          <div className="text-right">
            <span className="h-2 w-2 rounded-full bg-blue-500 block"></span>
          </div>
        </div>
      ))}
      <div className="pt-2">
        <button className="text-sm text-iazi-primary w-full text-center">Ver todas notificações</button>
      </div>
    </div>
  );
};
