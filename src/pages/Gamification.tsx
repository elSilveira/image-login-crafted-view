import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Medal, Star } from "lucide-react";

const Gamification = () => {
  // Mock data - in a real app this would come from the backend
  const achievements = [
    {
      id: 1,
      title: "Primeiros Passos",
      description: "Complete seu primeiro agendamento",
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      completed: true,
      progress: 100,
    },
    {
      id: 2,
      title: "Cliente Fiel",
      description: "Complete 5 agendamentos",
      icon: <Medal className="h-6 w-6 text-blue-500" />,
      completed: false,
      progress: 60,
    },
    {
      id: 3,
      title: "Avaliador Expert",
      description: "Faça 10 avaliações",
      icon: <Award className="h-6 w-6 text-purple-500" />,
      completed: false,
      progress: 30,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F3F2]">
      <Navigation />
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Minhas Conquistas</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={achievement.completed ? "border-green-500" : ""}>
              <CardHeader className="flex flex-row items-center gap-4">
                {achievement.icon}
                <div>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                <Progress value={achievement.progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {achievement.progress}% completo
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gamification;
