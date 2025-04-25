
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Calendar } from "lucide-react";
import { StaffMember } from "@/components/company/calendar/types";

interface StaffCalendarHeaderProps {
  staffMember: StaffMember;
}

export const StaffCalendarHeader: React.FC<StaffCalendarHeaderProps> = ({ staffMember }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          {staffMember.image ? (
            <AvatarImage src={staffMember.image} alt={staffMember.name} />
          ) : (
            <AvatarFallback className="text-lg">{staffMember.name.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
        
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{staffMember.name}</h1>
            <Badge variant="outline" className="ml-2">{staffMember.role}</Badge>
          </div>
          <p className="text-muted-foreground">Agenda do Funcionário</p>
        </div>
      </div>
      
      <div className="flex gap-2 w-full sm:w-auto">
        <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
          <Calendar className="mr-2 h-4 w-4" />
          Gerenciar Folgas
        </Button>
        <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </Button>
      </div>
    </div>
  );
};
