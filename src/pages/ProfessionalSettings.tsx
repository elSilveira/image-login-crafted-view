import React from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ProfessionalSettings = () => {
  return (
    <div className="space-y-6 w-full">
      <h1 className="text-2xl font-semibold">Configurações</h1>
      
      <div className="space-y-6">
        <SettingsSection 
          title="Notificações" 
          description="Gerencie como você recebe notificações sobre seus serviços"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Novos agendamentos</h3>
                <p className="text-sm text-muted-foreground">
                  Receba notificações quando houver novos agendamentos
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Lembretes</h3>
                <p className="text-sm text-muted-foreground">
                  Receba lembretes de agendamentos próximos
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Avaliações</h3>
                <p className="text-sm text-muted-foreground">
                  Notificações quando receber novas avaliações
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection 
          title="Disponibilidade" 
          description="Configure seus horários de disponibilidade"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Horários padrão</h3>
                <p className="text-sm text-muted-foreground">
                  Defina seus horários de atendimento
                </p>
              </div>
              <Button variant="outline">Editar</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Folgas e férias</h3>
                <p className="text-sm text-muted-foreground">
                  Configure períodos de indisponibilidade
                </p>
              </div>
              <Button variant="outline">Configurar</Button>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection 
          title="Integrações" 
          description="Conecte seus serviços com outras plataformas"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Google Calendar</h3>
                <p className="text-sm text-muted-foreground">
                  Sincronize seus agendamentos com o Google Calendar
                </p>
              </div>
              <Button variant="outline">Conectar</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">WhatsApp</h3>
                <p className="text-sm text-muted-foreground">
                  Envie confirmações e lembretes via WhatsApp
                </p>
              </div>
              <Button variant="outline">Configurar</Button>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection 
          title="Segurança" 
          description="Gerencie as configurações de segurança da sua conta"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Senha</h3>
                <p className="text-sm text-muted-foreground">
                  Altere sua senha de acesso
                </p>
              </div>
              <Button variant="outline">Alterar</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Autenticação em duas etapas</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione uma camada extra de segurança
                </p>
              </div>
              <Button variant="outline">Ativar</Button>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection 
          title="Pagamentos" 
          description="Configure suas opções de pagamento e recebimento"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Métodos de pagamento</h3>
                <p className="text-sm text-muted-foreground">
                  Defina quais métodos de pagamento você aceita
                </p>
              </div>
              <Button variant="outline">Configurar</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Conta bancária</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione ou altere suas informações bancárias
                </p>
              </div>
              <Button variant="outline">Editar</Button>
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

export default ProfessionalSettings;
