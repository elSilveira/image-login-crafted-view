
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

export const AvailabilitySection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Horários de Atendimento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
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
  );
};
