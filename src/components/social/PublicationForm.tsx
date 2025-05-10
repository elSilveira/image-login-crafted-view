
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Image as ImageIcon, FileVideo, Link as LinkIcon, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PublicationFormProps {
  services: Array<{id: string | number; name: string}>;
  onSubmit?: (data: {
    content: string; 
    serviceId: string; 
    image?: File;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
  }) => Promise<void>;
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
  const [mediaTab, setMediaTab] = useState<string>("upload");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

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
      
      // Reset URL if file is selected
      setMediaUrl("");
    }
  };

  const handleMediaUrlChange = (url: string) => {
    setMediaUrl(url);
    
    // Reset file upload if URL is entered
    if (url) {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };
  
  const clearMedia = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setMediaUrl("");
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
          image: selectedImage || undefined,
          mediaUrl: mediaUrl || undefined,
          mediaType
        });
      }
      
      // Reset form
      setContent("");
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedServiceId("");
      setMediaUrl("");
      
      toast({
        title: "Publicação criada",
        description: "Sua publicação foi compartilhada com sucesso!",
      });
      
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

  const handleCancel = () => {
    setContent("");
    setSelectedImage(null);
    setImagePreview(null);
    setSelectedServiceId("");
    setMediaUrl("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6 p-0">
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
          <Label htmlFor="media" className="block mb-2">Adicionar mídia (opcional)</Label>
          <Tabs defaultValue="upload" value={mediaTab} onValueChange={setMediaTab} className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="upload">
                <ImageIcon className="h-4 w-4 mr-2" />
                Upload de Arquivo
              </TabsTrigger>
              <TabsTrigger value="url">
                <LinkIcon className="h-4 w-4 mr-2" />
                URL
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
            </TabsContent>
            
            <TabsContent value="url" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Tipo de Mídia</Label>
                  <Select 
                    value={mediaType} 
                    onValueChange={(val) => setMediaType(val as 'image' | 'video')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">
                        <div className="flex items-center">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          <span>Imagem</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="video">
                        <div className="flex items-center">
                          <FileVideo className="h-4 w-4 mr-2" />
                          <span>Vídeo</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mediaUrl">URL da {mediaType === 'image' ? 'Imagem' : 'Vídeo'}</Label>
                  <Input
                    id="mediaUrl"
                    type="url"
                    placeholder={`https://exemplo.com/${mediaType === 'image' ? 'imagem.jpg' : 'video.mp4'}`}
                    value={mediaUrl}
                    onChange={(e) => handleMediaUrlChange(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Media Preview */}
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
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={clearMedia}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {mediaUrl && mediaType === 'image' && (
            <div className="mt-4 relative">
              <img
                src={mediaUrl}
                alt="URL Preview"
                className="w-full h-auto rounded-lg object-cover max-h-[300px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  toast({
                    title: "Erro na imagem",
                    description: "Não foi possível carregar a imagem. Verifique a URL.",
                    variant: "destructive",
                  });
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={clearMedia}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {mediaUrl && mediaType === 'video' && (
            <div className="mt-4 relative">
              <video
                src={mediaUrl}
                controls
                className="w-full h-auto rounded-lg max-h-[300px]"
                onError={() => {
                  toast({
                    title: "Erro no vídeo",
                    description: "Não foi possível carregar o vídeo. Verifique a URL.",
                    variant: "destructive",
                  });
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={clearMedia}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2 px-0 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleCancel}
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
