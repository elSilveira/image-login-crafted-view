
import React from "react";
import Navigation from "@/components/Navigation";
import { NotificationList } from "@/components/notifications/NotificationList";
import { NotificationFilters } from "@/components/notifications/NotificationFilters";
import { Button } from "@/components/ui/button";
import { BellDot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Notifications = () => {
  const { toast } = useToast();

  const handleMarkAllAsRead = () => {
    toast({
      title: "Todas as notificações marcadas como lidas",
      description: "Suas notificações foram atualizadas com sucesso.",
    });
  };

  return (
    <>
      <Navigation />
      <div className="container-padding">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-iazi-text font-playfair mb-0">Notificações</h1>
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2"
          >
            <BellDot className="h-4 w-4" />
            Marcar todas como lidas
          </Button>
        </div>
        <NotificationFilters />
        <NotificationList />
      </div>
    </>
  );
};

export default Notifications;
