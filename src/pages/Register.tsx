import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { updateAuthState } = useAuth(); // Get updateAuthState function from context

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar conta");
      }

      const { user: registeredUser, accessToken, refreshToken } = data;

      // Update AuthContext state and localStorage using the function from context
      updateAuthState(registeredUser, accessToken, refreshToken);

      toast({
        title: "Conta criada com sucesso!",
        description: `Bem-vindo(a), ${registeredUser.name}! Você será redirecionado.`,
      });

      // Navigate to home page after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-iazi-rosa-1/20 p-4">
      <Card className="w-full max-w-md shadow-lg border-iazi-border">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl font-playfair text-center text-iazi-text">
            Criar conta
          </CardTitle>
          <CardDescription className="text-center text-iazi-text text-lg font-inter">
            Preencha seus dados para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Nome completo"
                  className="pl-10 h-12 text-base focus:border-iazi-primary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10 h-12 text-base focus:border-iazi-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Senha (mínimo 8 caracteres)"
                  className="pl-10 h-12 text-base focus:border-iazi-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-medium bg-iazi-primary hover:bg-iazi-primary-hover transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar conta"
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground font-inter">
                Já tem uma conta?{" "}
                <Link 
                  to="/login"
                  className="text-iazi-primary hover:underline"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;

