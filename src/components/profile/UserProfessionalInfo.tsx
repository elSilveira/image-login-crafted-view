
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock } from "lucide-react";

export const UserProfessionalInfo = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Profissionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="profession">Profissão</Label>
              <Input id="profession" placeholder="Ex: Cabeleireiro, Eletricista" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialties">Especialidades</Label>
              <Input id="specialties" placeholder="Ex: Corte masculino, Coloração" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Anos de Experiência</Label>
              <Input id="experience" type="number" placeholder="Ex: 5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biografia Profissional</Label>
              <Textarea
                id="bio"
                placeholder="Conte um pouco sobre sua experiência profissional..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Serviços Oferecidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full sm:w-auto">
            Adicionar Novo Serviço
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Horários de Atendimento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button variant="outline" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Definir Dias
            </Button>
            <Button variant="outline" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Definir Horários
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
