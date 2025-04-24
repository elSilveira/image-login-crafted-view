
import { Instagram, Facebook, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-12 pt-8 border-t">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold mb-4">Sobre</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#4664EA]">Quem Somos</a></li>
            <li><a href="#" className="hover:text-[#4664EA]">Como Funciona</a></li>
            <li><a href="#" className="hover:text-[#4664EA]">Carreiras</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Para Profissionais</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#4664EA]">Cadastre-se</a></li>
            <li><a href="#" className="hover:text-[#4664EA]">Como Funciona</a></li>
            <li><a href="#" className="hover:text-[#4664EA]">Planos</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Suporte</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#4664EA]">Central de Ajuda</a></li>
            <li><a href="#" className="hover:text-[#4664EA]">Contato</a></li>
            <li><a href="#" className="hover:text-[#4664EA]">Política de Privacidade</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Redes Sociais</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#4664EA]">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-[#4664EA]">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-[#4664EA]">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t">
        <div className="flex justify-center gap-4">
          <a href="#" className="hover:text-[#4664EA]">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-[#4664EA]">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-[#4664EA]">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">&copy; 2025 AgendaFácil. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};
