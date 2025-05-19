import React from "react";
import Navigation from "@/components/Navigation";
import PendingReviews from "@/components/reviews/PendingReviews";
import ReviewStats from "@/components/reviews/ReviewStats";
import ReviewHistory from "@/components/reviews/ReviewHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReviewsPage = () => {
  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6 w-full">
          <h1 className="text-2xl font-semibold">Avaliações</h1>
          <div className="space-y-6">
            <ReviewStats />
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>
              <TabsContent value="pending">
                <PendingReviews />
              </TabsContent>
              <TabsContent value="history">
                <ReviewHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewsPage;
