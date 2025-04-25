
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const CompanyReviewsAdmin = () => {
  return (
    <CompanyLayout>
      <div className="space-y-6 w-full">
        <h1 className="text-2xl font-semibold">Avaliações</h1>
        
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="p-6">
            <div className="text-2xl font-semibold">4.8</div>
            <p className="text-sm text-muted-foreground">Média geral</p>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-semibold">127</div>
            <p className="text-sm text-muted-foreground">Total de avaliações</p>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-semibold">98%</div>
            <p className="text-sm text-muted-foreground">Avaliações positivas</p>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-semibold">15</div>
            <p className="text-sm text-muted-foreground">Novas este mês</p>
          </Card>
        </div>

        <div className="bg-white rounded-lg border">
          <div className="p-6">
            <h2 className="text-lg font-medium">Últimas Avaliações</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Maria Silva</TableCell>
                <TableCell>Corte de Cabelo</TableCell>
                <TableCell>5.0</TableCell>
                <TableCell>24/04/2025</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                    Publicada
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanyReviewsAdmin;
