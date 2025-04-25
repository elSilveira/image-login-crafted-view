
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export const ProfessionalInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Profissionais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título Profissional</Label>
            <Input id="title" placeholder="Ex: Dermatologista, Psicólogo" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialties">Especialidades</Label>
            <Input id="specialties" placeholder="Ex: Dermatologia Clínica, Procedimentos Estéticos" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografia Profissional</Label>
            <Textarea
              id="bio"
              placeholder="Descreva sua experiência e especialização profissional..."
              className="min-h-[100px]"
            />
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone para Contato</Label>
            <Input id="phone" placeholder="(00) 00000-0000" type="tel" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Profissional</Label>
            <Input id="email" placeholder="exemplo@dominio.com" type="email" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço do Consultório</Label>
            <Input id="address" placeholder="Rua, número, bairro, cidade - Estado" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
