
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PublicationFormProps {
  services: Array<{id: string | number; name: string}>;
  onSubmit?: (data: {content: string; serviceId: string; image?: File}) => Promise<void>;
  isLoading?: boolean;
}

const PublicationForm = ({ services = [], onSubmit, isLoading = false }: PublicationFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedServiceId) {
      toast({
        title: "Serviço obrigatório",
        description: "Por favor, selecione um serviço para conectar à publicação.",
        variant: "destructive",
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Conteúdo vazio",
        description: "Por favor, adicione algum texto à sua publicação.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (onSubmit) {
        await onSubmit({
          content,
          serviceId: selectedServiceId,
          image: selectedImage || undefined
        });
      }
      
      // Reset form
      setContent("");
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedServiceId("");
      
    } catch (error) {
      console.error("Failed to create publication:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a publicação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="service">Serviço relacionado *</Label>
          <Select 
            value={selectedServiceId} 
            onValueChange={setSelectedServiceId}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um serviço" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>Carregando serviços...</SelectItem>
              ) : services && services.length > 0 ? (
                services.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>Nenhum serviço encontrado</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="content">O que você gostaria de compartilhar?</Label>
          <Textarea
            id="content"
            placeholder="Escreva sua publicação aqui..."
            className="min-h-[120px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="image" className="block mb-2">Adicionar imagem (opcional)</Label>
          <div className="flex flex-col space-y-3">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {imagePreview && (
              <div className="mt-4 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-auto rounded-lg object-cover max-h-[300px]"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                >
                  Remover
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate("/")}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting || !selectedServiceId || !content.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Publicando...
            </>
          ) : (
            "Publicar"
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default PublicationForm;
