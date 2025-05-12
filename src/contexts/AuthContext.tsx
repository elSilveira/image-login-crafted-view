import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import apiClient from "../lib/api"; // Import the configured Axios client

type UserRole = 'admin' | 'company' | 'professional' | 'user';

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profilePicture?: string; // Added profile picture
  phone?: string; // Added phone
  // professionalProfileId?: string | null; // Removido conforme nova regra
  professionalId?: string | null; // Compatibilidade com backend legado, mas não usado
  companyId?: string | null; // Added company ID
  role?: UserRole; // Adicionado para facilitar o controle de permissão
  admin?: boolean; // fallback para sistemas antigos
  isAdmin?: boolean;
  isProfessional?: boolean;
  hasCompany?: boolean;
  // Add other relevant user fields from backend if needed (e.g., role)
};

// Utilitário para obter o papel efetivo do usuário
export function getEffectiveUserRole(user: User | null): UserRole {
  if (!user) return 'user';
  if (user.role) return user.role;
  if (user.admin) return 'admin';
  if (user.companyId) return 'company';
  // if (user.professionalProfileId) return 'professional'; // Removido
  if (user.isProfessional) return 'professional';
  return 'user';
}

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
        const parsedUser = JSON.parse(storedUser);
        // Novo: suporte a professionalId (backend pode retornar professionalId ou professionalProfileId)
        const normalizedUser = {
          ...parsedUser,
          isAdmin: parsedUser.isAdmin ?? (parsedUser.role === 'ADMIN' || parsedUser.role === 'admin'),
          isProfessional: parsedUser.isProfessional ?? (parsedUser.role === 'PROFESSIONAL' || parsedUser.role === 'professional'),
          hasCompany: parsedUser.hasCompany ?? !!parsedUser.companyId,
        };
        setUser(normalizedUser);
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
    // Ensure new fields are set for compatibility
    const userWithFlags = {
      ...loggedInUser,
      // professionalProfileId removido
      isAdmin: typeof loggedInUser.isAdmin === 'boolean' ? loggedInUser.isAdmin : (typeof loggedInUser.role === 'string' ? loggedInUser.role.toLowerCase() === 'admin' : false) || loggedInUser.admin === true,
      isProfessional: typeof loggedInUser.isProfessional === 'boolean' ? loggedInUser.isProfessional : (typeof loggedInUser.role === 'string' ? loggedInUser.role.toLowerCase() === 'professional' : false),
      hasCompany: typeof loggedInUser.hasCompany === 'boolean' ? loggedInUser.hasCompany : !!loggedInUser.companyId,
    };
    localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userWithFlags));
    setAccessToken(newAccessToken);
    setUser(userWithFlags);
    if (newRefreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
      setRefreshToken(newRefreshToken);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      // O backend retorna { message, accessToken, refreshToken, user }
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userPayload } = response.data;
      if (!newAccessToken || !userPayload) {
        throw new Error("Resposta de login inválida do servidor.");
      }
      // Normaliza os campos do usuário para garantir compatibilidade
      const loggedInUser = {
        id: userPayload.id,
        name: userPayload.name,
        email: userPayload.email,
        avatar: userPayload.avatar ?? undefined,
        profilePicture: userPayload.profilePicture ?? undefined,
        phone: userPayload.phone ?? undefined,
        bio: userPayload.bio ?? undefined,
        slug: userPayload.slug ?? undefined,
        role: typeof userPayload.role === 'string' ? userPayload.role.toLowerCase() : undefined,
        professionalId: userPayload.professionalId ?? null,
        companyId: userPayload.companyId ?? null,
        isProfessional: userPayload.isProfessional ?? (userPayload.role === 'PROFESSIONAL' || userPayload.role === 'professional'),
        hasCompany: userPayload.hasCompany ?? !!userPayload.companyId,
        isAdmin: userPayload.isAdmin ?? (userPayload.role === 'ADMIN' || userPayload.role === 'admin'),
        admin: userPayload.admin ?? false,
        createdAt: userPayload.createdAt,
        updatedAt: userPayload.updatedAt,
      };
      updateAuthState(loggedInUser, newAccessToken, newRefreshToken);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${loggedInUser.name}!`,
      });
      navigate("/");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Login failed:", error);
      const errorMessage = error.message || "Ocorreu um erro inesperado.";
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
