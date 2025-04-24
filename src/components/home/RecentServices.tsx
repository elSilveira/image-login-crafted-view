
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export const RecentServices = () => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Serviços Recentes</h2>
      <div className="space-y-4">
        {[1, 2, 3].map((service) => (
          <Card key={service} className="overflow-hidden hover:shadow-lg transition-all">
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-100" />
              <div className="p-4">
                <h3 className="font-semibold mb-2">Serviço Premium {service}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Serviço profissional com atendimento personalizado...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                  <span className="text-[#4664EA] font-semibold">R$ 50,00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
