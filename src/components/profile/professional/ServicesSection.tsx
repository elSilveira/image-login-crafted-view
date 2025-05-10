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

  // Ensure availableServices is always an array
  const serviceOptions = Array.isArray(availableServices?.data)
    ? availableServices.data
    : Array.isArray(availableServices)
      ? availableServices
      : [];

  // Handle adding a service via dialog
  const handleAddService = (service: ServiceItem) => {
    append({ 
      serviceId: service.id, 
      price: Number(service.price) 
    });
    toast.success(`Serviço "${service.name}" adicionado`);
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Serviços Oferecidos</CardTitle>
          <p className="text-muted-foreground text-sm mt-1">
            Adicione os serviços que você oferece. O campo "Preço" pode ser personalizado para cada serviço. O nome e categoria são definidos no cadastro do serviço.
          </p>
        </div>
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

          {fields.map((field, index) => {
            // Find service details for display
            const service = serviceOptions.find((s: any) => s.id === field.serviceId);
            return (
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
                        value={selectField.value}
                        disabled={!!field.serviceId} // Only allow selecting if not set
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um serviço" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceOptions.map((service: any) => (
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

                <div className="flex flex-col min-w-[180px]">
                  <Label>Categoria</Label>
                  <div className="text-sm text-muted-foreground">
                    {service?.categoryName || "-"}
                  </div>
                  <Label className="mt-2">Descrição</Label>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {service?.description || "-"}
                  </div>
                </div>

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
            );
          })}
        </div>
      </CardContent>

      {/* Dialog para adicionar novo serviço com mais opções */}
      <AddServiceDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddService={handleAddService}
        persistImmediately={false} // Only update form state, do not persist yet
        professionalId={"temp"} // Not used when persistImmediately is false
      />
    </Card>
  );
};
