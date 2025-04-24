
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SettingsSection } from "../SettingsSection";
import { useToast } from "@/hooks/use-toast";

export const AccountSettings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Alterações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <SettingsSection 
        title="Configurações da Conta" 
        description="Gerencie suas informações pessoais e preferências de conta"
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" defaultValue="João Silva" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="joao@example.com" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-iazi-primary hover:bg-iazi-primary-hover text-white"
          >
            Salvar alterações
          </Button>
        </div>
      </SettingsSection>
    </div>
  );
};
