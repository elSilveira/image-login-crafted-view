
import { ServiceCard } from "@/components/home/ServiceCard";

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
      <h2 className="text-xl font-outfit font-semibold mb-4 text-iazi-text">Serviços Recentes</h2>
      <div className="space-y-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
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
