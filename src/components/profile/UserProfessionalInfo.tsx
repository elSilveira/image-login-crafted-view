
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

// --- Schemas for Array Items ---
const experienceSchema = z.object({
  title: z.string().min(1, "Cargo é obrigatório"),
  company: z.string().min(1, "Empresa é obrigatória"),
  startDate: z.string().min(1, "Data de início é obrigatória"), // Consider z.date() if using date picker
  endDate: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

const educationSchema = z.object({
  institution: z.string().min(1, "Instituição é obrigatória"),
  degree: z.string().min(1, "Grau é obrigatório"),
  fieldOfStudy: z.string().min(1, "Área de estudo é obrigatória"),
  startDate: z.string().min(1, "Data de início é obrigatória"), // Consider z.date()
  endDate: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

const professionalServiceSchema = z.object({
  serviceId: z.string().min(1, "Selecione um serviço"),
  price: z.number().positive("Preço deve ser positivo").optional(),
});

const availabilitySlotSchema = z.object({
  dayOfWeek: z.string().min(1, "Dia da semana inválido"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora de início inválida"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora de fim inválida"),
});

const portfolioItemSchema = z.object({
  imageUrl: z.string().url({ message: "URL da imagem inválida." }).min(1, "URL da imagem é obrigatória"),
  description: z.string().optional().or(z.literal("")),
});

// --- Main Professional Profile Schema --- 
const professionalProfileSchema = z.object({
  // Fields from ProfessionalInfo
  name: z.string().min(1, { message: "O nome é obrigatório." }), 
  role: z.string().min(1, { message: "O cargo é obrigatório." }), 
  image: z.string().url({ message: "URL da foto de perfil inválida." }).optional().or(z.literal("")), // Avatar mapped to image
  bio: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")), 
  // Cover image is handled separately in ProfileImages, not part of main professional model
  cover_image_url: z.string().url({ message: "URL da imagem de capa inválida." }).optional().or(z.literal("")), // Kept for ProfileImages component state

  // Arrays from Subcomponents
  experiences: z.array(experienceSchema).optional().default([]),
  educations: z.array(educationSchema).optional().default([]),
  services: z.array(professionalServiceSchema).optional().default([]),
  availability: z.array(availabilitySlotSchema).optional().default([]),
  portfolio: z.array(portfolioItemSchema).optional().default([]),
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
      name: user?.name || "", 
      role: "Profissional", 
      image: "",
      bio: "",
      phone: user?.phone || "", 
      cover_image_url: "", // Initialize cover image URL
      experiences: [],
      educations: [],
      services: [],
      availability: [],
      portfolio: [],
    },
  });

  // Update form default values when data loads (for editing)
  useEffect(() => {
    if (isEditing && professionalData) {
      methods.reset({
        name: professionalData.name || user?.name || "",
        role: professionalData.role || "Profissional",
        image: professionalData.image || "", 
        bio: professionalData.bio || "",
        phone: professionalData.phone || user?.phone || "", 
        cover_image_url: professionalData.cover_image_url || "", // Assuming cover is fetched
        // Map arrays - ensure backend sends these arrays with the professional details
        experiences: professionalData.experiences || [],
        educations: professionalData.educations || [],
        services: professionalData.services || [], // Ensure backend sends serviceId and price
        availability: professionalData.availability || [],
        portfolio: professionalData.portfolio || [], // Ensure backend sends imageUrl and description
      });
    }
  }, [isEditing, professionalData, user, methods.reset]);

  // Mutation for creating or updating professional profile
  const mutation = useMutation({
    mutationFn: (data: ProfessionalProfileFormData) => {
      // Prepare payload, removing cover_image_url as it's not part of the main model
      // Ensure empty strings for optional URL fields are sent as null or omitted
      const { cover_image_url, ...payload } = data; 
      if (payload.image === "") payload.image = undefined;
      if (payload.bio === "") payload.bio = undefined;
      if (payload.phone === "") payload.phone = undefined;
      
      // Clean up empty optional fields in arrays if necessary (e.g., empty descriptions)
      payload.experiences = payload.experiences?.map(exp => ({ ...exp, description: exp.description || undefined, endDate: exp.endDate || undefined }));
      payload.educations = payload.educations?.map(edu => ({ ...edu, description: edu.description || undefined, endDate: edu.endDate || undefined }));
      payload.portfolio = payload.portfolio?.map(item => ({ ...item, description: item.description || undefined }));
      payload.services = payload.services?.map(srv => ({ ...srv, price: srv.price || undefined }));

      console.log("Prepared Payload:", payload); // Log the final payload

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
        // Consider redirecting to the edit page after creation
        // navigate(`/settings/professional`); // Or similar
      }
    },
    onError: (error: any) => {
      console.error("Error submitting professional profile:", error.response?.data || error.message);
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach((err: any) => {
          // Handle array errors (e.g., "experiences[0].title")
          const fieldName = err.path as keyof ProfessionalProfileFormData;
          if (fieldName) {
             methods.setError(fieldName, { type: "manual", message: err.msg });
          }
        });
        toast.error("Erro de validação. Verifique os campos marcados.");
      } else {
        toast.error(error.response?.data?.message || `Erro ao ${isEditing ? "atualizar" : "criar"} perfil profissional.`);
      }
    },
  });

  const onSubmit = (formData: ProfessionalProfileFormData) => {
    console.log("Raw Form Data:", formData); // Log raw form data
    mutation.mutate(formData);
  };

  if (isEditing && isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
        {/* ProfileImages uses cover_image_url and image from context */}
        <ProfileImages /> 
        
        {/* Subcomponents use useFormContext to register fields */}
        <ProfessionalInfo />
        <ExperienceSection />
        <EducationSection />
        <ServicesSection />
        <AvailabilitySection />
        <PortfolioSection />

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

