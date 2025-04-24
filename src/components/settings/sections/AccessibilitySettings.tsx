
import React from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export const AccessibilitySettings = () => {
  return (
    <SettingsSection
      title="Acessibilidade"
      description="Configure opções para melhorar a acessibilidade do aplicativo."
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {[
            { id: "screen-reader", label: "Compatível com leitor de tela" },
            { id: "reduce-motion", label: "Reduzir movimento" },
            { id: "high-contrast", label: "Alto contraste" },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between space-x-2">
              <Label htmlFor={item.id} className="font-inter">{item.label}</Label>
              <Switch id={item.id} />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-spacing" className="font-inter">Espaçamento de Texto</Label>
          <Slider
            id="text-spacing"
            defaultValue={[1]}
            max={2}
            min={0.5}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>
    </SettingsSection>
  );
};
