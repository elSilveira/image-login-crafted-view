// src/components/notifications/NotificationList.tsx
import React, { useState, useEffect } from "react";
import { NotificationCard } from "./NotificationCard";
// Removed: import { mockNotifications } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming Skeleton component exists for loading state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Assuming Alert component exists for error state
import { Terminal } from "lucide-react"; // Example icon for alert

// Define the expected structure of an ActivityLog from the API
interface ActivityLog {
  id: string;
  userId: string;
  type: string; // e.g., "APPOINTMENT_CONFIRMED", "PROFILE_UPDATED", "PROMOTION"
  message: string;
  relatedEntityId?: string | null;
  relatedEntityType?: string | null;
  createdAt: string; // ISO date string
  // Add isRead if implemented in backend/schema later
  // isRead?: boolean;
}

// Define the props expected by NotificationCard based on mock data structure
interface NotificationCardProps {
  id: string;
  type: string; // e.g., "appointment", "system", "promotion"
  title: string;
  description: string;
  date: Date;
  isRead?: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

// Helper function to adapt ActivityLog to NotificationCardProps
const adaptActivityLogToNotification = (log: ActivityLog): NotificationCardProps => {
  let cardType = "system"; // Default type
  let title = "Atualização do Sistema"; // Default title
  let actionLabel: string | undefined;
  let actionUrl: string | undefined;

  // Basic type mapping (can be expanded)
  if (log.type.includes("APPOINTMENT")) {
    cardType = "appointment";
    title = "Agendamento";
    if (log.relatedEntityId) {
      actionLabel = "Ver detalhes";
      // Assuming a route structure like /booking/{id}
      actionUrl = `/booking/${log.relatedEntityId}`;
    }
  } else if (log.type.includes("PROFILE")) {
    cardType = "system";
    title = "Atualização de Perfil";
  } else if (log.type.includes("PROMOTION")) {
    cardType = "promotion";
    title = "Promoção";
    // actionUrl = `/promotions/${log.relatedEntityId}`; // If applicable
  } else if (log.type.includes("REVIEW")) {
    cardType = "review";
    title = "Nova Avaliação";
    // actionUrl = `/reviews/${log.relatedEntityId}`; // If applicable
  }

  return {
    id: log.id,
    type: cardType,
    title: title,
    description: log.message, // Use the message directly as description
    date: new Date(log.createdAt), // Convert ISO string to Date
    isRead: false, // Placeholder: Mark as read functionality not implemented yet
    actionLabel: actionLabel,
    actionUrl: actionUrl,
  };
};

export const NotificationList = () => {
  const [notifications, setNotifications] = useState<NotificationCardProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API call setup (e.g., using fetch or axios)
        // Assuming the API is running on localhost:3001 or configured base URL
        // Requires authentication token to be sent (e.g., in headers)
        const response = await fetch("/api/notifications", { // Adjust URL as needed
          method: "GET",
          headers: {
            // Add authentication headers if required, e.g.:
            // "Authorization": `Bearer ${your_auth_token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // Handle specific HTTP errors
          if (response.status === 401) {
             throw new Error("Acesso não autorizado. Faça login para ver suas notificações.");
          }
          throw new Error(`Erro HTTP ${response.status}: Falha ao buscar notificações`);
        }

        const data: ActivityLog[] = await response.json();

        // Adapt the fetched data to the structure expected by NotificationCard
        const adaptedData = data.map(adaptActivityLogToNotification);
        setNotifications(adaptedData);

      } catch (err: any) {
        console.error("Erro ao buscar notificações:", err);
        setError(err.message || "Ocorreu um erro inesperado ao carregar as notificações.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []); // Empty dependency array means this runs once on mount

  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-6">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Erro ao Carregar Notificações</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <p>Nenhuma notificação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

