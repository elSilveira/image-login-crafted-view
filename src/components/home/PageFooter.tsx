
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { FooterGroup } from "@/components/home/FooterGroup";

export const PageFooter = () => {
  const aboutLinks = [
    { title: "Quem Somos", url: "#" },
    { title: "Como Funciona", url: "#" },
    { title: "Carreiras", url: "#" }
  ];
  
  const professionalLinks = [
    { title: "Cadastre-se", url: "#" },
    { title: "Como Funciona", url: "#" },
    { title: "Planos", url: "#" }
  ];
  
  const supportLinks = [
    { title: "Central de Ajuda", url: "#" },
    { title: "Contato", url: "#" },
    { title: "Política de Privacidade", url: "#" }
  ];

  return (
    <footer className="mt-12 pt-8 border-t border-iazi-border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <FooterGroup title="Sobre" links={aboutLinks} />
        <FooterGroup title="Para Profissionais" links={professionalLinks} />
        <FooterGroup title="Suporte" links={supportLinks} />
        
        <div>
          <h3 className="font-outfit font-semibold mb-4 text-iazi-text">Redes Sociais</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-iazi-primary">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-iazi-primary">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-iazi-primary">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-8 border-t border-iazi-border">
        <div className="flex justify-center gap-4">
          <a href="#" className="hover:text-iazi-primary">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-iazi-primary">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-iazi-primary">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600 font-inter">&copy; 2025 AgendaFácil. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};
