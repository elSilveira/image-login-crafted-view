import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "../lib/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { updateAuthState } = useAuth();
  const location = useLocation();
  // Captura o inviteCode da query string
  const searchParams = new URLSearchParams(location.search);
  const inviteCode = searchParams.get("inviteCode") || "";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: any = { name, email, password };
      if (inviteCode) payload.inviteCode = inviteCode;
      const response = await apiClient.post("/auth/register", payload);
      const { user: registeredUser, accessToken, refreshToken } = response.data;

      if (!registeredUser || !accessToken) {
        throw new Error("Resposta de registro inválida do servidor.");
      }

      updateAuthState(registeredUser, accessToken, refreshToken);

      toast({
        title: "Conta criada com sucesso!",
        description: `Bem-vindo(a), ${registeredUser.name}! Você será redirecionado.`,
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error: any) {
      console.error("Registration failed:", error);
      const errorMessage = error.response?.data?.message || error.message || "Ocorreu um erro inesperado.";
      toast({
        title: "Erro ao criar conta",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };  return (
    <>
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
    </>
  );
};

export default Register;
