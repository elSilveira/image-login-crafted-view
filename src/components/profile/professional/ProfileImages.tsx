import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Import Input
import { Image as ImageIcon } from "lucide-react";
import { useFormContext } from "react-hook-form"; // Import useFormContext

// Assuming the form data structure includes these fields
interface ProfileImagesFormData {
  avatar?: string;
  cover_image?: string;
}

// Helper: map backend avatar field to form field
export function mapProfileImagesFromBackend(data: any) {
  return {
    avatar: data.avatar || data.image || data.avatarUrl || "",
    cover_image: data.coverImage || data.cover_image || "",
  };
}

// Helper: map form field to backend field
export function mapProfileImagesToBackend(form: { avatar?: string; cover_image?: string }) {
  return {
    image: form.avatar || undefined, // O backend espera 'image'
    coverImage: form.cover_image || undefined,
  };
}

export const ProfileImages = () => {
  // Get methods from FormProvider
  const { register, watch } = useFormContext<ProfileImagesFormData>();

  // Watch the URL fields to update the previews
  const avatar = watch("avatar");
  const coverImage = watch("cover_image");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagens do Perfil (URLs)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cover Image Section */}
        <div className="space-y-2">
          <Label htmlFor="cover_image">URL da Imagem de Capa</Label>
          <Input 
            id="cover_image"
            type="url" 
            placeholder="https://exemplo.com/capa.jpg"
            {...register("cover_image")}
          />
          <div className="mt-2 h-40 w-full bg-muted rounded-lg overflow-hidden relative border">
            {coverImage ? (
              <img 
                src={coverImage} 
                alt="Prévia da Capa" 
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
        </div>
        {/* Avatar Image Section */}
        <div className="space-y-2">
          <Label htmlFor="avatar">URL da Foto de Perfil</Label>
          <Input 
            id="avatar"
            type="url" 
            placeholder="https://exemplo.com/avatar.png"
            {...register("avatar")}
          />
          <div className="mt-2 flex justify-center">
            <div className="h-24 w-24 bg-muted rounded-full overflow-hidden relative border">
              {avatar ? (
                <img 
                  src={avatar} 
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

