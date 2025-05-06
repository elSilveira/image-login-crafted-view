// src/components/company/admin/CompanyProfileForm.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Loader2 } from "lucide-react";
// Removed: import { mockCompany } from "@/lib/mock-company";
import { BasicInfoFormSection } from "./profile/BasicInfoFormSection";
import { DescriptionFormSection } from "./profile/DescriptionFormSection";
import { AddressFormSection } from "./profile/AddressFormSection";
import { useToast } from "@/components/ui/use-toast"; // Import useToast

// Define the structure for the form values
type CompanyProfileFormValues = {
  name: string;
  description: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  complement?: string | null; // Make optional
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
};

// Define the structure expected from the API for company data
interface ApiCompanyData {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  } | null; // Address can be null
  // Add other fields if needed
}

interface CompanyProfileFormProps {
    companyId: string; // Assume companyId is passed as a prop
}

export function CompanyProfileForm({ companyId }: CompanyProfileFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<CompanyProfileFormValues | null>(null);

  const form = useForm<CompanyProfileFormValues>({
    // Default values will be set by reset after data fetch
  });

  // Fetch initial company data
  useEffect(() => {
    if (!companyId) {
        setError("ID da empresa não fornecido.");
        setIsLoading(false);
        return;
    }

    const fetchCompanyData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Adjust API endpoint as needed
        const response = await fetch(`/api/companies/${companyId}?include=address`);
        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}: Falha ao buscar dados da empresa`);
        }
        const data: ApiCompanyData = await response.json();

        if (!data) {
            throw new Error("Dados da empresa não encontrados ou inválidos.");
        }

        // Prepare data for the form
        const formData: CompanyProfileFormValues = {
            name: data.name ?? "",
            description: data.description ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            street: data.address?.street ?? "",
            number: data.address?.number ?? "",
            complement: data.address?.complement,
            neighborhood: data.address?.neighborhood ?? "",
            city: data.address?.city ?? "",
            state: data.address?.state ?? "",
            zipCode: data.address?.zipCode ?? "",
        };
        setInitialData(formData);
        form.reset(formData); // Set form values after fetching

      } catch (err: any) {
        console.error("Erro ao buscar dados da empresa:", err);
        setError(err.message || "Erro ao carregar dados da empresa.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId, form]); // Include form in dependencies for reset

  const onSubmit = async (data: CompanyProfileFormValues) => {
    setIsSubmitting(true);
    setError(null);
    console.log("Form submitted:", data);

    try {
        // TODO: Adjust API endpoint and method (PUT or PATCH)
        const response = await fetch(`/api/companies/${companyId}`, {
            method: "PUT", // or PATCH
            headers: {
                "Content-Type": "application/json",
                // Add auth headers if needed
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Try to parse error message from backend
            let errorMsg = `Erro HTTP ${response.status}: Falha ao salvar alterações`;
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorMsg;
            } catch (parseError) { /* Ignore if response is not JSON */ }
            throw new Error(errorMsg);
        }

        // Handle success
        const updatedData = await response.json();
        toast({ title: "Sucesso!", description: "Perfil da empresa atualizado." });
        form.reset(data); // Reset form with the submitted data to prevent dirty state

    } catch (err: any) {
        console.error("Erro ao salvar perfil:", err);
        setError(err.message || "Ocorreu um erro inesperado ao salvar.");
        toast({ variant: "destructive", title: "Erro ao Salvar", description: err.message || "Ocorreu um erro inesperado." });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeletons for form sections */}
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-60 w-full" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  if (error && !initialData) {
    // Show error only if initial data failed to load
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Erro ao Carregar Dados</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Display submission error */} 
        {error && isSubmitting && (
             <Alert variant="destructive" className="mt-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Erro ao Salvar</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <BasicInfoFormSection control={form.control} />
        <DescriptionFormSection control={form.control} />
        <AddressFormSection control={form.control} />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

