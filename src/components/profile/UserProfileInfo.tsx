
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Mail, Phone, User } from "lucide-react";

export const UserProfileInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-medium">João Silva</h3>
            <p className="text-sm text-muted-foreground">Cliente desde Janeiro 2024</p>
          </div>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <div className="col-span-3">
              <Input id="name" defaultValue="João Silva" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <div className="col-span-3">
              <Input id="email" type="email" defaultValue="joao@example.com" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Telefone
            </Label>
            <div className="col-span-3">
              <Input id="phone" type="tel" defaultValue="(11) 98765-4321" />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline">Cancelar</Button>
          <Button className="bg-iazi-primary hover:bg-iazi-primary-hover">Salvar Alterações</Button>
        </div>
      </CardContent>
    </Card>
  );
};
