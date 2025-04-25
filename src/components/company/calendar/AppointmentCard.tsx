
import React from "react";
import { format } from "date-fns";
import { AppointmentType } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarCheck, MoreVertical, Clock, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentCardProps {
  appointment: AppointmentType;
  view: "day" | "week" | "month" | "list";
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  view 
}) => {
  const getStatusColor = (status: AppointmentType["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  
  const getStatusLabel = (status: AppointmentType["status"]) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendente";
      case "in-progress":
        return "Em andamento";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };
  
  if (view === "month") {
    return (
      <div 
        className={cn(
          "text-xs px-1 py-0.5 rounded truncate border-l-2",
          getStatusColor(appointment.status)
        )}
      >
        {format(new Date(appointment.start), "HH:mm")} - {appointment.clientName}
      </div>
    );
  }
  
  if (view === "list") {
    return (
      <div className="flex items-center justify-between p-3 hover:bg-muted/50">
        <div className="flex items-start space-x-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{appointment.clientName}</span>
            <span className="text-xs text-muted-foreground">
              {appointment.serviceName} com {appointment.staffName}
            </span>
            <div className="flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
              <span className="text-xs">
                {format(new Date(appointment.start), "HH:mm")} - {format(new Date(appointment.end), "HH:mm")}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={cn(getStatusColor(appointment.status))}>
            {getStatusLabel(appointment.status)}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <CalendarCheck className="mr-2 h-4 w-4" />
                Confirmar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Check className="mr-2 h-4 w-4" />
                Concluir
              </DropdownMenuItem>
              <DropdownMenuItem>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "p-1 text-xs rounded border mb-1",
        getStatusColor(appointment.status),
        view === "day" ? "flex-1" : "h-8 overflow-hidden"
      )}
    >
      <div className="font-medium truncate">
        {appointment.clientName}
      </div>
      <div className="truncate">
        {format(new Date(appointment.start), "HH:mm")} - {format(new Date(appointment.end), "HH:mm")}
      </div>
    </div>
  );
};
