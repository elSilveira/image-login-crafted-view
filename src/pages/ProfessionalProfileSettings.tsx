
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { UserProfessionalInfo } from "@/components/profile/UserProfessionalInfo";
import { useAuth } from "@/contexts/AuthContext"; 
import apiClient from "@/lib/api"; 
import { Skeleton } from "@/components/ui/skeleton"; 
import { toast } from "@/components/ui/use-toast"; 
import { useNavigate } from "react-router-dom"; 
import { fetchProfessionalDetails } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarRange, Info } from "lucide-react";
import { Link } from "react-router-dom";

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
  const [professionalData, setProfessionalData] = useState<any>(null); // <-- NEW
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    const checkStatus = async () => {
      if (accessToken) {
        setIsLoadingStatus(true);
        // Always use /professionals/me for the logged-in user
        const statusResult = await fetchProfessionalMe(accessToken);
        setIsProfessional(statusResult.isProfessional);
        setProfessionalId(statusResult.professionalId);
        setProfessionalData(statusResult.rawData || null); // <-- NEW
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
    // Pass only professionalData to UserProfessionalInfo for the logged-in user
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Editar Perfil Profissional</h1>
          
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Serviços e Horários</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <span>Os serviços e horários agora são gerenciados em uma área específica.</span>
              <Link to="/company/my-company/services" className="text-iazi-primary hover:underline flex items-center gap-1">
                <CalendarRange className="h-4 w-4" /> Gerenciar meus serviços e horários
              </Link>
            </AlertDescription>
          </Alert>
          
          <UserProfessionalInfo professionalData={professionalData} />
        </div>
      </div>
    );
  }

  // --- Creating New Profile --- 
  if (isProfessional === false) {
    // Never pass professionalId for creation mode
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Cadastro de Perfil Profissional</h1>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Fluxo em duas etapas</AlertTitle>
            <AlertDescription>
              Primeiro, crie seu perfil profissional com suas informações pessoais.
              Na próxima etapa, você poderá cadastrar seus serviços e definir horários específicos para cada um deles.
            </AlertDescription>
          </Alert>
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
        <p>Não foi possível verificar seu status profissional. Verifique o console para mais detalhes ou tente novamente mais tarde.</p>
      </div>
    </div>
  );
};

export default ProfessionalProfileSettings;
