
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Star } from "lucide-react";

export const FeaturedProfessionals = () => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Profissionais em Destaque</h2>
      <div className="space-y-4">
        {[1, 2].map((pro) => (
          <Card key={pro} className="hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Profissional {pro}</h3>
                  <div className="flex items-center text-sm text-yellow-500 mb-2">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1">4.8</span>
                  </div>
                  <Button size="sm" className="w-full">Ver Perfil</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
