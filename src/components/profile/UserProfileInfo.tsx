import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchUserProfile, updateUserProfile } from "@/lib/api"; // Import API functions
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Loader2, AlertCircle } from "lucide-react"; // Import AlertCircle
import { toast } from "sonner"; // Assuming sonner is used for notifications
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components

// Define the schema for form validation using Zod
const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  // phone: z.string().optional(), // Add phone validation if needed
  avatar: z.string().url("URL do avatar inválida").optional().or(z.literal("")), // Allow empty string or valid URL
  // Add password validation if allowing password change here
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const UserProfileInfo = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile data
  const { data: user, isLoading, isError, error } = useQuery<any, Error>({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    // staleTime: 5 * 60 * 1000, // Optional: Cache data for 5 minutes
  });

  // Setup react-hook-form
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      avatar: "",
    },
  });

  // Update form default values when user data loads or changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "", // Ensure correct field name from API
      });
      setIsEditing(false); // Reset editing state when data reloads
    }
  }, [user, reset]);

  // Mutation for updating user profile
  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] }); // Invalidate cache to refetch
      toast.success(data.message || "Perfil atualizado com sucesso!");
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar perfil.");
    },
  });

  const onSubmit = (formData: ProfileFormData) => {
    // Only send changed data
    const changedData: Partial<ProfileFormData> = {};
    if (formData.name !== user?.name) changedData.name = formData.name;
    if (formData.email !== user?.email) changedData.email = formData.email;
    if (formData.avatar !== user?.avatar) changedData.avatar = formData.avatar;
    // Add other fields like phone, password if they are part of the form

    if (Object.keys(changedData).length > 0) {
      mutation.mutate(changedData);
    } else {
      setIsEditing(false); // No changes, just exit editing mode
    }
  };

  const handleCancel = () => {
    // Reset form to original values from the query data
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    }
    setIsEditing(false);
  };

  // --- Loading State --- 
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // --- Error State --- 
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Não foi possível carregar as informações do perfil. Tente novamente mais tarde.
              {error?.message && <p className="text-xs mt-2">Detalhes: {error.message}</p>}
            </AlertDescription>
            {/* Optional: Add a retry button */}
            {/* <Button variant="destructive" size="sm" onClick={() => queryClient.refetchQueries({ queryKey: ['userProfile'] })} className="mt-4">Tentar Novamente</Button> */}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Basic fallback for avatar
  const getAvatarFallback = (name?: string) => {
    return name ? name.split(" ").map(n => n[0]).join("").toUpperCase() : "U";
  };

  // Get current form values for previewing avatar while editing
  const currentFormValues = methods.watch();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {/* Use avatar from form state if editing, otherwise from query data */}
                <AvatarImage src={isEditing ? currentFormValues.avatar : user?.avatar} alt={user?.name} />
                <AvatarFallback>{getAvatarFallback(user?.name)}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="absolute bottom-0 right-0 rounded-full" 
                  type="button" 
                  onClick={() => {/* TODO: Implement avatar upload/selection logic */}}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-medium">{user?.name || "Usuário"}</h3>
              {/* Display join date if available */}
              {/* <p className="text-sm text-muted-foreground">Cliente desde Janeiro 2024</p> */}
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="sm:ml-auto">
                <Edit className="mr-2 h-4 w-4" /> Editar Perfil
              </Button>
            )}
          </div>

          <div className="grid gap-4 py-4">
            {/* Avatar URL Input (only visible when editing) */}
            {isEditing && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="avatar" className="text-right">
                  URL Avatar
                </Label>
                <div className="col-span-3">
                  <Input id="avatar" {...register("avatar")} disabled={mutation.isPending} />
                  {errors.avatar && <p className="text-sm text-destructive mt-1">{errors.avatar.message}</p>}
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <div className="col-span-3">
                <Input id="name" {...register("name")} disabled={!isEditing || mutation.isPending} />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="col-span-3">
                <Input id="email" type="email" {...register("email")} disabled={!isEditing || mutation.isPending} />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>
            </div>
            {/* Add Phone field if needed */}
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefone
              </Label>
              <div className="col-span-3">
                <Input id="phone" type="tel" {...register("phone")} disabled={!isEditing || mutation.isPending} />
              </div>
            </div> */}
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={handleCancel} disabled={mutation.isPending}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-iazi-primary hover:bg-iazi-primary-hover" disabled={mutation.isPending || !isDirty}>
                {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Salvar Alterações
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

