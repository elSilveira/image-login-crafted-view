import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Define the structure for a single portfolio item
interface PortfolioItem {
  imageUrl: string;
  description?: string; // Optional
}

// Assuming the main form data structure includes an array for portfolio
interface PortfolioFormData {
  portfolio: PortfolioItem[];
}

export const PortfolioSection = () => {
  const { control, register, watch } = useFormContext<PortfolioFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "portfolio",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Portfólio (URLs)</CardTitle>
        <Button 
          type="button" // Prevent form submission
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={() => append({ imageUrl: "", description: "" })} // Add empty portfolio item
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum item de portfólio cadastrado.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fields.map((field, index) => {
                const imageUrl = watch(`portfolio.${index}.imageUrl` as const);
                return (
                  <div key={field.id} className="space-y-3 border p-4 rounded-md relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 text-destructive hover:bg-destructive/10 h-7 w-7"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    {/* Image Preview */}
                    <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden relative border mb-2">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={`Prévia ${index + 1}`} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          onLoad={(e) => { e.currentTarget.style.display = 'block'; }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <FormItem>
                      <FormLabel>URL da Imagem</FormLabel>
                      <FormControl>
                        <Input 
                          type="url"
                          placeholder="https://exemplo.com/imagem.jpg"
                          {...register(`portfolio.${index}.imageUrl` as const)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    
                    <FormItem>
                      <FormLabel>Descrição (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Breve descrição do item..."
                          rows={2}
                          {...register(`portfolio.${index}.description` as const)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

