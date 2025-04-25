
import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Edit, MoreVertical, Trash } from "lucide-react";

interface StaffMemberCardProps {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  image?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const StaffMemberCard: React.FC<StaffMemberCardProps> = ({
  id,
  name,
  role,
  email,
  phone,
  image,
  onEdit,
  onDelete,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              {image ? (
                <AvatarImage src={image} alt={name} />
              ) : (
                <AvatarFallback>{name[0]}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle>{name}</CardTitle>
              <CardDescription>{role}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>
                <Trash className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Email:</span> {email}
          </div>
          {phone && (
            <div>
              <span className="text-muted-foreground">Telefone:</span> {phone}
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to={`/company/my-company/staff/${id}/calendar`}>
              <Calendar className="mr-2 h-4 w-4" />
              Agenda
            </Link>
          </Button>
          <Button size="sm" className="w-full" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
