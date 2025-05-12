import React, { useState, useEffect } from "react";
// Navigation header provided by ProfessionalAreaLayout
import { UserProfessionalInfo } from "@/components/profile/UserProfessionalInfo";
import { useAuth } from "@/contexts/AuthContext"; 
import apiClient from "@/lib/api"; 
import { Skeleton } from "@/components/ui/skeleton"; 
import { toast } from "@/components/ui/use-toast"; 
import { useNavigate } from "react-router-dom"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarRange, Info, Briefcase, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
  // Use new flags from user context
  const isAdmin = !!user?.isAdmin;
  const isProfessional = !!user?.isProfessional;
  const hasCompany = !!user?.hasCompany;
  const [professionalId, setProfessionalId] = useState<string | undefined>(undefined);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [professionalData, setProfessionalData] = useState<any>(null); 
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    const checkStatus = async () => {
      if (accessToken) {
        setIsLoadingStatus(true);
        // Always use /professionals/me for the logged-in user
        const statusResult = await fetchProfessionalMe(accessToken);
        setProfessionalId(statusResult.professionalId);
        setProfessionalData(statusResult.rawData || null);
        setIsLoadingStatus(false);
      } else {
        toast({ title: "Acesso Negado", description: "Faça login para acessar esta página.", variant: "destructive" });
        navigate("/login");
        setIsLoadingStatus(false);
      }
    };
    checkStatus();
  }, [user, accessToken, authLoading, navigate]);
  // --- Loading State --- 
  if (authLoading || isLoadingStatus) {
    return (
      <div className="space-y-6 w-full">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // --- Editing Existing Profile --- 
  if (isProfessional === true && professionalData && professionalData.id) {
    // Pass only professionalData to UserProfessionalInfo for the logged-in user
    return (
      <div className="space-y-6 w-full">
        <h1 className="text-2xl font-semibold">Perfil Profissional</h1>
        <UserProfessionalInfo professionalData={professionalData} />
      </div>
    );
  }

  // --- Creating New Profile --- 
  if (isProfessional === false) {
    // Never pass professionalId for creation mode
    return (
      <div className="space-y-6 w-full">
        <h1 className="text-2xl font-semibold">Cadastro de Perfil Profissional</h1>
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Fluxo em duas etapas</AlertTitle>
          <AlertDescription>
            Primeiro, crie seu perfil profissional com suas informações pessoais.
            Na próxima etapa, você poderá cadastrar seus serviços e definir horários específicos para cada um deles.
          </AlertDescription>
        </Alert>
        <UserProfessionalInfo />
      </div>
    );
  }
  // --- Fallback/Error State --- 
  return (
    <div className="space-y-6 w-full">
      <h1 className="text-2xl font-semibold">Perfil Profissional</h1>
      <p>Não foi possível verificar seu status profissional. Verifique o console para mais detalhes ou tente novamente mais tarde.</p>
    </div>
  );
};

export default ProfessionalProfileSettings;
