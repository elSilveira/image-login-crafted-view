import React from "react";
import { SettingsSection } from "../SettingsSection";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PWADiagnostics } from "@/components/settings/sections/PWADiagnostics";

export const AppearanceSettings = () => {
  return (
    <SettingsSection
      title="Aparência"
      description="Personalize como o iAzi aparece para você."
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Modo de cor</h3>
          <div className="flex items-center space-x-2">
            <Switch id="dark-mode" />
            <Label htmlFor="dark-mode">Modo escuro</Label>
          </div>
          <p className="text-sm text-gray-500">
            Quando ativado, o iAzi usará cores escuras para o tema.
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tamanho do texto</h3>
          <div className="flex items-center space-x-2">
            <Switch id="large-text" />
            <Label htmlFor="large-text">Texto ampliado</Label>
          </div>
          <p className="text-sm text-gray-500">
            Quando ativado, o tamanho do texto será aumentado em toda a aplicação.
          </p>
        </div>

        <Separator />

        {/* PWA Diagnostics Component */}
        <PWADiagnostics />
      </div>
    </SettingsSection>
  );
};
