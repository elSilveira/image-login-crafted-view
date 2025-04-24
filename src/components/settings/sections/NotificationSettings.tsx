
import React from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const NotificationSettings = () => {
  return (
    <SettingsSection
      title="Notificações"
      description="Configure como e quando você deseja receber notificações."
    >
      <div className="space-y-4">
        {[
          { id: "email-notifications", label: "Notificações por Email", channel: "Email" },
          { id: "sms-notifications", label: "Notificações por SMS", channel: "SMS" },
          { id: "push-notifications", label: "Notificações Push", channel: "Push" },
          { id: "appointments", label: "Agendamentos", type: "Tipo" },
          { id: "promotions", label: "Promoções", type: "Tipo" },
          { id: "system", label: "Sistema", type: "Tipo" },
        ].map((item) => (
          <div key={item.id} className="flex items-center justify-between space-x-2">
            <div>
              <Label htmlFor={item.id} className="font-inter">{item.label}</Label>
              {item.channel && <p className="text-xs text-muted-foreground">Canal: {item.channel}</p>}
              {item.type && <p className="text-xs text-muted-foreground">Tipo: {item.type}</p>}
            </div>
            <Switch id={item.id} defaultChecked={item.id === "email-notifications" || item.id === "appointments"} />
          </div>
        ))}
      </div>
    </SettingsSection>
  );
};
