
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const CompanyReportsAdmin = () => {
  return (
    <CompanyLayout>
      <div className="space-y-6 w-full">
        <h1 className="text-2xl font-semibold">Relatórios</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <div className="text-2xl font-semibold">R$ 15.280</div>
            <p className="text-sm text-muted-foreground">Faturamento mensal</p>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-semibold">284</div>
            <p className="text-sm text-muted-foreground">Agendamentos</p>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-semibold">89%</div>
            <p className="text-sm text-muted-foreground">Taxa de ocupação</p>
          </Card>
        </div>

        <div className="bg-white rounded-lg border">
          <div className="p-6">
            <h2 className="text-lg font-medium">Serviços Mais Populares</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serviço</TableHead>
                <TableHead>Agendamentos</TableHead>
                <TableHead>Faturamento</TableHead>
                <TableHead>Avaliação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Corte Masculino</TableCell>
                <TableCell>145</TableCell>
                <TableCell>R$ 5.800</TableCell>
                <TableCell>4.8</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanyReportsAdmin;
