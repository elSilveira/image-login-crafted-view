
import { MessageSquare, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const SocialFeed = () => {
  // Temporary mock data - will be replaced with real data later
  const posts = [
    {
      id: 1,
      author: {
        name: "Maria Oliveira",
        avatar: "/placeholder.svg",
        profession: "Cabeleireira"
      },
      content: "Acabei de fazer um curso incrível de colorimetria! Ansiosa para trazer novas técnicas para minhas clientes 💇‍♀️",
      likes: 24,
      comments: 5,
      time: "2h"
    },
    {
      id: 2,
      author: {
        name: "Carlos Santos",
        avatar: "/placeholder.svg",
        profession: "Barbeiro"
      },
      content: "Novo horário de atendimento: Segunda a Sábado das 9h às 20h. Agende seu horário! ✂️",
      likes: 15,
      comments: 3,
      time: "4h"
    }
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Feed de Atualizações</CardTitle>
        <Button variant="outline" className="hover:bg-[#4664EA] hover:text-white">
          Nova Publicação
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="border-b pb-6 last:border-0 hover:bg-gray-50 rounded-lg p-4 transition-colors">
            <div className="flex items-start gap-4">
              <Avatar className="cursor-pointer">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="cursor-pointer hover:text-[#4664EA]">
                    <h4 className="font-semibold">{post.author.name}</h4>
                    <p className="text-sm text-gray-600">{post.author.profession}</p>
                  </div>
                  <span className="text-sm text-gray-500">{post.time}</span>
                </div>
                <p className="mt-2">{post.content}</p>
                <div className="mt-4 flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="hover:text-[#4664EA]">
                    👍 {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:text-[#4664EA]">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:text-[#4664EA]">
                    Agendar Serviço
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
