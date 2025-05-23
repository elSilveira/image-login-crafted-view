import { MessageSquare, User, PlusCircle, Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import PublicationForm from "./social/PublicationForm";
import { useQuery } from "@tanstack/react-query";
import { getProfessionalServices } from "@/lib/api-services";
import { getEffectiveUserRole } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

const SocialFeed = () => {
  const { user } = useAuth();
  const [showPublicationForm, setShowPublicationForm] = useState(false);
  
  // Show create publication if user has isProfessional, hasCompany, or isAdmin
  const canPublish = !!(user && (user.isProfessional || user.hasCompany || user.isAdmin));
    // Fetch professional services only if user is professional and a backend ID is available (not from user context)
  // This example disables the fetch if no backend ID is available
  const { data: professionalServices = [] } = useQuery({
    queryKey: ["professionalServices", user?.id], // Use user.id as a fallback, or fetch after login
    queryFn: async () => {
      if (!user?.isProfessional) return [];
      
      try {
        const result = await getProfessionalServices(user?.id || "");
        // Ensure we have an array
        if (!result || !Array.isArray(result)) {
          console.warn('Expected array from getProfessionalServices, got:', typeof result);
          return [];
        }
        return result;
      } catch (err) {
        console.error('Error fetching professional services:', err);
        return []; // Return empty array on error
      }
    },
    enabled: !!canPublish && !!user?.isProfessional && !!user?.id,
  });

  // Convert professional services to the format expected by PublicationForm
  const formattedServices = Array.isArray(professionalServices) ? professionalServices.map((ps: any) => ({
    id: ps.serviceId,
    name: ps.service?.name || 'Serviço sem nome'
  })) : [];

  // Handle publication submission
  const handlePublicationSubmit = async (data: {content: string; serviceId: string; image?: File}) => {
    console.log("Publication submitted:", data);
    // Here you would call your API to create the publication
    setShowPublicationForm(false);
    // For now we'll just simulate success
    return Promise.resolve();
  };

  // Updated mock data with images
  const posts = [
    {
      id: 1,
      author: {
        id: "maria-oliveira",
        name: "Maria Oliveira",
        avatar: "/placeholder.svg",
        profession: "Cabeleireira"
      },
      content: "Acabei de fazer um curso incrível de colorimetria! Ansiosa para trazer novas técnicas para minhas clientes 💇‍♀️",
      image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800",
      likes: 24,
      comments: 5,
      time: "2h",
      serviceId: 1
    },
    {
      id: 2,
      author: {
        id: "carlos-santos",
        name: "Carlos Santos",
        avatar: "/placeholder.svg",
        profession: "Barbeiro"
      },
      content: "Novo horário de atendimento: Segunda a Sábado das 9h às 20h. Agende seu horário! ✂️",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800",
      likes: 15,
      comments: 3,
      time: "4h",
      serviceId: 2
    }
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Feed de Atualizações</CardTitle>
        {canPublish && (
          <Button
            size="icon"
            variant="outline"
            className="ml-2"
            title="Criar Publicação"
            onClick={() => setShowPublicationForm(true)}
          >
            <Edit className="h-5 w-5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Modal for PublicationForm */}
        <Dialog open={showPublicationForm} onOpenChange={setShowPublicationForm}>
          <DialogContent className="max-w-lg w-full">
            <DialogHeader>
              <DialogTitle>Nova Publicação</DialogTitle>
            </DialogHeader>
            <PublicationForm 
              services={formattedServices}
              onSubmit={handlePublicationSubmit}
              isLoading={false}
            />
          </DialogContent>
        </Dialog>
        {/* Existing posts */}
        {posts.map((post) => (
          <div key={post.id} className="border-b pb-6 last:border-0">
            <div className="flex items-start gap-4">
              <Link to={`/professional/${post.author.id}`}>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <Link to={`/professional/${post.author.id}`} className="cursor-pointer hover:text-[#4664EA]">
                    <h4 className="font-semibold">{post.author.name}</h4>
                    <p className="text-sm text-gray-600">{post.author.profession}</p>
                  </Link>
                  <span className="text-sm text-gray-500">{post.time}</span>
                </div>
                <p className="mt-2 mb-4">{post.content}</p>
                {post.image && (
                  <Link to={`/service/${post.id}`}>
                    <div className="mt-3 mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={post.image} 
                        alt="Post content" 
                        className="w-full h-auto object-cover rounded-lg hover:opacity-95 transition-opacity cursor-pointer"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        onLoad={(e) => { e.currentTarget.style.display = 'block'; }}
                      />
                    </div>
                  </Link>
                )}
                <div className="mt-4 flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="hover:text-[#4664EA]">
                    👍 {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:text-[#4664EA]">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:text-[#4664EA]" asChild>
                    <Link to={`/booking/${post.serviceId}`}>
                      Agendar Serviço
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SocialFeed;
