
import { ServiceCard } from "@/components/home/ServiceCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: "Corte Masculino",
      description: "Corte profissional com acabamento personalizado...",
      rating: 4.8,
      price: 50,
    },
    {
      id: 2,
      title: "Design de Sobrancelha",
      description: "Modelagem com técnicas exclusivas para realçar seu olhar...",
      rating: 4.7,
      price: 35,
    },
    {
      id: 3,
      title: "Manicure Premium",
      description: "Tratamento completo para unhas com esmaltação em gel...",
      rating: 4.9,
      price: 70,
    },
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-playfair font-semibold text-iazi-text">Serviços Recentes</h2>
        <Button variant="link" asChild>
          <Link to="/services">Ver todos</Link>
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
