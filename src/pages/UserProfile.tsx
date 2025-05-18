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
    <div className="min-h-screen bg-[#F4F3F2]">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>

        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList className="bg-muted w-full justify-start whitespace-nowrap">
            <TabsTrigger value="personal" className="min-w-[150px]">
              Informações Pessoais
            </TabsTrigger>
            <TabsTrigger value="addresses" className="min-w-[100px]">
              Endereços
            </TabsTrigger>
            <TabsTrigger value="payments" className="min-w-[100px]">
              Pagamento
            </TabsTrigger>
            <TabsTrigger value="notifications" className="min-w-[120px]">
              Notificações
            </TabsTrigger>
            <TabsTrigger value="reviews" className="min-w-[100px]">
              Avaliações
            </TabsTrigger>
            <TabsTrigger value="privacy" className="min-w-[100px]">
              Privacidade
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
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
