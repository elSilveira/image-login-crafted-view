
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { UserProfessionalInfo } from "@/components/profile/UserProfessionalInfo";
import { useAuth } from "@/contexts/AuthContext"; 
import apiClient from "@/lib/api"; 
import { Skeleton } from "@/components/ui/skeleton"; 
import { toast } from "@/components/ui/use-toast"; 
import { useNavigate } from "react-router-dom"; 

// Function to fetch user profile and check professional status
async function fetchUserProfileAndCheckProfessionalStatus(token: string): Promise<{ isProfessional: boolean | null, professionalId?: string, rawData?: any }> {
  console.log("[fetchUserProfile] Fetching user profile...");
  try {
    const response = await apiClient.get("/users/me", { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = response.data;
    console.log("[fetchUserProfile] Raw user data received:", userData);

    // *** Adjust based on your actual User model structure ***
    const isProf = !!userData.professionalProfileId; 
    const profId = userData.professionalProfileId; 
    // *** End of adjustment section ***

    console.log(`[fetchUserProfile] Determined status: isProfessional=${isProf}, professionalId=${profId}`);
    return { isProfessional: isProf, professionalId: profId, rawData: userData };

  } catch (error: any) {
    console.error("[fetchUserProfile] Error fetching user profile/status:", error.response?.data || error.message);
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

  console.log(`[ProfessionalProfileSettings] Rendering. AuthLoading: ${authLoading}, User: ${!!user}, AccessToken: ${!!accessToken}`);

  useEffect(() => {
    console.log(`[Effect] Running. AuthLoading: ${authLoading}`);
    if (authLoading) return;

    const checkStatus = async () => {
      console.log(`[checkStatus] Checking status. User: ${!!user}, AccessToken: ${!!accessToken}`);
      if (user && accessToken) {
        setIsLoadingStatus(true);
        console.log("[checkStatus] Calling fetchUserProfile...");
        const statusResult = await fetchUserProfileAndCheckProfessionalStatus(accessToken);
        console.log("[checkStatus] Status result received:", statusResult);
        setIsProfessional(statusResult.isProfessional);
        setProfessionalId(statusResult.professionalId);
        setIsLoadingStatus(false);
        console.log(`[checkStatus] State updated: isProfessional=${statusResult.isProfessional}, professionalId=${statusResult.professionalId}, isLoadingStatus=false`);
      } else {
        console.log("[checkStatus] User not logged in, redirecting...");
        toast({ title: "Acesso Negado", description: "Faça login para acessar esta página.", variant: "destructive" });
        navigate("/login"); 
        setIsLoadingStatus(false); 
      }
    };
    checkStatus();
  }, [user, accessToken, authLoading, navigate]);

  const isLoading = authLoading || isLoadingStatus;
  console.log(`[Render Logic] Combined isLoading: ${isLoading}, isProfessional: ${isProfessional}, professionalId: ${professionalId}`);

  // --- Loading State --- 
  if (isLoading) {
    console.log("[Render Logic] Showing Loading State");
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
    console.log("[Render Logic] Showing Editing Form");
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Editar Perfil Profissional</h1>
          <UserProfessionalInfo professionalId={professionalId} /> 
        </div>
      </div>
    );
  }

  // --- Creating New Profile --- 
  if (isProfessional === false) {
    console.log("[Render Logic] Showing Creation Form");
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Cadastro de Perfil Profissional</h1>
          <UserProfessionalInfo professionalId={undefined} /> 
        </div>
      </div>
    );
  }

  // --- Fallback/Error State --- 
  console.log("[Render Logic] Showing Fallback/Error State");
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Perfil Profissional</h1>
        <p>Não foi possível verificar seu status profissional. Verifique o console para mais detalhes ou tente novamente mais tarde.</p>
      </div>
    </div>
  );
};

export default ProfessionalProfileSettings;

