
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/lib/api";
import { AddServiceDialog } from "@/components/company/admin/services/AddServiceDialog";
import { ServiceItem } from "@/components/company/admin/services/types";
import { toast } from "sonner";

// Define the structure for a single service association entry
interface ProfessionalService {
  serviceId: string;
  price?: number; // Price specific to this professional for this service
}

// Assuming the main form data structure includes an array for services
interface ServicesFormData {
  services: ProfessionalService[];
}

export const ServicesSection = () => {
  const { control, register, setValue, watch, formState: { errors } } = useFormContext<ServicesFormData>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  // Fetch available services for the dropdown
  const { data: availableServices, isLoading: isLoadingServices, isError: isErrorServices } = useQuery({
    queryKey: ["availableServices"],
    queryFn: fetchServices,
  });

  // Handle adding a service via dialog
  const handleAddService = (service: ServiceItem) => {
    append({ 
      serviceId: service.id, 
      price: service.price 
    });
    toast.success(`Serviço "${service.name}" adicionado`);
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Serviços Oferecidos</CardTitle>
        <Button 
          type="button"
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={() => setIsDialogOpen(true)}
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
                        {availableServices?.map((service: any) => (
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
                <FormMessage />
              </FormItem>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Dialog para adicionar novo serviço com mais opções */}
      <AddServiceDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddService={handleAddService}
      />
    </Card>
  );
};
