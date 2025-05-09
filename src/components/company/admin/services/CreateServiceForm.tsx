
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { createServiceSchema, createService } from "@/lib/api";
import { toast } from "sonner";
import { Category, ServiceItem } from "./types";
import { Loader2 } from "lucide-react";

interface CreateServiceFormProps {
  categories: Category[];
  onSubmit: (service: ServiceItem) => void;
}

// Schema for form validation
const serviceFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.string().optional().transform(val => val ? Number(val) : undefined),
  duration: z.string().optional().transform(val => val ? Number(val) : undefined),
  categoryId: z.string().optional(),
  image: z.string().url("URL da imagem inválida").optional().or(z.literal("")),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export const CreateServiceForm: React.FC<CreateServiceFormProps> = ({
  categories,
  onSubmit,
}) => {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      duration: "60",
      categoryId: "",
      image: "",
    },
  });

  // Mutation para criar um novo serviço
  const mutation = useMutation({
    mutationFn: (data: ServiceFormValues) => {
      // Implement API call to create service
      return Promise.resolve({ 
        id: `new-service-${Date.now()}`,
        ...data,
        categoryName: data.categoryId ? 
          categories.find(c => c.id === data.categoryId)?.name : undefined
      });
    },
    onSuccess: (data) => {
      // Format the data to match ServiceItem
      const newService: ServiceItem = {
        id: data.id,
        name: data.name,
        description: data.description,
        price: typeof data.price === 'number' ? data.price : undefined,
        duration: typeof data.duration === 'number' ? data.duration : undefined,
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        image: data.image,
      };
      
      onSubmit(newService);
      toast.success("Serviço criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar serviço");
      console.error("Error creating service:", error);
    },
  });

  const handleSubmit = (values: ServiceFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Serviço*</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Corte de Cabelo Masculino" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Descreva os detalhes do serviço..." 
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Uma descrição clara ajuda os clientes a entenderem o serviço.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    min="0"
                    step="0.01"
                    placeholder="100.00" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração (minutos)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    min="5"
                    step="5"
                    placeholder="60" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Imagem</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="https://exemplo.com/imagem.jpg" 
                />
              </FormControl>
              <FormDescription>
                URL da imagem que representa o serviço (opcional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={mutation.isPending || !form.formState.isValid}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Criando...
            </>
          ) : (
            "Criar Serviço"
          )}
        </Button>
      </form>
    </Form>
  );
};
