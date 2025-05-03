import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useFormContext } from "react-hook-form"; // Import useFormContext
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Import Form components

// Assuming the main form data structure includes these fields
interface ProfessionalInfoFormData {
  name: string; // Already in main schema
  role: string; // Already in main schema
  bio?: string; // Already in main schema
  phone?: string; // Already in main schema
  // Add other fields specific to this section if needed by backend
  // email?: string; // Not in current backend validator/schema for Professional
  // address?: string; // Not in current backend validator/schema for Professional
  // specialties?: string; // Not in current backend validator/schema for Professional
}

export const ProfessionalInfo = () => {
  const { control, register } = useFormContext<ProfessionalInfoFormData>(); // Get control and register

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Profissionais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {/* Name - Controlled by main form */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="name">Nome</FormLabel>
                <FormControl>
                  <Input id="name" placeholder="Nome Completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role - Controlled by main form */}
          <FormField
            control={control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="role">Cargo/Título Profissional</FormLabel>
                <FormControl>
                  <Input id="role" placeholder="Ex: Dermatologista, Psicólogo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio - Controlled by main form */}
          <FormField
            control={control}
            name="bio"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="bio">Biografia Profissional</FormLabel>
                <FormControl>
                  <Textarea
                    id="bio"
                    placeholder="Descreva sua experiência e especialização profissional..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-4" />

          {/* Phone - Controlled by main form */}
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="phone">Telefone para Contato</FormLabel>
                <FormControl>
                  <Input id="phone" placeholder="(00) 00000-0000" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Removed fields not directly in Professional model/validator: specialties, email, address */}
          {/* If these are needed, they must be added to the backend model/validator first */}

        </div>
      </CardContent>
    </Card>
  );
};

