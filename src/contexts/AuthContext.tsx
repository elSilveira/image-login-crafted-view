
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import apiClient from "../lib/api"; // Import the configured Axios client

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profilePicture?: string; // Added profile picture
  phone?: string; // Added phone
  professionalProfileId?: string | null; // Added professional profile ID
  companyId?: string | null; // Added company ID
  // Add other relevant user fields from backend if needed (e.g., role)
};

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: (callBackend?: boolean) => Promise<void>; // Added optional param
  updateAuthState: (user: User, accessToken: string, refreshToken?: string) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Consistent keys
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load initial state from localStorage
  useEffect(() => {
    const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedAccessToken && storedUser) {
      setAccessToken(storedAccessToken);
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
      }
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        // Clear invalid stored data
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Function to update auth state (used by login and potentially register)
  const updateAuthState = useCallback((loggedInUser: User, newAccessToken: string, newRefreshToken?: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    setAccessToken(newAccessToken);
    setUser(loggedInUser);
    if (newRefreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
      setRefreshToken(newRefreshToken);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: loggedInUser } = response.data;

      if (!newAccessToken || !loggedInUser) {
        throw new Error("Resposta de login inválida do servidor.");
      }

      updateAuthState(loggedInUser, newAccessToken, newRefreshToken);

      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${loggedInUser.name}!`,
      });

      navigate("/");
      
      return Promise.resolve();

    } catch (error: any) {
      console.error("Login failed:", error);
      const errorMessage = error.message || "Ocorreu um erro inesperado."; // Use error message processed by interceptor
      toast({
        title: "Erro de login",
        description: errorMessage,
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast, updateAuthState]);

  // Updated logout function
  const logout = useCallback(async (callBackend = true): Promise<void> => {
    console.log("Iniciando logout...");
    const currentRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    // Clear local state and storage immediately
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    // Clear Axios default header (important if instance is reused)
    delete apiClient.defaults.headers.common["Authorization"];

    // Optionally: Call backend logout endpoint to invalidate refresh token
    if (callBackend && currentRefreshToken) {
      try {
        console.log("Chamando backend /auth/logout");
        // Assuming backend expects refreshToken in the body
        await apiClient.post("/auth/logout", { refreshToken: currentRefreshToken });
        console.log("Backend logout bem-sucedido.");
      } catch (err: any) {
        // Log error but proceed with client-side logout anyway
        console.error("Falha ao chamar backend /auth/logout:", err.response?.data || err.message);
      }
    }

    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
    
    navigate("/login");
    return Promise.resolve();
  }, [navigate, toast]);

  // Add listener for storage changes to handle logout from other tabs/windows or interceptor redirect
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ACCESS_TOKEN_KEY && !event.newValue) {
        // If access token is removed from another context, trigger logout locally
        console.log("Access token removido do storage, efetuando logout local.");
        // Avoid calling backend again if it was likely triggered by interceptor
        logout(false); 
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateAuthState,
        isAuthenticated: !!accessToken,
        isLoading,
        accessToken,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
