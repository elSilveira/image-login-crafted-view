
import React from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const PrivacySettings = () => {
  return (
    <SettingsSection
      title="Privacidade"
      description="Gerencie suas configurações de privacidade e visibilidade."
    >
      <div className="space-y-4">
        {[
          { id: "public-profile", label: "Perfil público" },
          { id: "show-online", label: "Mostrar status online" },
          { id: "search-visibility", label: "Visível em buscas" },
          { id: "share-data", label: "Compartilhar dados de uso anônimos" },
        ].map((item) => (
          <div key={item.id} className="flex items-center justify-between space-x-2">
            <Label htmlFor={item.id} className="font-inter">{item.label}</Label>
            <Switch id={item.id} defaultChecked={item.id === "public-profile"} />
          </div>
        ))}
      </div>
    </SettingsSection>
  );
};
