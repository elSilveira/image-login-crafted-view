
"use client"; 

import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchProfessionalDetails, updateProfessionalProfile, createProfessionalProfile } from "@/lib/api"; 
import { Button } from "@/components/ui/button";
import { ProfileImages } from "./professional/ProfileImages"; 
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

// Define schema matching backend expectations (name, role, image, bio, phone)
const professionalProfileSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório." }), // Added name
  role: z.string().min(1, { message: "O cargo é obrigatório." }), // Added role
  image: z.string().url({ message: "URL da foto de perfil inválida." }).optional().or(z.literal("")), // Changed from avatar_url to image
  bio: z.string().optional(),
  phone: z.string().optional(), // Added phone
  // cover_image_url removed as it's not in Professional model
  // hourly_rate removed as it's not in Professional model/validator
  // Add fields from ExperienceSection, EducationSection, etc. if they are part of the main payload
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
    resolver: zodResolver(professionalProfileSchema), 
    defaultValues: {
      name: user?.name || "", // Pre-fill name from authenticated user
      role: "Profissional", // Default role
      image: "",
      bio: "",
      phone: user?.phone || "", // Pre-fill phone from authenticated user if available
    },
  });

  // Update form default values when data loads (for editing)
  useEffect(() => {
    if (isEditing && professionalData) {
      methods.reset({
        name: professionalData.name || user?.name || "",
        role: professionalData.role || "Profissional",
        image: professionalData.image || "", // Use image field
        bio: professionalData.bio || "",
        phone: professionalData.phone || user?.phone || "", // Use phone field
        // ... map other fields like experience, education if needed
      });
    }
  }, [isEditing, professionalData, user, methods.reset]);

  // Mutation for creating or updating professional profile
  const mutation = useMutation({
    mutationFn: (data: ProfessionalProfileFormData) => {
      // Ensure empty strings for optional URL fields are sent as null or omitted
      const payload = { ...data };
      if (payload.image === "") payload.image = undefined;
      if (payload.bio === "") payload.bio = undefined;
      if (payload.phone === "") payload.phone = undefined;
      
      if (isEditing) {
        return updateProfessionalProfile(professionalId!, payload);
      } else {
        // For creation, ensure name and role are sent
        // Backend will use defaults if not provided, but good practice to send from form
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
        // Redirect or update UI after creation
        // Maybe navigate to the newly created profile settings page?
        // Or just refresh the current page state if it shows the form
        // For now, just invalidate user profile to potentially update role/status
      }
    },
    onError: (error: any) => {
      // Log the detailed error for debugging
      console.error("Error submitting professional profile:", error.response?.data || error.message);
      
      // Display specific validation errors if available
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach((err: any) => {
          if (err.path && err.msg) {
            methods.setError(err.path as keyof ProfessionalProfileFormData, { type: "manual", message: err.msg });
          }
        });
        toast.error("Erro de validação. Verifique os campos marcados.");
      } else {
        toast.error(error.response?.data?.message || `Erro ao ${isEditing ? "atualizar" : "criar"} perfil profissional.`);
      }
    },
  });

  const onSubmit = (formData: ProfessionalProfileFormData) => {
    console.log("Submitting payload:", formData); // Log payload before sending
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
        {/* ProfileImages needs to be adapted to use 'image' field from context */}
        <ProfileImages /> 
        
        {/* Pass professionalData only if editing, otherwise pass null/undefined */}
        {/* Ensure subcomponents are adapted for react-hook-form and use correct field names */}
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

