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
import { useLocation, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { AppointmentStatus } from "@/lib/api-services";
import { useToast } from "@/hooks/use-toast";
import { PageContainer } from "@/components/ui/page-container";

const BookingHistory = () => {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [activeTab, setActiveTab] = useState<AppointmentStatus | "all">("scheduled");
  const [filter, setFilter] = useState({
    status: "all",
    period: "all",
    serviceType: "all",
    search: "",
    startDate: "",
    endDate: "",
  });
  const { toast } = useToast();
  const location = useLocation();
  const showNav = !location.pathname.startsWith("/profile/professional");
  
  // Handle period filter change
  const handlePeriodChange = (value: string) => {
    const today = new Date();
    let startDate = "";
    let endDate = "";
    
    switch (value) {
      case "past-week":
        // Last 7 days
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        startDate = lastWeek.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      
      case "past-month":
        // Last 30 days
        const lastMonth = new Date(today);
        lastMonth.setDate(today.getDate() - 30);
        startDate = lastMonth.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
        
      case "next-week":
        // Next 7 days
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        startDate = today.toISOString().split('T')[0];
        endDate = nextWeek.toISOString().split('T')[0];
        break;
        
      case "next-month":
        // Next 30 days
        const nextMonth = new Date(today);
        nextMonth.setDate(today.getDate() + 30);
        startDate = today.toISOString().split('T')[0];
        endDate = nextMonth.toISOString().split('T')[0];
        break;
        
      default:
        // All periods (no date filter)
        startDate = "";
        endDate = "";
    }
    
    setFilter(prev => ({
      ...prev,
      period: value,
      startDate,
      endDate
    }));
  };
  
  return (
    <>
      {showNav && <Navigation />}
      <div className="container mx-auto px-4 py-6 mt-6 md:py-8">
        <PageContainer>
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-6 w-6 text-iazi-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-iazi-text">Meus Agendamentos</h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Top controls */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`${viewMode === "list" ? "bg-iazi-primary hover:bg-iazi-primary-hover" : ""} flex-shrink-0`}
                  >
                    Lista
                  </Button>
                  <Button
                    variant={viewMode === "calendar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("calendar")}
                    className={`${viewMode === "calendar" ? "bg-iazi-primary hover:bg-iazi-primary-hover" : ""} flex-shrink-0`}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendário
                  </Button>
                </div>

                <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs">
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
              <Card className="mb-6 border-iazi-border">
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-iazi-primary" />
                      <span className="text-sm font-medium">Filtros:</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                      <Select value={filter.period} onValueChange={handlePeriodChange}>
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
              <Tabs 
                defaultValue="scheduled" 
                className="w-full"
                onValueChange={(value) => setActiveTab(value as AppointmentStatus | "all")}
              >
                <TabsList className="mb-6 bg-iazi-background-alt w-full justify-start sm:justify-center whitespace-nowrap">
                  <TabsTrigger value="all" className="data-[state=active]:bg-iazi-primary data-[state=active]:text-white flex-1">
                    Todos
                  </TabsTrigger>
                  <TabsTrigger value="scheduled" className="data-[state=active]:bg-iazi-primary data-[state=active]:text-white flex-1">
                    Agendados
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-iazi-primary data-[state=active]:text-white flex-1">
                    Concluídos
                  </TabsTrigger>
                  <TabsTrigger value="cancelled" className="data-[state=active]:bg-iazi-primary data-[state=active]:text-white flex-1">
                    Cancelados
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  {viewMode === "list" ? (
                    <BookingHistoryList 
                      status="all" 
                      serviceType={filter.serviceType !== "all" ? filter.serviceType : undefined}
                      search={filter.search}
                      startDate={filter.startDate}
                      endDate={filter.endDate}
                    />
                  ) : (
                    <BookingHistoryCalendar 
                      status="all"
                      serviceType={filter.serviceType !== "all" ? filter.serviceType : undefined}
                      search={filter.search}
                      startDate={filter.startDate}
                      endDate={filter.endDate}
                    />
                  )}
                </TabsContent>

                <TabsContent value="scheduled">
                  {viewMode === "list" ? (
                    <BookingHistoryList 
                      status="scheduled" 
                      serviceType={filter.serviceType !== "all" ? filter.serviceType : undefined}
                      search={filter.search}
                      startDate={filter.startDate}
                      endDate={filter.endDate}
                    />
                  ) : (
                    <BookingHistoryCalendar 
                      status="scheduled"
                      serviceType={filter.serviceType !== "all" ? filter.serviceType : undefined}
                      search={filter.search}
                      startDate={filter.startDate}
                      endDate={filter.endDate}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="completed">
                  {viewMode === "list" ? (
                    <BookingHistoryList 
                      status="completed" 
                      serviceType={filter.serviceType !== "all" ? filter.serviceType : undefined}
                      search={filter.search}
                      startDate={filter.startDate}
                      endDate={filter.endDate}
                    />
                  ) : (
                    <BookingHistoryCalendar 
                      status="completed"
                      serviceType={filter.serviceType !== "all" ? filter.serviceType : undefined}
                      search={filter.search}
                      startDate={filter.startDate}
                      endDate={filter.endDate}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="cancelled">
                  {viewMode === "list" ? (
                    <BookingHistoryList 
                      status="cancelled" 
                      serviceType={filter.serviceType !== "all" ? filter.serviceType : undefined}
                      search={filter.search}
                      startDate={filter.startDate}
                      endDate={filter.endDate}
                    />
                  ) : (
                    <BookingHistoryCalendar 
                      status="cancelled"
                      serviceType={filter.serviceType !== "all" ? filter.serviceType : undefined}
                      search={filter.search}
                      startDate={filter.startDate}
                      endDate={filter.endDate}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar with quick actions */}
            <div className="space-y-6">
              <Card className="border-iazi-border">
                <CardHeader className="pb-3 bg-muted/30">
                  <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/search">
                      <Calendar className="h-4 w-4 mr-2" />
                      Novo Agendamento
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/reviews">
                      <Star className="h-4 w-4 mr-2" />
                      Minhas Avaliações
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Comprovantes
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-iazi-border">
                <CardHeader className="pb-3 bg-muted/30">
                  <CardTitle className="text-lg">Agendamentos Recentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-3 bg-iazi-background-alt rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
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
        </PageContainer>
      </div>
    </>
  );
};

export default BookingHistory;
