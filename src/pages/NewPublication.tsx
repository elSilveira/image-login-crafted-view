import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, getEffectiveUserRole } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchProfessionalDetails, fetchServices } from "@/lib/api";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Image as ImageIcon, Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

const NewPublication = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canPublish, setCanPublish] = useState(false);

  // Nova lógica de permissão baseada em role
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const role = getEffectiveUserRole(user);
    // Leveling:
    // - Professional: pode publicar se for professional, company ou admin
    // - Company: pode publicar se for company ou admin
    // - Admin: só admin
    if (role === 'admin') {
      setCanPublish(true);
    } else if (role === 'company') {
      setCanPublish(true);
    } else if (role === 'professional') {
      setCanPublish(true);
    } else {
      setCanPublish(false);
    }
  }, [user, navigate]);

  // Mensagem de permissão detalhada
  const getPermissionMessage = () => {
    const role = getEffectiveUserRole(user);
    if (role === 'admin') {
      return 'Apenas administradores podem criar publicações.';
    } else if (role === 'company') {
      return 'Apenas empresas e administradores podem criar publicações.';
    } else if (role === 'professional') {
      return 'Apenas profissionais, empresas e administradores podem criar publicações.';
    }
    return 'Você não tem permissão para criar publicações.';
  };

  // Fetch professional details to get their services
  const { data: professionalData, isLoading: isLoadingProfessional } = useQuery({
    queryKey: ["professional", user?.id],
    queryFn: () => user?.isProfessional ? fetchProfessionalDetails(user?.id || "") : undefined,
    enabled: !!user?.isProfessional && !!user?.id,
  });

  // Fetch services for the dropdown
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: () => fetchServices(),
    enabled: canPublish,
  });

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
    
    if (!canPublish) {
      toast({
        title: "Não autorizado",
        description: "Apenas profissionais ou empresas podem criar publicações.",
        variant: "destructive",
      });
      return;
    }
    
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
      
      // Here you would call your API to create the publication
      // For now, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Publicação criada",
        description: "Sua publicação foi compartilhada com sucesso!",
      });
      
      navigate("/");
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

  // Redirect if user is not authorized
  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-20 pb-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Nova Publicação</CardTitle>
          </CardHeader>
          
          {!canPublish ? (
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Não autorizado</AlertTitle>
                <AlertDescription>
                  {getPermissionMessage()}
                </AlertDescription>
              </Alert>
            </CardContent>
          ) : (
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
                      {isLoadingServices ? (
                        <SelectItem value="loading" disabled>Carregando serviços...</SelectItem>
                      ) : services && services.length > 0 ? (
                        services.map((service: any) => (
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
          )}
        </Card>
      </main>
    </div>
  );
};

export default NewPublication;
