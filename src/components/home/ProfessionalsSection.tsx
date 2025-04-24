
import { ProfessionalCard } from "@/components/home/ProfessionalCard";

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
      <h2 className="text-xl font-outfit font-semibold mb-4 text-iazi-text">Profissionais em Destaque</h2>
      <div className="space-y-4">
        {professionals.map((professional) => (
          <ProfessionalCard
            key={professional.id}
            name={professional.name}
            rating={professional.rating}
            image={professional.image}
          />
        ))}
      </div>
    </section>
  );
};
