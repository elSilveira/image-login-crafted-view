
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const tasks = [
  {
    id: 1,
    title: "Completar cadastro da empresa",
    completed: true,
  },
  {
    id: 2,
    title: "Adicionar horários de funcionamento",
    completed: true,
  },
  {
    id: 3,
    title: "Cadastrar primeiro serviço",
    completed: false,
  },
  {
    id: 4,
    title: "Convidar funcionários",
    completed: false,
  },
  {
    id: 5,
    title: "Configurar métodos de pagamento",
    completed: false,
  },
];

export const CompanyTasksList = () => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-center justify-between p-2 rounded-md ${
            task.completed ? "bg-green-100/50" : "bg-background"
          }`}
        >
          <div className="flex items-center">
            <div className="mr-2">
              {task.completed ? (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-muted" />
              )}
            </div>
            <span className={task.completed ? "line-through text-muted-foreground" : ""}>
              {task.title}
            </span>
          </div>
          {!task.completed && (
            <Button variant="outline" size="sm">
              Concluir
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
