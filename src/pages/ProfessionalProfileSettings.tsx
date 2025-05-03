
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { UserProfessionalInfo } from "@/components/profile/UserProfessionalInfo";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import apiClient from "@/lib/api"; // Import configured Axios client
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { toast } from "@/components/ui/use-toast"; // Use toast from ui
import { useNavigate } from "react-router-dom"; // For potential redirects

// Function to fetch user profile and check professional status
async function fetchUserProfileAndCheckProfessionalStatus(token: string): Promise<{ isProfessional: boolean | null, professionalId?: string }> {
  try {
    const response = await apiClient.get("/users/me", { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = response.data;
    // *** Adjust based on your actual User model structure ***
    const isProf = !!userData.professionalProfileId; 
    const profId = userData.professionalProfileId; 
    // *** End of adjustment section ***
    console.log(`User professional status fetched: ${isProf}, ID: ${profId}`);
    return { isProfessional: isProf, professionalId: profId };
  } catch (error: any) {
    console.error("Error fetching user profile/status:", error);
    toast({
      title: "Erro",
      description: "Não foi possível verificar o status do perfil profissional.",
      variant: "destructive",
    });
    return { isProfessional: null }; // Return null on error
  }
}

const ProfessionalProfileSettings = () => {
  const { user, accessToken, isLoading: authLoading } = useAuth();
  const [isProfessional, setIsProfessional] = useState<boolean | null>(null);
  const [professionalId, setProfessionalId] = useState<string | undefined>(undefined);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    const checkStatus = async () => {
      if (user && accessToken) {
        setIsLoadingStatus(true);
        const statusResult = await fetchUserProfileAndCheckProfessionalStatus(accessToken);
        setIsProfessional(statusResult.isProfessional);
        setProfessionalId(statusResult.professionalId);
        setIsLoadingStatus(false);
      } else {
        console.log("User not logged in, redirecting...");
        toast({ title: "Acesso Negado", description: "Faça login para acessar esta página.", variant: "destructive" });
        navigate("/login"); 
        setIsLoadingStatus(false); 
      }
    };
    checkStatus();
  }, [user, accessToken, authLoading, navigate]);

  const isLoading = authLoading || isLoadingStatus;

  // --- Loading State --- 
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-1/3 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // --- Editing Existing Profile --- 
  if (isProfessional === true && professionalId) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Editar Perfil Profissional</h1>
          {/* Pass professionalId for editing */}
          <UserProfessionalInfo professionalId={professionalId} /> 
        </div>
      </div>
    );
  }

  // --- Creating New Profile --- 
  if (isProfessional === false) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Cadastro de Perfil Profissional</h1>
          {/* Pass null or undefined professionalId for creation */}
          <UserProfessionalInfo professionalId={undefined} /> 
        </div>
      </div>
    );
  }

  // --- Fallback/Error State --- 
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Perfil Profissional</h1>
        <p>Não foi possível verificar seu status profissional. Tente novamente mais tarde.</p>
      </div>
    </div>
  );
};

export default ProfessionalProfileSettings;

