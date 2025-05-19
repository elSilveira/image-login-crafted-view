import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingInline } from "@/components/ui/loading";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      // Error handling is done in the AuthContext
      console.error("Login error", error);
    }
  };  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center p-4 h-screen">
        <Card className="w-full max-w-md shadow-lg border-iazi-border">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl font-playfair text-center text-iazi-text">
            Bem-vindo de volta
          </CardTitle>
          <CardDescription className="text-center text-iazi-text text-lg font-inter">
            Acesse sua conta para gerenciar seus agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10 h-12 text-base focus:border-iazi-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Senha"
                  className="pl-10 h-12 text-base focus:border-iazi-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-medium bg-iazi-primary hover:bg-iazi-primary-hover transition-colors"
              disabled={isLoading}
            >              {isLoading ? (
                <LoadingInline text="Entrando..." size="sm" />
              ) : (
                "Entrar"
              )}
            </Button>
            
            <div className="text-center space-y-2">
              <Link 
                to="/forgot-password" 
                className="text-sm text-iazi-primary hover:underline block"
              >
                Esqueceu sua senha?
              </Link>
              <p className="text-sm text-muted-foreground font-inter">
                Não tem uma conta?{" "}
                <Link 
                  to="/register" 
                  className="text-iazi-primary hover:underline"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </form>        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Login;
