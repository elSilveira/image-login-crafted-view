
import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className={cn("space-y-6", className)}>
        {children}
      </div>
    </div>
  );
}
