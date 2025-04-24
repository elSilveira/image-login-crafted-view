
export const mockNotifications = [
  {
    id: "1",
    type: "appointment",
    title: "Agendamento confirmado",
    description: "Seu agendamento para Limpeza Residencial foi confirmado para amanhã às 14:00",
    date: new Date(2024, 3, 25, 10, 30),
    isRead: false,
    actionLabel: "Ver detalhes",
    actionUrl: "/booking/123"
  },
  {
    id: "2",
    type: "system",
    title: "Atualização do perfil",
    description: "Suas informações de perfil foram atualizadas com sucesso",
    date: new Date(2024, 3, 24, 15, 45),
    isRead: true
  },
  {
    id: "3",
    type: "promotion",
    title: "Oferta especial",
    description: "Aproveite 20% de desconto em serviços de jardinagem esta semana",
    date: new Date(2024, 3, 24, 9, 0),
    isRead: false,
    actionLabel: "Ver oferta",
    actionUrl: "/services/gardening"
  }
] as const;
