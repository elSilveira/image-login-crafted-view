
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is stored in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    setIsLoading(true);
    
    // Mock API call with setTimeout
    setTimeout(() => {
      // Mock validation
      if (email && password.length >= 6) {
        // Mock user data
        const mockUser: User = {
          id: "user-123",
          name: "Usuário Teste",
          email: email,
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        };
        
        // Store user in state and localStorage
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo, ${mockUser.name}!`,
        });
        
        navigate("/");
      } else {
        toast({
          title: "Erro de login",
          description: "Email ou senha inválidos",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 800);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
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
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
