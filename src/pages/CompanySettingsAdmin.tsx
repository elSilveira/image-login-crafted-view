
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/button";

const CompanySettingsAdmin = () => {
  return (
    <CompanyLayout>
      <div className="space-y-6 w-full">
        <h1 className="text-2xl font-semibold">Configurações</h1>
        
        <div className="space-y-6">
          <SettingsSection 
            title="Notificações" 
            description="Gerencie como você recebe notificações sobre sua empresa"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Novos agendamentos</h3>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações quando houver novos agendamentos
                  </p>
                </div>
                <Button variant="outline">Configurar</Button>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection 
            title="Horário de Funcionamento" 
            description="Configure os horários em que sua empresa está aberta"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Horários padrão</h3>
                  <p className="text-sm text-muted-foreground">
                    Defina os horários de funcionamento da sua empresa
                  </p>
                </div>
                <Button variant="outline">Editar</Button>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection 
            title="Integrações" 
            description="Conecte sua empresa com outros serviços"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Google Calendar</h3>
                  <p className="text-sm text-muted-foreground">
                    Sincronize seus agendamentos com o Google Calendar
                  </p>
                </div>
                <Button>Conectar</Button>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanySettingsAdmin;
