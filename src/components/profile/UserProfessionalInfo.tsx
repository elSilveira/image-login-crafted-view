
"use client"; 

import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchProfessionalDetails, updateProfessionalProfile, createProfessionalProfile } from "@/lib/api"; // Import API functions
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
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Define a basic schema - EXPAND THIS BASED ON ALL SUB-COMPONENT FIELDS
const professionalProfileSchema = z.object({
  // Placeholder: Add fields from subcomponents like ProfessionalInfo, Experience, etc.
  // Example:
  bio: z.string().optional(),
  hourly_rate: z.number().nonnegative().optional(),
  // Add fields from ExperienceSection, EducationSection, etc.
  // cover_image_url: z.string().url().optional().or(z.literal("")),
  // avatar_url: z.string().url().optional().or(z.literal("")),
});

type ProfessionalProfileFormData = z.infer<typeof professionalProfileSchema>;

interface UserProfessionalInfoProps {
  professionalId?: string; // Make ID optional
}

export const UserProfessionalInfo: React.FC<UserProfessionalInfoProps> = ({ professionalId }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, updateAuthState, accessToken } = useAuth(); // Get updateAuthState if needed after creation
  const isEditing = !!professionalId;

  // Fetch professional profile data ONLY if editing
  const { data: professionalData, isLoading, isError, error } = useQuery<any, Error>({
    queryKey: ["professionalProfile", professionalId],
    queryFn: () => fetchProfessionalDetails(professionalId!),
    enabled: isEditing, // Only run query if professionalId exists
  });

  // Setup react-hook-form
  const methods = useForm<ProfessionalProfileFormData>({
    // resolver: zodResolver(professionalProfileSchema), // Enable when schema is complete
    defaultValues: {},
  });

  // Update form default values when data loads (for editing)
  useEffect(() => {
    if (isEditing && professionalData) {
      methods.reset({
        // Map fields from professionalData to form fields
        bio: professionalData.bio || "",
        hourly_rate: professionalData.hourly_rate,
        // ... map other fields
      });
    }
  }, [isEditing, professionalData, methods.reset]);

  // Mutation for creating or updating professional profile
  const mutation = useMutation({
    mutationFn: (data: ProfessionalProfileFormData) => {
      if (isEditing) {
        return updateProfessionalProfile(professionalId!, data);
      } else {
        // Add userId if required by the backend for creation
        // const dataWithUserId = { ...data, userId: user?.id };
        return createProfessionalProfile(data);
      }
    },
    onSuccess: (data) => {
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ["professionalProfile", professionalId] });
        toast.success(data.message || "Perfil profissional atualizado com sucesso!");
      } else {
        // Handle success after creation
        toast.success(data.message || "Perfil profissional criado com sucesso!");
        // Option 1: Invalidate user query to refetch status (if /users/me returns professionalId)
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }); // Assuming "userProfile" is the key for fetchUserProfile
        // Option 2: Manually update auth state if API returns updated user/token
        // if (data.user && data.accessToken) { 
        //   updateAuthState(data.user, data.accessToken);
        // }
        // Option 3: Redirect to profile view or dashboard
        // navigate(`/professionals/${data.id}`); // Assuming API returns the new ID
        navigate("/"); // Redirect to home for now
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || `Erro ao ${isEditing ? "atualizar" : "criar"} perfil profissional.`);
    },
  });

  const onSubmit = (formData: ProfessionalProfileFormData) => {
    // TODO: Compare formData with initial data (professionalData) to send only changed fields for PUT
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

  // TODO: Get cover/avatar from form state/fetched data
  const coverImage = isEditing ? professionalData?.cover_image_url : null;
  const avatarImage = isEditing ? professionalData?.avatar_url : null;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {/* Pass fetched data (if editing) and form methods to subcomponents */}
        <ProfileImages
          coverImage={coverImage} 
          avatarImage={avatarImage} 
          onCoverImageChange={(url) => methods.setValue("cover_image_url" as any, url)} 
          onAvatarImageChange={(url) => methods.setValue("avatar_url" as any, url)} 
        />
        {/* Pass professionalData only if editing, otherwise pass null/undefined */}
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
          <Button type="submit" disabled={mutation.isPending || (!isEditing && !methods.formState.isDirty) || (isEditing && !methods.formState.isDirty)}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditing ? "Salvar Alterações" : "Criar Perfil"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

