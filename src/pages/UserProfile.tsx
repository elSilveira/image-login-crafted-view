
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfileInfo } from "@/components/profile/UserProfileInfo";
import { UserAddresses } from "@/components/profile/UserAddresses";
import { UserPaymentMethods } from "@/components/profile/UserPaymentMethods";
import { UserNotifications } from "@/components/profile/UserNotifications";
import { UserReviews } from "@/components/profile/UserReviews";
import { UserPrivacy } from "@/components/profile/UserPrivacy";
import { PageContainer } from "@/components/ui/page-container";
import { UserRound } from "lucide-react";

const UserProfile = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <PageContainer>
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <UserRound className="h-6 w-6 text-iazi-primary" />
              <h1 className="text-2xl font-semibold">Meu Perfil</h1>
            </div>

            <Tabs defaultValue="personal" className="space-y-4">
              <div className="bg-card rounded-md shadow-sm border border-iazi-border">
                <TabsList className="w-full justify-start p-1 bg-muted/20 border-b border-border rounded-t-md rounded-b-none">
                  <TabsTrigger value="personal" className="rounded-sm">
                    Informações Pessoais
                  </TabsTrigger>
                  <TabsTrigger value="addresses" className="rounded-sm">
                    Endereços
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="rounded-sm">
                    Pagamento
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="rounded-sm">
                    Notificações
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-sm">
                    Avaliações
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="rounded-sm">
                    Privacidade
                  </TabsTrigger>
                </TabsList>

                <div className="p-4">
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
              </div>
            </Tabs>
          </div>
        </PageContainer>
      </div>
    </div>
  );
};

export default UserProfile;
