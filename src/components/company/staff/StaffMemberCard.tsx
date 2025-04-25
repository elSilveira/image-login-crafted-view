
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, UserX } from "lucide-react";

const statusMap = {
  active: { label: "Ativo", className: "bg-green-500" },
  inactive: { label: "Inativo", className: "bg-gray-500" },
  vacation: { label: "Férias", className: "bg-yellow-500" },
};

interface StaffMemberProps {
  staff: {
    id: number;
    name: string;
    role: string;
    status: keyof typeof statusMap;
    image: string;
    hireDate: string;
    rating: number;
    appointmentsCount: number;
  };
}

export const StaffMemberCard = ({ staff }: StaffMemberProps) => {
  const status = statusMap[staff.status];
  const hireDate = new Date(staff.hireDate).toLocaleDateString("pt-BR");

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={staff.image} alt={staff.name} />
            <AvatarFallback>{staff.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{staff.name}</h3>
            <p className="text-sm text-muted-foreground">{staff.role}</p>
          </div>
        </div>
        <Badge className={status.className}>{status.label}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Contratação:</span> {hireDate}
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Avaliação:</span>{" "}
            {staff.rating.toFixed(1)} ⭐
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Agendamentos:</span>{" "}
            {staff.appointmentsCount}
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button size="sm" variant="outline" className="text-destructive">
              <UserX className="h-4 w-4 mr-1" />
              Desativar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
