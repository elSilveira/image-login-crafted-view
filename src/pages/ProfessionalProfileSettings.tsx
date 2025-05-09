import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { UserProfessionalInfo } from "@/components/profile/UserProfessionalInfo";
import { useAuth } from "@/contexts/AuthContext"; 
import apiClient from "@/lib/api"; 
import { Skeleton } from "@/components/ui/skeleton"; 
import { toast } from "@/components/ui/use-toast"; 
import { useNavigate } from "react-router-dom"; 

// Função para buscar dados do profissional logado usando /professionals/me
async function fetchProfessionalMe(token: string): Promise<{ isProfessional: boolean, professionalId?: string, rawData?: any }> {
  try {
    const response = await apiClient.get("/professionals/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const professional = response.data;
    if (professional && professional.id) {
      return { isProfessional: true, professionalId: professional.id, rawData: professional };
    }
    return { isProfessional: false };
  } catch (error: any) {
    return { isProfessional: false };
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
      if (accessToken) {
        setIsLoadingStatus(true);
        console.log("[checkStatus] Calling fetchProfessionalMe...");
        const statusResult = await fetchProfessionalMe(accessToken);
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

  useEffect(() => {
    console.log('[ProfessionalProfileSettings] user:', user);
    console.log('[ProfessionalProfileSettings] professionalId:', professionalId);
  }, [user, professionalId]);

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

