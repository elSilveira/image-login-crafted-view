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
import { createService } from "@/lib/api-services";
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
  price: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        // Remove espaços e substitui vírgula por ponto
        const normalized = val.replace(/\s/g, '').replace(',', '.');
        // Se for vazio, retorna undefined (campo opcional)
        if (normalized === "") return undefined;
        // Permite números inteiros ou decimais com 1 ou 2 casas
        if (!/^\d+([.,]\d{1,2})?$/.test(val)) return NaN;
        return Number(normalized);
      }
      if (typeof val === "number") {
        return val;
      }
      return undefined;
    },
    z.number({ invalid_type_error: "Informe um valor válido (ex: 100, 100.00 ou 100,00)" })
      .positive("O valor deve ser maior que 0")
      .optional()
  ),
  duration: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        if (val.trim() === "") return undefined;
        if (isNaN(Number(val))) return NaN;
        return Number(val);
      }
      return val;
    },
    z.number({ invalid_type_error: "Informe uma duração válida" })
      .positive("A duração deve ser maior que 0")
      .optional()
  ),
  categoryId: z.string().optional(),
  image: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "") ? undefined : val,
    z.string().url("URL da imagem inválida").optional()
  ),
});

type ServiceFormValues = {
  name: string;
  description?: string;
  price?: number | string;
  duration?: number | string;
  categoryId?: string;
  image?: string;
};

export const CreateServiceForm: React.FC<CreateServiceFormProps> = ({
  categories,
  onSubmit,
}) => {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      duration: 60,
      categoryId: "",
      image: "",
    },
  });

  // Mutation para criar um novo serviço
  const mutation = useMutation({
    mutationFn: (data: ServiceFormValues) => {
      // Simula criação de serviço para preview local (não usar categories aqui)
      return Promise.resolve({
        id: `new-service-${Date.now()}`,
        ...data,
        categoryName: categories.find(c => c.id === data.categoryId)?.name || undefined
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
                    type="text"
                    inputMode="decimal"
                    pattern="^\d+([.,]\d{1,2})?$"
                    placeholder="100.00"
                    autoComplete="off"
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
                value={field.value || ""}
                onValueChange={val => field.onChange(val)}
                disabled={categories.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
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
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  autoComplete="off"
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
