# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ecbff34e-e381-4d9f-a36d-fddd63d2da3d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ecbff34e-e381-4d9f-a36d-fddd63d2da3d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ecbff34e-e381-4d9f-a36d-fddd63d2da3d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Nova Estrutura de API

A aplicação possui uma estrutura de API modular e otimizada para melhor organização e desempenho:

### Principais Características

- **Estrutura Modular**: Serviços organizados por domínio (appointments, professionals, services, etc.)
- **Cliente HTTP Centralizado**: Cliente Axios com interceptadores para autenticação e refresh token
- **Cache Otimizado**: Diferentes tempos de cache para diferentes tipos de dados
- **Hooks Especializados**: Hooks otimizados para cada tipo de endpoint
- **Tipagem Forte**: Interface bem definidas para todas as entidades
- **Tratamento de Erros Consistente**: Abordagem padronizada para lidar com erros

### Documentação

- **API Requests**: Consulte `docs/api-requests.md` para ver todas as requisições disponíveis
- **Guia de Migração**: Siga `docs/api-migration-guide.md` para migrar componentes da API antiga para a nova estrutura

### Módulos Disponíveis

- `appointments.ts`: Serviços de agendamentos
- `professionals.ts`: Serviços de profissionais
- `services.ts`: Serviços oferecidos
- `categories.ts`: Categorias de serviços
- `companies.ts`: Empresas e estabelecimentos
- `users.ts`: Perfis de usuários e autenticação
- `reviews.ts`: Sistema de avaliações
- `search.ts`: Funcionalidades de busca

## Integração com a API de Reviews

A integração com a API de Reviews foi implementada com sucesso, incluindo os seguintes componentes e funcionalidades:

### Componentes Principais
- **ProfessionalReviewsList**: Exibe as avaliações de um profissional
- **ProfessionalReviewStats**: Mostra estatísticas das avaliações (média, distribuição, etc.)
- **ReviewForm**: Formulário para criação de novas avaliações
- **PendingReviews**: Lista serviços concluídos que ainda não foram avaliados
- **ReviewHistory**: Histórico de avaliações feitas pelo usuário

### Endpoints Implementados
- `fetchReviews`: Busca avaliações com filtros diversos
- `fetchProfessionalReviewsWithStats`: Busca avaliações de profissional com estatísticas detalhadas
- `fetchReviewById`: Busca uma avaliação específica por ID
- `createReview`: Cria uma nova avaliação
- `updateReview`: Atualiza uma avaliação existente
- `deleteReview`: Remove uma avaliação
- `checkAppointmentReviewStatus`: Verifica se um agendamento já foi avaliado

### Melhorias de Robustez
- Tratamento adequado de erros em todos os componentes
- Verificação de componente montado para evitar atualizações de estado em componentes desmontados
- Limitação de tentativas de reconexão para evitar loops infinitos quando a API está offline
- Configuração de cache e staleTime para evitar requisições desnecessárias

### Tipagem
- Tipos bem definidos para todas as entidades relacionadas a avaliações
- Interface Review para representar uma avaliação completa
- Interfaces para estatísticas e distribuição de avaliações
- Tipos para parâmetros de requisição e resposta da API

### Experiência do Usuário
- Feedback visual claro durante carregamento (spinners)
- Mensagens de erro amigáveis quando ocorrem problemas
- Possibilidade de ver avaliações sem necessidade de login
- Formulário intuitivo para criação de avaliações
