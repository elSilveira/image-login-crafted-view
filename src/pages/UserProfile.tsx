
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { UserProfileInfo } from "@/components/profile/UserProfileInfo";
import { UserAddresses } from "@/components/profile/UserAddresses";
import { UserPaymentMethods } from "@/components/profile/UserPaymentMethods";
import { UserNotifications } from "@/components/profile/UserNotifications";
import { UserReviews } from "@/components/profile/UserReviews";
import { UserPrivacy } from "@/components/profile/UserPrivacy";

const UserProfile = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container-padding">
        <h1 className="text-3xl font-bold mb-6 text-iazi-text font-playfair">Meu Perfil</h1>

        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList className="bg-iazi-background-alt border border-iazi-border rounded-lg p-1">
            <TabsTrigger 
              value="personal"
              className="data-[state=active]:bg-white data-[state=active]:text-iazi-primary data-[state=active]:shadow-sm rounded-md px-4 py-2 font-medium"
            >
              Informações Pessoais
            </TabsTrigger>
            <TabsTrigger 
              value="addresses"
              className="data-[state=active]:bg-white data-[state=active]:text-iazi-primary data-[state=active]:shadow-sm rounded-md px-4 py-2 font-medium"
            >
              Endereços
            </TabsTrigger>
            <TabsTrigger 
              value="payments"
              className="data-[state=active]:bg-white data-[state=active]:text-iazi-primary data-[state=active]:shadow-sm rounded-md px-4 py-2 font-medium"
            >
              Pagamento
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="data-[state=active]:bg-white data-[state=active]:text-iazi-primary data-[state=active]:shadow-sm rounded-md px-4 py-2 font-medium"
            >
              Notificações
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="data-[state=active]:bg-white data-[state=active]:text-iazi-primary data-[state=active]:shadow-sm rounded-md px-4 py-2 font-medium"
            >
              Avaliações
            </TabsTrigger>
            <TabsTrigger 
              value="privacy"
              className="data-[state=active]:bg-white data-[state=active]:text-iazi-primary data-[state=active]:shadow-sm rounded-md px-4 py-2 font-medium"
            >
              Privacidade
            </TabsTrigger>
          </TabsList>

          <div className="grid gap-6">
            <TabsContent value="personal">
              <UserProfileInfo />
            </TabsContent>
            <TabsContent value="addresses">
              <UserAddresses />
            </TabsContent>
            <TabsContent value="payments">
              <UserPaymentMethods />
            </TabsContent>
            <TabsContent value="notifications">
              <UserNotifications />
            </TabsContent>
            <TabsContent value="reviews">
              <UserReviews />
            </TabsContent>
            <TabsContent value="privacy">
              <UserPrivacy />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
