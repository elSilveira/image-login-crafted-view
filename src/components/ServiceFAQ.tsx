
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const ServiceFAQ = () => {
  // Mock data - In a real app, this would come from props or an API
  const faqs = [
    {
      question: "Quanto tempo dura o serviço?",
      answer: "O serviço tem duração média de 45 minutos, podendo variar de acordo com o tipo de cabelo e estilo desejado.",
    },
    {
      question: "Preciso agendar com antecedência?",
      answer: "Sim, recomendamos que agende com pelo menos 24 horas de antecedência para garantir o horário desejado.",
    },
    {
      question: "Posso cancelar ou remarcar?",
      answer: "Sim, você pode cancelar ou remarcar seu agendamento com até 4 horas de antecedência sem custo adicional.",
    },
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <Collapsible key={index}>
          <CollapsibleTrigger className="text-left font-medium hover:text-primary">
            {faq.question}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 text-muted-foreground">
            {faq.answer}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default ServiceFAQ;
