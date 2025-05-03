import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import apiClient from "../lib/api"; // Import the configured Axios client

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  // Add other relevant user fields from backend if needed (e.g., role)
};

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateAuthState: (user: User, accessToken: string, refreshToken?: string) => void; // refreshToken is optional based on backend response
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

// Consistent key for storing the access token
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

  useEffect(() => {
    const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedAccessToken && storedUser) { // Check for access token primarily
      setAccessToken(storedAccessToken);
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
      }
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        // Clear invalid stored data if parsing fails
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Function to update auth state (used by login and potentially register)
  const updateAuthState = (loggedInUser: User, newAccessToken: string, newRefreshToken?: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    setAccessToken(newAccessToken);
    setUser(loggedInUser);
    if (newRefreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
      setRefreshToken(newRefreshToken);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Use apiClient (Axios) instead of fetch
      const response = await apiClient.post("/auth/login", { email, password });

      // Axios wraps the response data in `data` property
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: loggedInUser } = response.data;

      if (!newAccessToken || !loggedInUser) {
        throw new Error("Resposta de login inválida do servidor.");
      }

      // Update state and localStorage using the helper function
      updateAuthState(loggedInUser, newAccessToken, newRefreshToken);

      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${loggedInUser.name}!`,
      });

      navigate("/"); // Navigate to home or dashboard after login

    } catch (error: any) {
      console.error("Login failed:", error);
      // Handle Axios error structure (error.response.data)
      const errorMessage = error.response?.data?.message || error.message || "Ocorreu um erro inesperado.";
      toast({
        title: "Erro de login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    // Optionally: Call a backend logout endpoint if it exists
    // apiClient.post("/auth/logout").catch(err => console.error("Backend logout failed:", err));
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
    navigate("/login");
  };

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

