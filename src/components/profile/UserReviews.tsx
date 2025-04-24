
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const UserReviews = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Avaliações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          Você ainda não fez nenhuma avaliação
        </div>
      </CardContent>
    </Card>
  );
};
