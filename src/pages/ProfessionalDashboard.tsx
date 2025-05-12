import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Users, CreditCard, Calendar } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ProfessionalDashboard = () => {
  return (
    <div className="space-y-6 w-full">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Faturamento</h3>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">R$ 4.230</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-emerald-500 inline-flex items-center">
              <ArrowUp className="mr-1 h-3 w-3" />
              12%
            </span>{" "}
            em relação ao mês passado
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Agendamentos</h3>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">78</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-emerald-500 inline-flex items-center">
              <ArrowUp className="mr-1 h-3 w-3" />
              8%
            </span>{" "}
            em relação ao mês passado
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Novos Clientes</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-rose-500 inline-flex items-center">
              <ArrowDown className="mr-1 h-3 w-3" />
              4%
            </span>{" "}
            em relação ao mês passado
          </p>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Próximos Agendamentos</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">{i === 1 ? 'Corte Feminino' : i === 2 ? 'Coloração' : 'Manicure'}</p>
                  <p className="text-sm text-muted-foreground">{i === 1 ? 'Hoje, 14:00' : i === 2 ? 'Amanhã, 10:30' : 'Sexta, 16:00'}</p>
                </div>
                <Badge variant="outline" className={i === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}>
                  {i === 1 ? 'Em breve' : 'Confirmado'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Serviços Populares</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serviço</TableHead>
                <TableHead>Agendamentos</TableHead>
                <TableHead>Avaliação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Corte Feminino</TableCell>
                <TableCell>32</TableCell>
                <TableCell>4.8</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Coloração</TableCell>
                <TableCell>24</TableCell>
                <TableCell>4.7</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Manicure</TableCell>
                <TableCell>18</TableCell>
                <TableCell>4.6</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
