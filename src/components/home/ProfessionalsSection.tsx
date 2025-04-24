
import { ProfessionalCard } from "@/components/home/ProfessionalCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ProfessionalsSection = () => {
  const professionals = [
    {
      id: 1,
      name: "João Silva",
      rating: 4.8,
      image: null,
    },
    {
      id: 2,
      name: "Maria Oliveira",
      rating: 4.9,
      image: null,
    },
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-playfair font-semibold text-iazi-text">Profissionais em Destaque</h2>
        <Button variant="link" asChild>
          <Link to="/professionals" className="font-inter">Ver todos</Link>
        </Button>
      </div>
      <div className="space-y-4">
        {professionals.map((professional) => (
          <ProfessionalCard
            key={professional.id}
            id={professional.id}
            name={professional.name}
            rating={professional.rating}
            image={professional.image}
          />
        ))}
      </div>
    </section>
  );
};
