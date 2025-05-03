
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { UserProfessionalInfo } from "@/components/profile/UserProfessionalInfo";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import apiClient from "@/lib/api"; // Import configured Axios client
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { toast } from "@/components/ui/use-toast"; // Use toast from ui
import { useNavigate } from "react-router-dom"; // For potential redirects

// Function to fetch user profile and check professional status
// Assumes the /api/users/me endpoint returns user data including professional status info
async function fetchUserProfileAndCheckProfessionalStatus(token: string): Promise<{ isProfessional: boolean | null, professionalId?: string }> {
  try {
    const response = await apiClient.get("/users/me", { // Use apiClient and correct endpoint
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = response.data;
    
    // *** IMPORTANT: Adjust this logic based on your actual User model structure ***
    // Check if the user data indicates they are a professional.
    // Example 1: Check for a specific role
    // const isProf = userData.role === 'professional';
    // Example 2: Check if a professional profile ID exists
    const isProf = !!userData.professionalProfileId; 
    const profId = userData.professionalProfileId; // Get the ID if it exists
    // *** End of adjustment section ***

    console.log(`User professional status fetched: ${isProf}, ID: ${profId}`);
    return { isProfessional: isProf, professionalId: profId };

  } catch (error: any) {
    console.error("Error fetching user profile/status:", error);
    // Handle specific errors like 401 if needed
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
    // Don't fetch status until auth state is resolved and user/token are available
    if (authLoading) {
      return;
    }

    const checkStatus = async () => {
      if (user && accessToken) {
        setIsLoadingStatus(true);
        const statusResult = await fetchUserProfileAndCheckProfessionalStatus(accessToken);
        setIsProfessional(statusResult.isProfessional);
        setProfessionalId(statusResult.professionalId);
        setIsLoadingStatus(false);
      } else {
        // Not logged in, cannot access this page usually (handle based on routing rules)
        console.log("User not logged in, redirecting...");
        toast({ title: "Acesso Negado", description: "Faça login para acessar esta página.", variant: "destructive" });
        navigate("/login"); 
        setIsLoadingStatus(false); // Stop loading if redirecting
      }
    };

    checkStatus();
  }, [user, accessToken, authLoading, navigate]);

  // Combined loading state
  const isLoading = authLoading || isLoadingStatus;

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

  // If user IS a professional, show a message or redirect to view/edit page
  if (isProfessional === true) {
    // Option 1: Redirect to the profile view page (if it exists)
    // navigate(`/professionals/${professionalId}`); // Adjust path as needed
    // return null; // Or a loading indicator during redirect

    // Option 2: Show a message
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Perfil Profissional</h1>
          <p>Você já possui um perfil profissional cadastrado.</p>
          {/* Optionally add a link to view/edit */}
          {/* {professionalId && <Link to={`/professionals/${professionalId}`}>Ver Perfil</Link>} */}
        </div>
      </div>
    );
  }

  // If user is definitively NOT a professional, show the registration form
  if (isProfessional === false) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Cadastro de Perfil Profissional</h1>
          {/* Pass professionalId (which should be null/undefined here) or user ID if needed for creation */}
          <UserProfessionalInfo /* userId={user?.id} */ /> 
        </div>
      </div>
    );
  }

  // Fallback for errors or unexpected states (isProfessional is null)
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

