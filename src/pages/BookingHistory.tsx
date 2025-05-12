import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Search, Filter, Star, FileText, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BookingHistoryList from "@/components/booking/BookingHistoryList";
import BookingHistoryCalendar from "@/components/booking/BookingHistoryCalendar";
import { useLocation } from "react-router-dom";
// Header is provided by ProfessionalAreaLayout in professional area

const BookingHistory = () => {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  // Remove Navigation usage here to avoid duplicate header in professional area
  const [filter, setFilter] = useState({
    status: "all",
    period: "all",
    serviceType: "all",
    search: "",
  });
  const location = useLocation();
  const showNav = !location.pathname.startsWith("/profile/professional");

  return (
    <>
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-6 text-iazi-text font-playfair">Meus Agendamentos</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            {/* Top controls */}
            <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-iazi-primary hover:bg-iazi-primary-hover" : ""}
                >
                  Lista
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                  className={viewMode === "calendar" ? "bg-iazi-primary hover:bg-iazi-primary-hover" : ""}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendário
                </Button>
              </div>

              <div className="relative flex-1 max-w-sm ml-auto">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar agendamentos..."
                  className="pl-8"
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                />
              </div>
            </div>

            {/* Filter options */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filtros:</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                    <Select value={filter.period} onValueChange={(value) => setFilter({ ...filter, period: value })}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os períodos</SelectItem>
                        <SelectItem value="past-week">Últimos 7 dias</SelectItem>
                        <SelectItem value="past-month">Últimos 30 dias</SelectItem>
                        <SelectItem value="next-week">Próximos 7 dias</SelectItem>
                        <SelectItem value="next-month">Próximos 30 dias</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filter.serviceType} onValueChange={(value) => setFilter({ ...filter, serviceType: value })}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Tipo de serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os serviços</SelectItem>
                        <SelectItem value="haircut">Corte de cabelo</SelectItem>
                        <SelectItem value="manicure">Manicure</SelectItem>
                        <SelectItem value="massage">Massagem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs and content */}
            <Tabs defaultValue="scheduled" className="w-full">
              <TabsList className="mb-6 bg-iazi-background-alt">
                <TabsTrigger value="scheduled" className="data-[state=active]:bg-iazi-primary data-[state=active]:text-white">
                  Agendados
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-iazi-primary data-[state=active]:text-white">
                  Concluídos
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="data-[state=active]:bg-iazi-primary data-[state=active]:text-white">
                  Cancelados
                </TabsTrigger>
              </TabsList>

              <TabsContent value="scheduled">
                {viewMode === "list" ? (
                  <BookingHistoryList status="scheduled" />
                ) : (
                  <BookingHistoryCalendar status="scheduled" />
                )}
              </TabsContent>
              
              <TabsContent value="completed">
                {viewMode === "list" ? (
                  <BookingHistoryList status="completed" />
                ) : (
                  <BookingHistoryCalendar status="completed" />
                )}
              </TabsContent>
              
              <TabsContent value="cancelled">
                {viewMode === "list" ? (
                  <BookingHistoryList status="cancelled" />
                ) : (
                  <BookingHistoryCalendar status="cancelled" />
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar with quick actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-playfair">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Minhas Avaliações
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Comprovantes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-playfair">Agendamentos Recentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="p-3 bg-iazi-background-alt rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{i === 1 ? "Corte de Cabelo" : "Manicure"}</p>
                        <p className="text-sm text-muted-foreground">{i === 1 ? "João Silva" : "Maria Santos"}</p>
                      </div>
                      <Badge variant={i === 1 ? "default" : "outline"} className={i === 1 ? "bg-iazi-primary" : ""}>
                        {i === 1 ? "Amanhã" : "Concluído"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingHistory;
