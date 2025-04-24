
import React from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const LocaleSettings = () => {
  return (
    <SettingsSection
      title="Idioma e Região"
      description="Configure seu idioma preferido e opções regionais."
    >
      <div className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="language" className="font-inter">Idioma</Label>
          <Select defaultValue="pt-BR">
            <SelectTrigger id="language">
              <SelectValue placeholder="Selecione um idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="region" className="font-inter">Região</Label>
          <Select defaultValue="BR">
            <SelectTrigger id="region">
              <SelectValue placeholder="Selecione uma região" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BR">Brasil</SelectItem>
              <SelectItem value="US">Estados Unidos</SelectItem>
              <SelectItem value="ES">Espanha</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="date-format" className="font-inter">Formato de Data</Label>
          <Select defaultValue="DD/MM/YYYY">
            <SelectTrigger id="date-format">
              <SelectValue placeholder="Selecione um formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DD/MM/YYYY">DD/MM/AAAA</SelectItem>
              <SelectItem value="MM/DD/YYYY">MM/DD/AAAA</SelectItem>
              <SelectItem value="YYYY-MM-DD">AAAA-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </SettingsSection>
  );
};
