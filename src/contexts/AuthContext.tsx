import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Define the backend API base URL
const API_URL = "http://localhost:3001/api"; // Assuming backend runs on port 3001

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>; // Make login async
  logout: () => void;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Keep true initially for token check
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for stored tokens and user data on initial load
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");

    if (storedAccessToken && storedRefreshToken && storedUser) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setUser(JSON.parse(storedUser));
      // TODO: Optionally validate the token with the backend here
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Throw an error with the message from the backend, or a default one
        throw new Error(data.message || "Erro ao fazer login");
      }

      // Assuming the backend returns accessToken, refreshToken, and user object on successful login
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: loggedInUser } = data;

      // Store tokens and user data
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      // Update state
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUser(loggedInUser);

      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${loggedInUser.name}!`,
      });

      navigate("/"); // Navigate to home or dashboard after login

    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: "Erro de login",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear state
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    // Clear storage
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
    navigate("/login");
  };

  // TODO: Implement refresh token logic
  // This would typically involve an interceptor for API calls
  // that checks for 401 errors, attempts to refresh the token,
  // and retries the original request.

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!accessToken, // Base authentication status on token presence
        isLoading,
        accessToken,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

