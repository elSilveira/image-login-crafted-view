
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login em andamento",
      description: "Processando suas credenciais...",
    });
    // Add actual login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Bem-vindo de volta
          </CardTitle>
          <CardDescription className="text-center text-gray-600 text-lg">
            Acesse sua conta para gerenciar seus agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10 h-12 text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Senha"
                  className="pl-10 h-12 text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-[#4664EA] hover:bg-[#3651D3] transition-colors"
            >
              Entrar
            </Button>
            
            <div className="text-center space-y-2">
              <a 
                href="#" 
                className="text-sm text-[#4664EA] hover:underline block"
              >
                Esqueceu sua senha?
              </a>
              <p className="text-sm text-gray-600">
                Não tem uma conta?{" "}
                <a 
                  href="#" 
                  className="text-[#4664EA] hover:underline"
                >
                  Cadastre-se
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
