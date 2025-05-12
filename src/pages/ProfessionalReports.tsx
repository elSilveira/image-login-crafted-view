import React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfessionalReports = () => {
  return (
    <div className="space-y-6 w-full">
      <h1 className="text-2xl font-semibold">Relatórios</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="text-2xl font-semibold">R$ 4.230</div>
          <p className="text-sm text-muted-foreground">Faturamento mensal</p>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-semibold">78</div>
          <p className="text-sm text-muted-foreground">Agendamentos</p>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-semibold">82%</div>
          <p className="text-sm text-muted-foreground">Taxa de ocupação</p>
        </Card>
      </div>

      <Tabs defaultValue="services">
        <TabsList>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="revenue">Faturamento</TabsTrigger>
        </TabsList>
        <TabsContent value="services" className="mt-6">
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
                  <TableCell>Corte Feminino</TableCell>
                  <TableCell>32</TableCell>
                  <TableCell>R$ 2.240</TableCell>
                  <TableCell>4.8</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Coloração</TableCell>
                  <TableCell>24</TableCell>
                  <TableCell>R$ 1.440</TableCell>
                  <TableCell>4.7</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Manicure</TableCell>
                  <TableCell>18</TableCell>
                  <TableCell>R$ 540</TableCell>
                  <TableCell>4.6</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="clients" className="mt-6">
          <div className="bg-white rounded-lg border">
            <div className="p-6">
              <h2 className="text-lg font-medium">Clientes Frequentes</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Agendamentos</TableHead>
                  <TableHead>Valor Gasto</TableHead>
                  <TableHead>Último Agendamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Ana Silva</TableCell>
                  <TableCell>8</TableCell>
                  <TableCell>R$ 640</TableCell>
                  <TableCell>22/04/2025</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Carlos Santos</TableCell>
                  <TableCell>6</TableCell>
                  <TableCell>R$ 420</TableCell>
                  <TableCell>01/05/2025</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mariana Oliveira</TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>R$ 375</TableCell>
                  <TableCell>08/05/2025</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="revenue" className="mt-6">
          <div className="bg-white rounded-lg border">
            <div className="p-6">
              <h2 className="text-lg font-medium">Faturamento por Período</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Faturamento</TableHead>
                  <TableHead>Agendamentos</TableHead>
                  <TableHead>Variação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Maio/2025</TableCell>
                  <TableCell>R$ 4.230</TableCell>
                  <TableCell>78</TableCell>
                  <TableCell className="text-green-600">+12%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Abril/2025</TableCell>
                  <TableCell>R$ 3.780</TableCell>
                  <TableCell>72</TableCell>
                  <TableCell className="text-green-600">+8%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Março/2025</TableCell>
                  <TableCell>R$ 3.500</TableCell>
                  <TableCell>68</TableCell>
                  <TableCell className="text-red-600">-2%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfessionalReports;
