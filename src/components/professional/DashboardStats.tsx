import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Users, CreditCard, Calendar } from "lucide-react";
import { DashboardStats as DashboardStatsType } from "@/api/types";

interface DashboardStatsProps {
  stats: DashboardStatsType | null;
  isLoading: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, isLoading }) => {
  // Função para calcular a variação percentual
  const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium tracking-tight">Faturamento</h3>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold">
          R$ {(stats?.currentMonthRevenue !== undefined ? stats.currentMonthRevenue.toLocaleString('pt-BR') : '0')}
        </div>
        {stats && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={`inline-flex items-center ${
              calculatePercentageChange(
                stats.currentMonthRevenue ?? 0, 
                stats.previousMonthRevenue ?? 0
              ) >= 0
                ? 'text-emerald-500'
                : 'text-rose-500'
            }`}>
              {calculatePercentageChange(
                stats.currentMonthRevenue ?? 0, 
                stats.previousMonthRevenue ?? 0
              ) >= 0 ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              {Math.abs(calculatePercentageChange(
                stats.currentMonthRevenue ?? 0, 
                stats.previousMonthRevenue ?? 0
              ))}%
            </span>{" "}
            em relação ao mês passado
          </p>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium tracking-tight">Agendamentos</h3>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold">
          {stats?.currentMonthAppointments ?? '0'}
        </div>
        {stats && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={`inline-flex items-center ${
              calculatePercentageChange(
                stats.currentMonthAppointments ?? 0, 
                stats.previousMonthAppointments ?? 0
              ) >= 0
                ? 'text-emerald-500'
                : 'text-rose-500'
            }`}>
              {calculatePercentageChange(
                stats.currentMonthAppointments ?? 0, 
                stats.previousMonthAppointments ?? 0
              ) >= 0 ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              {Math.abs(calculatePercentageChange(
                stats.currentMonthAppointments ?? 0, 
                stats.previousMonthAppointments ?? 0
              ))}%
            </span>{" "}
            em relação ao mês passado
          </p>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium tracking-tight">Novos Clientes</h3>
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold">
          {stats?.currentMonthNewClients ?? '0'}
        </div>
        {stats && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={`inline-flex items-center ${
              calculatePercentageChange(
                stats.currentMonthNewClients ?? 0, 
                stats.previousMonthNewClients ?? 0
              ) >= 0
                ? 'text-emerald-500'
                : 'text-rose-500'
            }`}>
              {calculatePercentageChange(
                stats.currentMonthNewClients ?? 0, 
                stats.previousMonthNewClients ?? 0
              ) >= 0 ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              {Math.abs(calculatePercentageChange(
                stats.currentMonthNewClients ?? 0, 
                stats.previousMonthNewClients ?? 0
              ))}%
            </span>{" "}
            em relação ao mês passado
          </p>
        )}
      </Card>
    </div>
  );
};

export default DashboardStats; 