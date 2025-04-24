
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const UserReviews = () => {
  return (
    <Card className="card-shadow">
      <CardHeader className="border-b">
        <CardTitle className="font-playfair text-2xl text-iazi-text">Minhas Avaliações</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center py-8 text-muted-foreground font-lato">
          Você ainda não fez nenhuma avaliação
        </div>
      </CardContent>
    </Card>
  );
};
