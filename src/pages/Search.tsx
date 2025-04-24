
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon } from "lucide-react";

// Import directly from the files
import { professionals } from "./Professionals";
import { services } from "./Services";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter both services and companies based on search term
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.professional.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompanies = professionals.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
    company.professionals.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Buscar</h1>
          <p className="text-gray-600 mb-8">
            Encontre serviços e empresas disponíveis na plataforma
          </p>

          {/* Search Input */}
          <div className="relative mb-8">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input 
              placeholder="Digite o que você procura..."
              className="pl-10 py-6 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Results Tabs */}
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full border-b mb-6">
              <TabsTrigger value="all" className="flex-1">
                Todos ({filteredServices.length + filteredCompanies.length})
              </TabsTrigger>
              <TabsTrigger value="services" className="flex-1">
                Serviços ({filteredServices.length})
              </TabsTrigger>
              <TabsTrigger value="companies" className="flex-1">
                Empresas ({filteredCompanies.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              {/* Services Section */}
              {filteredServices.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Serviços</h2>
                    <Button variant="link" onClick={() => setActiveTab("services")}>
                      Ver todos os serviços
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredServices.slice(0, 4).map((service) => (
                      <div key={service.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-medium mb-1">{service.name}</h3>
                        <p className="text-sm text-[#4664EA]">{service.category}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          {service.company} • {service.professional}
                        </p>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">{service.price}</span>
                          <span className="text-gray-500"> • {service.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Companies Section */}
              {filteredCompanies.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Empresas</h2>
                    <Button variant="link" onClick={() => setActiveTab("companies")}>
                      Ver todas as empresas
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCompanies.slice(0, 4).map((company) => (
                      <div key={company.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-medium mb-1">{company.name}</h3>
                        <p className="text-sm text-[#4664EA]">{company.specialty}</p>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Serviços: {company.services.slice(0, 2).join(", ")}</p>
                          <p className="mt-1">Profissionais: {company.professionals.slice(0, 2).join(", ")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="services">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredServices.map((service) => (
                  <div key={service.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-medium mb-1">{service.name}</h3>
                    <p className="text-sm text-[#4664EA]">{service.category}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {service.company} • {service.professional}
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">{service.price}</span>
                      <span className="text-gray-500"> • {service.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="companies">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCompanies.map((company) => (
                  <div key={company.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-medium mb-1">{company.name}</h3>
                    <p className="text-sm text-[#4664EA]">{company.specialty}</p>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Serviços: {company.services.join(", ")}</p>
                      <p className="mt-1">Profissionais: {company.professionals.join(", ")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Search;
