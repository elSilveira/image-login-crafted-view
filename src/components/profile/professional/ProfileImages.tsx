
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Import Input
import { Image as ImageIcon } from "lucide-react";
import { useFormContext } from "react-hook-form"; // Import useFormContext

// Assuming the form data structure includes these fields
interface ProfileImagesFormData {
  cover_image_url?: string;
  avatar_url?: string;
}

export const ProfileImages = () => {
  // Get methods from FormProvider
  const { register, watch } = useFormContext<ProfileImagesFormData>();

  // Watch the URL fields to update the preview
  const coverImageUrl = watch("cover_image_url");
  const avatarUrl = watch("avatar_url");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagens do Perfil (URLs)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cover Image Section */}
        <div className="space-y-2">
          <Label htmlFor="cover_image_url">URL da Imagem de Capa</Label>
          <Input 
            id="cover_image_url"
            type="url" 
            placeholder="https://exemplo.com/capa.jpg"
            {...register("cover_image_url")} // Register the input with react-hook-form
          />
          <div className="mt-2 h-40 w-full bg-muted rounded-lg overflow-hidden relative border">
            {coverImageUrl ? (
              <img 
                src={coverImageUrl} 
                alt="Prévia da Capa" 
                className="w-full h-full object-cover" 
                onError={(e) => { e.currentTarget.style.display = 'none'; /* Hide on error */ }} 
                onLoad={(e) => { e.currentTarget.style.display = 'block'; }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
        
        {/* Avatar Image Section */}
        <div className="space-y-2">
          <Label htmlFor="avatar_url">URL da Foto de Perfil</Label>
          <Input 
            id="avatar_url"
            type="url" 
            placeholder="https://exemplo.com/avatar.png"
            {...register("avatar_url")} // Register the input with react-hook-form
          />
          <div className="mt-2 flex justify-center">
            <div className="h-24 w-24 bg-muted rounded-full overflow-hidden relative border">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Prévia do Avatar" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  onLoad={(e) => { e.currentTarget.style.display = 'block'; }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

