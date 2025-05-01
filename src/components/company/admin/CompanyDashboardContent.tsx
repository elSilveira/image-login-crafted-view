"use client"; // Add this directive for client-side hooks

import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Added useQueryClient
import { Calendar, CheckCircle, DollarSign, Users, Loader2, AlertCircle } from "lucide-react"; // Added AlertCircle
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyDashboardChart } from "@/components/company/admin/CompanyDashboardChart";
import { CompanyTasksList } from "@/components/company/admin/CompanyTasksList";
import { CompanyUpcomingAppointments } from "@/components/company/admin/CompanyUpcomingAppointments";
import { CompanyNotifications } from "@/components/company/admin/CompanyNotifications";
import { fetchCompanyDetails, fetchCompanyServices, fetchCompanyAppointments } from "@/lib/api"; // Import API functions
import { useAuth } from "@/contexts/AuthContext"; // Assuming auth context provides company ID
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { Button } from "@/components/ui/button"; // Import Button for potential retry

export const CompanyDashboardContent = () => {
  const queryClient = useQueryClient(); // Initialize queryClient
  const { user } = useAuth(); // Assuming useAuth provides user info including companyId
  // TODO: Determine the correct way to get the company ID. 
  // It might be directly on the user object, or require another fetch.
  // For now, assuming it's available or can be derived.
  const companyId = user?.companyId; // Placeholder: Adjust based on actual auth context structure

  // Fetch Company Details
  const { data: companyDetails, isLoading: isLoadingDetails, isError: isErrorDetails, error: errorDetails } = useQuery<any, Error>({
    queryKey: ["companyDetails", companyId],
    queryFn: () => fetchCompanyDetails(companyId!),
    enabled: !!companyId,
  });

  // Fetch Company Services
  const { data: services, isLoading: isLoadingServices, isError: isErrorServices, error: errorServices } = useQuery<any[], Error>({
    queryKey: ["companyServices", companyId],
    queryFn: () => fetchCompanyServices(companyId!),
    enabled: !!companyId,
  });

  // Fetch Company Appointments
  const { data: appointments, isLoading: isLoadingAppointments, isError: isErrorAppointments, error: errorAppointments } = useQuery<any[], Error>({
    queryKey: ["companyAppointments", companyId],
    queryFn: () => fetchCompanyAppointments(companyId!),
    enabled: !!companyId,
  });

  // TODO: Calculate dashboard metrics based on fetched data (appointments, services, etc.)
  const appointmentsToday = appointments?.filter((appt: any) => new Date(appt.startTime).toDateString() === new Date().toDateString()).length || 0;
  const monthlyRevenue = appointments?.reduce((sum: number, appt: any) => {
      // Assuming appointment has a price or links to a service with a price
      // This calculation needs refinement based on actual data structure
      const price = appt.service?.price || appt.price || 0;
      const apptMonth = new Date(appt.startTime).getMonth();
      const currentMonth = new Date().getMonth();
      return apptMonth === currentMonth ? sum + price : sum;
  }, 0) || 0;
  const clientsServedThisMonth = new Set(appointments?.filter((appt: any) => new Date(appt.startTime).getMonth() === new Date().getMonth()).map((appt: any) => appt.userId)).size || 0;
  // const averageRating = companyDetails?.averageRating || 0; // Assuming companyDetails has rating
  const averageRating = 4.8; // Placeholder

  // Handle loading state for multiple queries
  const isLoading = isLoadingDetails || isLoadingServices || isLoadingAppointments;
  const isError = isErrorDetails || isErrorServices || isErrorAppointments;
  const errorMessages = [errorDetails, errorServices, errorAppointments].filter(Boolean).map((e: any) => e.message).join("; ");

  // --- No Company ID State --- 
  if (!companyId) {
    return (
      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Acesso Negado</AlertTitle>
        <AlertDescription>
          ID da empresa não encontrado. Verifique se você está logado corretamente.
        </AlertDescription>
      </Alert>
    );
  }

  // --- Loading State --- 
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // --- Error State --- 
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao Carregar Dashboard</AlertTitle>
        <AlertDescription>
          Não foi possível carregar todos os dados do dashboard. Tente novamente mais tarde.
          {errorMessages && <p className="text-xs mt-2">Detalhes: {errorMessages}</p>}
        </AlertDescription>
        {/* Optional: Add a retry button to refetch all queries */}
        {/* <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => {
            queryClient.refetchQueries({ queryKey: ["companyDetails", companyId] });
            queryClient.refetchQueries({ queryKey: ["companyServices", companyId] });
            queryClient.refetchQueries({ queryKey: ["companyAppointments", companyId] });
          }} 
          className="mt-4"
        >
          Tentar Novamente
        </Button> */}
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard - {companyDetails?.name || "Minha Empresa"}</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel administrativo da sua empresa
        </p>
      </div>

      {/* Use fetched data for summary cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Agendamentos Hoje</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{appointmentsToday}</div>
            {/* TODO: Calculate percentage change based on historical data */}
            {/* <p className="text-sm text-muted-foreground">+8% em relação à semana passada</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">R$ {monthlyRevenue.toFixed(2).replace(".", ",")}</div>
            {/* TODO: Calculate percentage change based on historical data */}
            {/* <p className="text-sm text-muted-foreground">+12% em relação ao mês anterior</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Clientes Atendidos (Mês)</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{clientsServedThisMonth}</div>
            {/* TODO: Calculate percentage change based on historical data */}
            {/* <p className="text-sm text-muted-foreground">+18% em relação ao mês anterior</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Avaliação Média</CardTitle>
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{averageRating.toFixed(1)}/5.0</div>
            {/* TODO: Calculate change based on historical data */}
            {/* <p className="text-sm text-muted-foreground">+0.2 em relação ao mês anterior</p> */}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-7 md:col-span-4">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              {/* Pass appointment data to the chart component */}
              <CompanyDashboardChart appointmentData={appointments} />
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-7 md:col-span-3">
          <CardHeader>
            <CardTitle>Tarefas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: Pass relevant data if needed */}
            <CompanyTasksList />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Pass appointment data to the list component */}
            <CompanyUpcomingAppointments appointmentData={appointments} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: Fetch and pass notification data */}
            <CompanyNotifications />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

