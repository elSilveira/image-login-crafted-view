
import { MessageSquare, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const SocialFeed = () => {
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
        <Button variant="outline" className="hover:bg-[#4664EA] hover:text-white" asChild>
          <Link to="/profile">Nova Publicação</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
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
