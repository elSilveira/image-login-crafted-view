
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Image as ImageIcon, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const UserProfessionalInfo = () => {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Imagens do Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Imagem de Capa</Label>
              <div className="mt-2 flex items-center gap-4">
                <div className="h-40 w-full bg-muted rounded-lg overflow-hidden relative">
                  {coverImage ? (
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Button variant="outline">
                  Alterar Capa
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Foto de Perfil</Label>
              <div className="mt-2 flex items-center gap-4">
                <div className="h-24 w-24 bg-muted rounded-full overflow-hidden relative">
                  {avatarImage ? (
                    <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Button variant="outline">
                  Alterar Foto
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Experiência Profissional</CardTitle>
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Experience entries will be listed here */}
            <p className="text-sm text-muted-foreground">
              Nenhuma experiência profissional cadastrada.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Formação Acadêmica</CardTitle>
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Education entries will be listed here */}
            <p className="text-sm text-muted-foreground">
              Nenhuma formação acadêmica cadastrada.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Serviços Oferecidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Novo Serviço
          </Button>
        </CardContent>
      </Card>

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

      <Card>
        <CardHeader>
          <CardTitle>Portfólio</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Imagem
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar Alterações</Button>
      </div>
    </div>
  );
};
