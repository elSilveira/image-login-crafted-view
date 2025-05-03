import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming Select is available
import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/lib/api"; // Assuming an API function to fetch all services

// Define the structure for a single service association entry
interface ProfessionalService {
  serviceId: string;
  price?: number; // Price specific to this professional for this service
}

// Assuming the main form data structure includes an array for services
interface ServicesFormData {
  services: ProfessionalService[];
}

// Interface for the fetched service data
interface Service {
  id: string;
  name: string;
  description?: string;
  // Add other relevant service fields
}

export const ServicesSection = () => {
  const { control, register, setValue, formState: { errors } } = useFormContext<ServicesFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  // Fetch available services for the dropdown
  const { data: availableServices, isLoading: isLoadingServices, isError: isErrorServices } = useQuery<Service[], Error>({
    queryKey: ["availableServices"],
    queryFn: fetchServices, // Assumes fetchServices returns Service[]
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Serviços Oferecidos</CardTitle>
        <Button 
          type="button" // Prevent form submission
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={() => append({ serviceId: "", price: undefined })} // Add empty service association
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Serviço
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isLoadingServices && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
          {isErrorServices && <p className="text-sm text-destructive">Erro ao carregar serviços.</p>}
          
          {fields.length === 0 && !isLoadingServices && !isErrorServices && (
            <p className="text-sm text-muted-foreground">
              Nenhum serviço oferecido cadastrado.
            </p>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-4 border p-4 rounded-md relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 h-7 w-7"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <FormField
                control={control}
                name={`services.${index}.serviceId`}
                render={({ field: selectField }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Serviço</FormLabel>
                    <Select 
                      onValueChange={selectField.onChange} 
                      defaultValue={selectField.value}
                      disabled={isLoadingServices || !availableServices}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um serviço" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableServices?.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className="w-32">
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.01"
                    placeholder="Opcional"
                    {...register(`services.${index}.price`, { valueAsNumber: true })}
                  />
                </FormControl>
                {/* Display error specifically for price if needed */}
                {/* <FormMessage>{errors.services?.[index]?.price?.message}</FormMessage> */}
              </FormItem>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

