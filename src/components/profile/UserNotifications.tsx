
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const UserNotifications = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { id: "email", label: "Notificações por Email" },
          { id: "sms", label: "Notificações por SMS" },
          { id: "push", label: "Notificações Push" },
          { id: "marketing", label: "Comunicações de Marketing" },
        ].map((pref) => (
          <div key={pref.id} className="flex items-center justify-between space-x-2">
            <Label htmlFor={pref.id}>{pref.label}</Label>
            <Switch id={pref.id} defaultChecked={pref.id === "email"} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
