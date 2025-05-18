
import React from "react";
import { SearchX } from "lucide-react";
import { categories } from "@/components/services/ServiceFilters";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function EmptyResults() {
  // Select a few categories to suggest
  const suggestedCategories = categories.slice(1, 5); // Skip "Todas categorias"

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-lg shadow-sm">
      <SearchX className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-iazi-text mb-2">Nenhum resultado encontrado</h3>
      <p className="text-gray-600 mb-6 max-w-md">
        Não conseguimos encontrar o que você está procurando. Tente ajustar os filtros ou busque por outra palavra-chave.
      </p>

      <div className="space-y-4 w-full max-w-md">
        <div className="text-left">
          <h4 className="font-medium text-iazi-text mb-2">Categorias populares:</h4>
          <div className="flex flex-wrap gap-2">
            {suggestedCategories.map((category) => (
              <Link key={category} to={`/search?category=${encodeURIComponent(category)}`}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full border-iazi-border hover:bg-iazi-rosa-1 hover:text-iazi-text hover:border-iazi-rosa-medio"
                >
                  {category}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <Link to="/">
            <Button className="bg-iazi-primary hover:bg-iazi-primary-hover text-white w-full">
              Voltar para página inicial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
