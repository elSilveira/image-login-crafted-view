
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Info, Gift, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotificationCardProps {
  notification: {
    id: string;
    type: "appointment" | "system" | "promotion";
    title: string;
    description: string;
    date: Date;
    isRead: boolean;
    actionLabel?: string;
    actionUrl?: string;
  };
}

const getIcon = (type: string) => {
  switch (type) {
    case "appointment":
      return Calendar;
    case "system":
      return Info;
    case "promotion":
      return Gift;
    default:
      return Info;
  }
};

export const NotificationCard = ({ notification }: NotificationCardProps) => {
  const Icon = getIcon(notification.type);
  
  return (
    <Card className={`transition-all ${!notification.isRead ? "border-l-4 border-l-iazi-primary" : ""}`}>
      <CardContent className="flex items-start gap-4 p-4">
        <div className={`rounded-full p-2 ${!notification.isRead ? "bg-iazi-primary/10" : "bg-muted"}`}>
          <Icon className={`h-5 w-5 ${!notification.isRead ? "text-iazi-primary" : "text-muted-foreground"}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-base mb-1">{notification.title}</h3>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(notification.date, { locale: ptBR, addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{notification.description}</p>
          {notification.actionLabel && notification.actionUrl && (
            <Button variant="outline" size="sm" className="gap-2">
              <Check className="h-4 w-4" />
              {notification.actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
