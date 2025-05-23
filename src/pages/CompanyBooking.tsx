
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CompanyCalendarContent } from "@/components/company/calendar/CompanyCalendarContent";
import { CompanyServicesList } from "@/components/company/CompanyServicesList";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer } from "@/components/ui/page-container";

const CompanyBooking = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-[#F4F3F2]">
      <Navigation />
      <div className="container max-w-7xl mx-auto py-8 px-4 pt-16">
        <PageContainer>
          <Card className="shadow-sm border-iazi-border">
            <CardContent className="p-6">
              <Tabs defaultValue="services" className="space-y-4">
                <TabsList className="bg-gray-100">
                  <TabsTrigger 
                    value="services" 
                    className={`data-[state=active]:bg-white data-[state=active]:text-primary`}
                  >
                    1. Escolher Serviço
                  </TabsTrigger>
                  <TabsTrigger 
                    value="calendar" 
                    disabled={!selectedService}
                    className={`data-[state=active]:bg-white data-[state=active]:text-primary`}
                  >
                    2. Escolher Horário
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="services" className="space-y-4">
                  <CompanyServicesList
                    companyId={companyId}
                    searchTerm=""
                    category="Todas categorias"
                    sortBy="rating"
                    ratingFilter={[0, 5]}
                    priceRange="Qualquer preço"
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                </TabsContent>
                
                <TabsContent value="calendar">
                  <CompanyCalendarContent />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </PageContainer>
      </div>
    </div>
  );
};

export default CompanyBooking;
