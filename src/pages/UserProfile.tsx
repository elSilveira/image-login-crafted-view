
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { UserProfileInfo } from "@/components/profile/UserProfileInfo";
import { UserAddresses } from "@/components/profile/UserAddresses";
import { UserPaymentMethods } from "@/components/profile/UserPaymentMethods";
import { UserNotifications } from "@/components/profile/UserNotifications";
import { UserReviews } from "@/components/profile/UserReviews";
import { UserPrivacy } from "@/components/profile/UserPrivacy";
import { UserProfessionalInfo } from "@/components/profile/UserProfessionalInfo";
import { useLocation } from "react-router-dom";

const UserProfile = () => {
  const location = useLocation();
  const isProfessionalProfile = location.pathname === "/profile/professional";
  const defaultTab = isProfessionalProfile ? "professional" : "personal";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {isProfessionalProfile ? "Perfil Profissional" : "Meu Perfil"}
        </h1>

        <Tabs defaultValue={defaultTab} className="space-y-4">
          <TabsList className="bg-muted w-full justify-start overflow-x-auto">
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
            <TabsTrigger value="professional" className="min-w-[120px]">
              Profissional
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
            <TabsContent value="professional">
              <UserProfessionalInfo />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
