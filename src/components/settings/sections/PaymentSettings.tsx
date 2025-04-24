
import React from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

export const PaymentSettings = () => {
  return (
    <SettingsSection
      title="Métodos de Pagamento"
      description="Gerencie seus métodos de pagamento e histórico de faturamento."
    >
      <div className="space-y-6">
        <div>
          <h3 className="font-medium font-playfair mb-2 text-iazi-text">Cartões Salvos</h3>
          <div className="p-4 border rounded-md bg-iazi-background-alt text-center">
            <p className="text-muted-foreground mb-4">Nenhum cartão salvo</p>
            <Button className="bg-iazi-primary hover:bg-iazi-primary-hover">
              <CreditCard className="mr-2 h-4 w-4" />
              Adicionar Cartão
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium font-playfair mb-2 text-iazi-text">Histórico de Pagamentos</h3>
          <p className="text-muted-foreground text-center py-4">
            Seu histórico de pagamentos aparecerá aqui
          </p>
        </div>
      </div>
    </SettingsSection>
  );
};
