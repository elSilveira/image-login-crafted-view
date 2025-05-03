
"use client"; 

import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchProfessionalDetails, updateProfessionalProfile, createProfessionalProfile } from "@/lib/api"; 
import { Button } from "@/components/ui/button";
import { ProfileImages } from "./professional/ProfileImages"; // Refactored component
import { ProfessionalInfo } from "./professional/ProfessionalInfo";
import { ExperienceSection } from "./professional/ExperienceSection";
import { EducationSection } from "./professional/EducationSection";
import { ServicesSection } from "./professional/ServicesSection";
import { AvailabilitySection } from "./professional/AvailabilitySection";
import { PortfolioSection } from "./professional/PortfolioSection";
import { Loader2, AlertCircle } from "lucide-react"; 
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
import { useNavigate } from "react-router-dom"; 

// Define schema including image URLs - EXPAND WITH OTHER FIELDS
const professionalProfileSchema = z.object({
  bio: z.string().optional(),
  hourly_rate: z.number().nonnegative().optional(),
  cover_image_url: z.string().url({ message: "URL da imagem de capa inválida." }).optional().or(z.literal("")), // Added
  avatar_url: z.string().url({ message: "URL da foto de perfil inválida." }).optional().or(z.literal("")),      // Added
  // Add fields from ExperienceSection, EducationSection, etc.
});

type ProfessionalProfileFormData = z.infer<typeof professionalProfileSchema>;

interface UserProfessionalInfoProps {
  professionalId?: string; 
}

export const UserProfessionalInfo: React.FC<UserProfessionalInfoProps> = ({ professionalId }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const isEditing = !!professionalId;

  // Fetch professional profile data ONLY if editing
  const { data: professionalData, isLoading, isError, error } = useQuery<any, Error>({
    queryKey: ["professionalProfile", professionalId],
    queryFn: () => fetchProfessionalDetails(professionalId!),
    enabled: isEditing, 
  });

  // Setup react-hook-form
  const methods = useForm<ProfessionalProfileFormData>({
    resolver: zodResolver(professionalProfileSchema), // Enable resolver with updated schema
    defaultValues: {
      bio: "",
      hourly_rate: undefined,
      cover_image_url: "",
      avatar_url: "",
      // Initialize other fields
    },
  });

  // Update form default values when data loads (for editing)
  useEffect(() => {
    if (isEditing && professionalData) {
      methods.reset({
        bio: professionalData.bio || "",
        hourly_rate: professionalData.hourly_rate,
        cover_image_url: professionalData.cover_image_url || "", // Reset cover image URL
        avatar_url: professionalData.avatar_url || "",          // Reset avatar URL
        // ... map other fields
      });
    }
  }, [isEditing, professionalData, methods.reset]);

  // Mutation for creating or updating professional profile
  const mutation = useMutation({
    mutationFn: (data: ProfessionalProfileFormData) => {
      // Ensure empty strings are sent as null or omitted if backend expects that
      const payload = { ...data };
      if (payload.cover_image_url === "") payload.cover_image_url = undefined;
      if (payload.avatar_url === "") payload.avatar_url = undefined;
      
      if (isEditing) {
        return updateProfessionalProfile(professionalId!, payload);
      } else {
        return createProfessionalProfile(payload);
      }
    },
    onSuccess: (data) => {
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ["professionalProfile", professionalId] });
        toast.success(data.message || "Perfil profissional atualizado com sucesso!");
      } else {
        toast.success(data.message || "Perfil profissional criado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }); 
        navigate("/"); 
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || `Erro ao ${isEditing ? "atualizar" : "criar"} perfil profissional.`);
    },
  });

  const onSubmit = (formData: ProfessionalProfileFormData) => {
    mutation.mutate(formData);
  };

  // --- Loading State (only applies when editing) --- 
  if (isEditing && isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // --- Error State (only applies when editing) --- 
  if (isEditing && isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          Não foi possível carregar o perfil profissional para edição. Tente novamente mais tarde.
          {error?.message && <p className="text-xs mt-2">Detalhes: {error.message}</p>}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {/* ProfileImages now uses useFormContext, no props needed */}
        <ProfileImages /> 
        
        {/* Pass professionalData only if editing, otherwise pass null/undefined */}
        {/* Ensure subcomponents are adapted for react-hook-form */}
        <ProfessionalInfo professionalData={isEditing ? professionalData : null} />
        <ExperienceSection professionalData={isEditing ? professionalData : null} />
        <EducationSection professionalData={isEditing ? professionalData : null} />
        <ServicesSection professionalData={isEditing ? professionalData : null} />
        <AvailabilitySection professionalData={isEditing ? professionalData : null} />
        <PortfolioSection professionalData={isEditing ? professionalData : null} />

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => methods.reset()} disabled={mutation.isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={mutation.isPending || !methods.formState.isDirty}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditing ? "Salvar Alterações" : "Criar Perfil"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

