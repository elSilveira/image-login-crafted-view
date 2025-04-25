
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon } from "lucide-react";

interface ProfileImagesProps {
  coverImage: string | null;
  avatarImage: string | null;
  onCoverImageChange: (image: string) => void;
  onAvatarImageChange: (image: string) => void;
}

export const ProfileImages = ({ 
  coverImage, 
  avatarImage, 
  onCoverImageChange, 
  onAvatarImageChange 
}: ProfileImagesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagens do Perfil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label>Imagem de Capa</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="h-40 w-full bg-muted rounded-lg overflow-hidden relative">
                {coverImage ? (
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <Button variant="outline">
                Alterar Capa
              </Button>
            </div>
          </div>
          
          <div>
            <Label>Foto de Perfil</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="h-24 w-24 bg-muted rounded-full overflow-hidden relative">
                {avatarImage ? (
                  <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <Button variant="outline">
                Alterar Foto
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
