import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Define the structure for a single experience entry
interface Experience {
  title: string;
  company: string;
  startDate: string; // Consider using date type if needed
  endDate?: string; // Optional
  description?: string; // Optional
}

// Assuming the main form data structure includes an array for experiences
interface ExperienceFormData {
  experiences: Experience[];
}

export const ExperienceSection = () => {
  const { control, register } = useFormContext<ExperienceFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Experiência Profissional</CardTitle>
        <Button 
          type="button" // Prevent form submission
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={() => append({ title: "", company: "", startDate: "", endDate: "", description: "" })} // Add empty experience
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Experiência
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma experiência profissional cadastrada.
            </p>
          ) : (
            fields.map((field, index) => (
              <div key={field.id} className="space-y-4 border p-4 rounded-md relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Médico Residente"
                        {...register(`experiences.${index}.title` as const)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Empresa/Instituição</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Hospital Exemplo"
                        {...register(`experiences.${index}.company` as const)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      {/* Consider using a DatePicker component here */}
                      <Input 
                        type="month" // Or text/date
                        {...register(`experiences.${index}.startDate` as const)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Data de Término (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="month" // Or text/date
                        {...register(`experiences.${index}.endDate` as const)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva suas responsabilidades e conquistas..."
                      {...register(`experiences.${index}.description` as const)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

