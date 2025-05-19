
import React, { useState, useEffect } from "react";
import { UserProfessionalInfo } from "@/components/profile/UserProfessionalInfo";
import { useAuth } from "@/contexts/AuthContext"; 
import apiClient from "@/lib/api"; 
import { Skeleton } from "@/components/ui/skeleton"; 
import { toast } from "@/components/ui/use-toast"; 
import { useNavigate } from "react-router-dom"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageContainer } from "@/components/ui/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, UserRound } from "lucide-react";

// Function to fetch professional data for the logged-in user using /professionals/me
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
  // Use flags from user context
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
      <PageContainer>
        <div className="space-y-6 w-full">
          <Skeleton className="h-8 w-1/3 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageContainer>
    );
  }

  // --- Editing Existing Profile --- 
  if (isProfessional === true && professionalData && professionalData.id) {
    return (
      <PageContainer>
        <div className="space-y-6 w-full">
          <div className="flex items-center gap-2">
            <UserRound className="h-6 w-6 text-iazi-primary" />
            <h1 className="text-2xl font-semibold">Perfil Profissional</h1>
          </div>
          
          <Card className="border-iazi-border">
            <CardHeader className="bg-muted/30 pb-3">
              <CardTitle className="text-lg">Editar Perfil</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <UserProfessionalInfo professionalData={professionalData} />
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  // --- Creating New Profile --- 
  if (isProfessional === false) {
    return (
      <PageContainer>
        <div className="space-y-6 w-full">
          <div className="flex items-center gap-2">
            <UserRound className="h-6 w-6 text-iazi-primary" />
            <h1 className="text-2xl font-semibold">Cadastro de Perfil Profissional</h1>
          </div>
          
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Fluxo em duas etapas</AlertTitle>
            <AlertDescription>
              Primeiro, crie seu perfil profissional com suas informações pessoais.
              Na próxima etapa, você poderá cadastrar seus serviços e definir horários específicos para cada um deles.
            </AlertDescription>
          </Alert>
          
          <Card className="border-iazi-border">
            <CardHeader className="bg-muted/30 pb-3">
              <CardTitle className="text-lg">Novo Perfil</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <UserProfessionalInfo />
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  // --- Fallback/Error State --- 
  return (
    <PageContainer>
      <div className="space-y-6 w-full">
        <div className="flex items-center gap-2">
          <UserRound className="h-6 w-6 text-iazi-primary" />
          <h1 className="text-2xl font-semibold">Perfil Profissional</h1>
        </div>
        
        <Card className="border-iazi-border">
          <CardContent className="p-6">
            <p className="text-gray-600">Não foi possível verificar seu status profissional. Verifique o console para mais detalhes ou tente novamente mais tarde.</p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default ProfessionalProfileSettings;
