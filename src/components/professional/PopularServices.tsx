import React from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface PopularServiceType {
  id: string;
  name: string;
  appointmentCount: number;
  rating: number;
}

interface PopularServicesProps {
  services: PopularServiceType[];
  isLoading: boolean;
}

export const PopularServices: React.FC<PopularServicesProps> = ({ services, isLoading }) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Serviços Populares</h3>
      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-iazi-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Carregando serviços...</span>
        </div>
      ) : services.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">Nenhum serviço disponível</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serviço</TableHead>
              <TableHead>Agendamentos</TableHead>
              <TableHead>Avaliação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.appointmentCount}</TableCell>
                <TableCell>{service.rating.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

export default PopularServices; 