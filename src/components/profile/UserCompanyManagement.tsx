
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const UserCompanyManagement = () => {
  const [hasCompany, setHasCompany] = useState(false);

  return (
    <div className="space-y-6">
      {!hasCompany ? (
        <Card>
          <CardHeader>
            <CardTitle>Criar Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Building className="mr-2" />
                  Criar Nova Empresa
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Nova Empresa</DialogTitle>
                  <DialogDescription>
                    Preencha as informações da sua empresa
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input id="companyName" placeholder="Digite o nome da empresa" />
                  </div>
                  <div>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input id="cnpj" placeholder="Digite o CNPJ" />
                  </div>
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input id="address" placeholder="Digite o endereço completo" />
                  </div>
                  <Button type="submit" className="w-full">
                    Criar Empresa
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Minha Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Nome Fantasia</h3>
                  <p className="text-muted-foreground">Empresa Exemplo LTDA</p>
                </div>
                <div>
                  <h3 className="font-medium">CNPJ</h3>
                  <p className="text-muted-foreground">12.345.678/0001-90</p>
                </div>
                <div>
                  <h3 className="font-medium">Endereço</h3>
                  <p className="text-muted-foreground">Rua Exemplo, 123 - São Paulo, SP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profissionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2" />
                      Adicionar Profissional
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Profissional</DialogTitle>
                      <DialogDescription>
                        Adicione um novo profissional à sua empresa
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email do Profissional</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Digite o email do profissional"
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Convidar Profissional
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="rounded-md border">
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Ainda não há profissionais cadastrados
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
