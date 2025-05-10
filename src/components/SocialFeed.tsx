import { MessageSquare, User, Image, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import PublicationForm from "./social/PublicationForm";
import { useQuery } from "@tanstack/react-query";
import { getProfessionalServices } from "@/lib/api-services";

const SocialFeed = () => {
  const { user } = useAuth();
  const [showPublicationForm, setShowPublicationForm] = useState(false);
  
  // Check if user is a professional or company
  const canPublish = user && (user.professionalProfileId || false); // Add company check here in the future
  
  // Fetch professional services if user can publish
  const { data: professionalServices = [] } = useQuery({
    queryKey: ["professionalServices", user?.professionalProfileId],
    queryFn: () => getProfessionalServices(user?.professionalProfileId || ""),
    enabled: !!canPublish && !!user?.professionalProfileId,
  });

  // Convert professional services to the format expected by PublicationForm
  const formattedServices = professionalServices.map((ps: any) => ({
    id: ps.serviceId,
    name: ps.service.name
  }));

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
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Publication Form Toggle */}
        {canPublish && (
          <div className="border rounded-lg p-4 mb-4">
            {!showPublicationForm ? (
              <div 
                onClick={() => setShowPublicationForm(true)} 
                className="flex items-center gap-3 cursor-pointer"
              >
                <Avatar>
                  <AvatarImage src={user?.profilePicture || undefined} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted rounded-full px-4 py-2 text-muted-foreground hover:bg-muted/80">
                  O que você gostaria de compartilhar?
                </div>
                <Button variant="ghost" size="icon">
                  <Image className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Nova Publicação</h3>
                <PublicationForm 
                  services={formattedServices}
                  onSubmit={handlePublicationSubmit}
                  isLoading={false}
                />
              </div>
            )}
          </div>
        )}

        {/* "Create Professional Profile" Button for users who can't publish yet */}
        {!canPublish && user && (
          <div className="border rounded-lg p-4 mb-4 bg-muted/30">
            <p className="text-sm text-muted-foreground mb-2">
              Para criar publicações, você precisa ter um perfil profissional.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/profile/professional/settings">
                <PlusCircle className="h-4 w-4 mr-2" />
                Criar Perfil Profissional
              </Link>
            </Button>
          </div>
        )}

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
