
import { ServiceCard } from "@/components/home/ServiceCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: "Manutenção de Ar Condicionado",
      description: "Limpeza e manutenção do seu ar condicionado...",
      rating: 4.8,
      price: 150,
    },
    {
      id: 2,
      title: "Pintura Residencial",
      description: "Serviço profissional de pintura para sua casa...",
      rating: 4.7,
      price: 500,
    },
    {
      id: 3,
      title: "Aulas de Inglês",
      description: "Aulas particulares com professor nativo...",
      rating: 4.9,
      price: 80,
    },
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-playfair font-semibold text-iazi-text">Serviços Recentes</h2>
        <Button variant="link" asChild>
          <Link to="/services" className="font-inter">Ver todos</Link>
        </Button>
      </div>
      <div className="space-y-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            id={service.id}
            title={service.title}
            description={service.description}
            rating={service.rating}
            price={service.price}
          />
        ))}
      </div>
    </section>
  );
};
