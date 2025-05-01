"use client"; // Add this directive for client-side hooks

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form"; // Import FormProvider
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchProfessionalDetails, updateProfessionalProfile } from "@/lib/api"; // Import API functions
import { Button } from "@/components/ui/button";
import { ProfileImages } from "./professional/ProfileImages";
import { ProfessionalInfo } from "./professional/ProfessionalInfo";
import { ExperienceSection } from "./professional/ExperienceSection";
import { EducationSection } from "./professional/EducationSection";
import { ServicesSection } from "./professional/ServicesSection";
import { AvailabilitySection } from "./professional/AvailabilitySection";
import { PortfolioSection } from "./professional/PortfolioSection";
import { Loader2, AlertCircle } from "lucide-react"; // Import AlertCircle
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext"; // Assuming auth context provides professional ID
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components

// Define a basic schema - this should be expanded based on all sub-component fields
const professionalProfileSchema = z.object({
  // Placeholder: Add fields from subcomponents like ProfessionalInfo, Experience, etc.
  // Example:
  // bio: z.string().optional(),
  // hourly_rate: z.number().optional(),
  // Add fields from ExperienceSection, EducationSection, etc.
  // cover_image_url: z.string().url().optional().or(z.literal("")),
  // avatar_url: z.string().url().optional().or(z.literal("")),
});

type ProfessionalProfileFormData = z.infer<typeof professionalProfileSchema>;

export const UserProfessionalInfo = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Assuming useAuth provides user info including professionalId
  const professionalId = user?.professionalId; // Placeholder: Adjust based on actual auth context structure

  // Fetch professional profile data
  const { data: professionalData, isLoading, isError, error } = useQuery<any, Error>({
    queryKey: ["professionalProfile", professionalId],
    queryFn: () => fetchProfessionalDetails(professionalId!),
    enabled: !!professionalId, // Only run query if professionalId exists
    // staleTime: 5 * 60 * 1000, // Optional cache time
  });

  // Setup react-hook-form
  const methods = useForm<ProfessionalProfileFormData>({
    // resolver: zodResolver(professionalProfileSchema), // Enable when schema is complete
    defaultValues: {},
  });

  // Update form default values when data loads
  useEffect(() => {
    if (professionalData) {
      // Reset form with fetched data - map fields accordingly
      methods.reset({
        // Map fields from professionalData to form fields
        // Example:
        // bio: professionalData.bio || "",
        // hourly_rate: professionalData.hourly_rate,
        // cover_image_url: professionalData.cover_image_url || "",
        // avatar_url: professionalData.avatar_url || "",
        // ... map other fields
      });
    }
  }, [professionalData, methods.reset]);

  // Mutation for updating professional profile
  const mutation = useMutation({
    mutationFn: (data: ProfessionalProfileFormData) => updateProfessionalProfile(professionalId!, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["professionalProfile", professionalId] });
      toast.success(data.message || "Perfil profissional atualizado com sucesso!");
      // Potentially reset form or exit editing mode if applicable
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar perfil profissional.");
    },
  });

  const onSubmit = (formData: ProfessionalProfileFormData) => {
    // TODO: Compare formData with initial data (professionalData) to send only changed fields
    // For now, sending all data
    mutation.mutate(formData);
  };

  // --- No Professional ID State --- 
  if (!professionalId) {
    return (
      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Acesso Negado</AlertTitle>
        <AlertDescription>
          ID do profissional não encontrado. Faça login como profissional para acessar esta página.
        </AlertDescription>
      </Alert>
    );
  }

  // --- Loading State --- 
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // --- Error State --- 
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          Não foi possível carregar o perfil profissional. Tente novamente mais tarde.
          {error?.message && <p className="text-xs mt-2">Detalhes: {error.message}</p>}
        </AlertDescription>
        {/* Optional: Add a retry button */}
        {/* <Button variant="destructive" size="sm" onClick={() => queryClient.refetchQueries({ queryKey: ["professionalProfile", professionalId] })} className="mt-4">Tentar Novamente</Button> */}
      </Alert>
    );
  }

  // TODO: Get cover/avatar from form state/fetched data
  const coverImage = professionalData?.cover_image_url || null;
  const avatarImage = professionalData?.avatar_url || null;

  return (
    // Wrap components with FormProvider to pass form methods down
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {/* Pass fetched data and form methods to subcomponents as needed */}
        <ProfileImages
          coverImage={coverImage} // TODO: Potentially manage via form state
          avatarImage={avatarImage} // TODO: Potentially manage via form state
          onCoverImageChange={(url) => methods.setValue("cover_image_url" as any, url)} // Example: Update form state
          onAvatarImageChange={(url) => methods.setValue("avatar_url" as any, url)} // Example: Update form state
        />
        <ProfessionalInfo professionalData={professionalData} />
        <ExperienceSection professionalData={professionalData} />
        <EducationSection professionalData={professionalData} />
        <ServicesSection professionalData={professionalData} />
        <AvailabilitySection professionalData={professionalData} />
        <PortfolioSection professionalData={professionalData} />

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => methods.reset()} disabled={mutation.isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={mutation.isPending || !methods.formState.isDirty}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Salvar Alterações
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

