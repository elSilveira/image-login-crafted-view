import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  /** Texto a ser exibido abaixo do indicador de loading */
  text?: string;
  /** Tamanho do indicador de loading (sm, md, lg) */
  size?: "sm" | "md" | "lg";
  /** Exibir em tela inteira? */
  fullScreen?: boolean;
  /** Classe CSS personalizada */
  className?: string;
}

/**
 * Componente de loading padronizado para uso em toda a aplicação
 */
export function Loading({ 
  text = "Carregando...", 
  size = "md", 
  fullScreen = false,
  className
}: LoadingProps) {
  // Determina o tamanho do loader baseado na prop size
  const loaderSize = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-14 w-14"
  }[size];
  
  const containerClasses = fullScreen 
    ? "min-h-screen flex flex-col items-center justify-center"
    : "py-8 flex flex-col items-center justify-center";
  
  return (
    <div className={cn(containerClasses, className)}>
      <Loader2 className={cn(loaderSize, "animate-spin text-iazi-primary mb-3")} />
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );
}

/**
 * Componente de loading para uso em cards e containers menores
 */
export function LoadingInline({ text, size = "sm", className }: Omit<LoadingProps, "fullScreen">) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Loader2 className={cn({
        "h-4 w-4": size === "sm",
        "h-6 w-6": size === "md",
        "h-8 w-8": size === "lg"
      }, "animate-spin text-iazi-primary")} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

/**
 * Componente para exibir loading de página com skeletons
 */
export function PageLoading({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-6">
        <Loader2 className="h-12 w-12 animate-spin text-iazi-primary mb-4" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
      {children}
    </div>
  );
}
