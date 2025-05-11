import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardCheck, Loader2 } from "lucide-react";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteCode: string | null;
  loading: boolean;
  onCopy: () => void;
  copied: boolean;
  role?: 'admin' | 'company' | 'professional'; // Optional, for context
}

export const InviteModal: React.FC<InviteModalProps> = ({ open, onOpenChange, inviteCode, loading, onCopy, copied, role }) => {
  // Helper to show role-specific instructions
  const getRoleInstructions = () => {
    switch (role) {
      case 'admin':
        return 'Este convite permite que um novo ADMIN cadastre-se na plataforma.';
      case 'company':
        return 'Este convite permite que uma nova EMPRESA cadastre-se na plataforma.';
      case 'professional':
        return 'Este convite permite que um novo PROFISSIONAL cadastre-se na plataforma.';
      default:
        return 'Compartilhe este código com o convidado. Ele poderá usá-lo para se cadastrar na plataforma.';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convite Gerado</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : inviteCode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Código do Convite</label>
              <Input value={inviteCode} readOnly className="font-mono" />
            </div>
            <div className="flex gap-2">
              <Button onClick={onCopy} variant="outline" className="flex-1">
                {copied ? <ClipboardCheck className="h-4 w-4 mr-2" /> : null}
                {copied ? "Copiado!" : "Copiar Mensagem"}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              {getRoleInstructions()}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">Erro ao gerar convite.</div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
