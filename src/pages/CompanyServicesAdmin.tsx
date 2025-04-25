
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";

const CompanyServicesAdmin = () => {
  return (
    <CompanyLayout>
      <div className="space-y-6 w-full">
        <h1 className="text-2xl font-semibold">Gerenciar Serviços</h1>
        <div className="bg-white rounded-lg border border-iazi-border p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Serviços da Empresa</h2>
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">
              Adicionar Serviço
            </button>
          </div>
          
          <div className="rounded-md border">
            <div className="bg-muted/50 p-4 text-sm font-medium">
              Você não cadastrou serviços ainda
            </div>
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                Cadastre seus serviços para que os clientes possam encontrá-los e reservá-los.
              </p>
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">
                Adicionar Primeiro Serviço
              </button>
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanyServicesAdmin;
