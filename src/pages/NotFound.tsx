
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageContainer } from "@/components/ui/page-container";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F4F3F2]">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-16">
        <PageContainer>
          <div className="text-center bg-white p-12 rounded-lg shadow-sm">
            <h1 className="text-6xl font-bold mb-6 text-iazi-primary">404</h1>
            <p className="text-xl text-gray-600 mb-8">Oops! Página não encontrada</p>
            <Link to="/">
              <Button className="bg-iazi-primary hover:bg-iazi-primary-hover text-white">
                Voltar para Página Inicial
              </Button>
            </Link>
          </div>
        </PageContainer>
      </div>
    </div>
  );
};

export default NotFound;
