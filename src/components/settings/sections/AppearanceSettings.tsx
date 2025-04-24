
import React from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AppearanceSettings = () => {
  return (
    <SettingsSection
      title="Aparência"
      description="Personalize a aparência do aplicativo."
    >
      <div className="space-y-6">
        <div>
          <h3 className="font-medium font-playfair mb-3 text-iazi-text">Tema</h3>
          <RadioGroup defaultValue="light" className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="theme-light" />
              <Label htmlFor="theme-light" className="font-inter">Claro</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label htmlFor="theme-dark" className="font-inter">Escuro</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="theme-system" />
              <Label htmlFor="theme-system" className="font-inter">Sistema</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="font-medium font-playfair mb-3 text-iazi-text">Tamanho da Fonte</h3>
          <Select defaultValue="medium">
            <SelectTrigger>
              <SelectValue placeholder="Selecione um tamanho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Pequeno</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
              <SelectItem value="x-large">Extra Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </SettingsSection>
  );
};
