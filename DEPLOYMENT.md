# Guia de Deployment - Dashboard Profissional Iazi

Este guia contém instruções para fazer o deployment do dashboard profissional em diferentes plataformas.

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta na plataforma de deploy escolhida

## Configuração das Variáveis de Ambiente

Antes do deployment, configure as seguintes variáveis de ambiente:

```env
VITE_API_URL=https://api.iazi.com.br
VITE_APP_NAME=Iazi Professional Dashboard
VITE_APP_VERSION=1.0.0
NODE_ENV=production
PORT=4173
```

## Opções de Deployment

### 1. Railway (Recomendado)

Railway oferece duas opções de deployment:

#### **Opção A: Docker (Padrão - Mais Estável)**
Usa o arquivo `railway.json` (já configurado)

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Inicializar projeto
railway init

# 4. Deploy
railway deploy
```

**Vantagens:**
- Mais estável e previsível
- Usa Nginx otimizado
- Menor uso de recursos
- Health check configurado

#### **Opção B: Nixpacks (Alternativa)**
Para usar esta opção, renomeie os arquivos:

```bash
# Trocar para Nixpacks
mv railway.json railway.docker.json
mv railway.nixpacks.json railway.json
railway deploy
```

**Vantagens:**
- Deployment mais rápido
- Menos configuração
- Detecção automática de dependências

### Configurar Variáveis de Ambiente no Railway:

No dashboard do Railway, adicione:

```
VITE_API_URL=https://api.iazi.com.br
VITE_APP_NAME=Iazi Professional Dashboard
NODE_ENV=production
```

### 2. Vercel

#### Passos para Vercel:

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   npm run deploy:vercel
   ```

3. **Configurar variáveis de ambiente no dashboard do Vercel:**
   - VITE_API_URL
   - VITE_APP_NAME
   - NODE_ENV

### 3. Netlify

#### Passos para Netlify:

1. **Instalar Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build e deploy:**
   ```bash
   npm run build
   npm run deploy:netlify
   ```

### 4. Docker

#### Para ambientes containerizados:

1. **Build da imagem:**
   ```bash
   npm run docker:build
   ```

2. **Executar container:**
   ```bash
   npm run docker:run
   ```

3. **Para produção com docker-compose:**
   ```bash
   docker-compose up -d
   ```

### 5. AWS com Runway CLI

Se você quiser usar o Runway CLI para AWS:

1. **Instalar Runway:**
   ```bash
   pip install runway
   ```

2. **Configurar runway.yml** (já incluído no projeto)

3. **Deploy:**
   ```bash
   runway deploy
   ```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Docker
npm run docker:build
npm run docker:run

# Deploy
npm run deploy:railway
npm run deploy:vercel
npm run deploy:netlify
```

## Configurações de Build

### Vite Build
- **Comando de build:** `npm run build`
- **Diretório de saída:** `dist/`
- **Assets estáticos:** Otimizados automaticamente

### Docker Build
- **Base image:** `node:18-alpine`
- **Nginx:** Para servir os arquivos estáticos
- **Porta:** 80 (interno), mapeado para 3000

## Monitoramento e Health Checks

- **Health check endpoint:** `/health`
- **Logs:** Disponíveis através do dashboard da plataforma
- **Métricas:** Configuradas automaticamente

## Troubleshooting

### Problemas Comuns:

1. **Build falha:**
   - Verificar versão do Node.js (deve ser 18+)
   - Verificar se todas as dependências estão instaladas
   - Verificar variáveis de ambiente

2. **Aplicação não carrega:**
   - Verificar se as variáveis de ambiente estão configuradas
   - Verificar logs da aplicação
   - Verificar configuração do nginx (se usando Docker)

3. **API não funciona:**
   - Verificar VITE_API_URL
   - Verificar CORS no backend
   - Verificar conectividade de rede

4. **Railway: "npm command not found":**
   - Usar a configuração Docker (railway.json atual)
   - Ou trocar para Nixpacks (railway.nixpacks.json)

## Configuração de CI/CD

Para automatizar o deployment, configure os workflows do GitHub Actions ou GitLab CI usando os scripts já disponíveis no `package.json`.

## Segurança

- Todas as configurações incluem headers de segurança
- HTTPS é obrigatório em produção
- Variáveis sensíveis devem ser configuradas no dashboard da plataforma
- Never commit `.env` files to version control

## Arquivos de Configuração

- `railway.json` - Railway com Docker (padrão)
- `railway.nixpacks.json` - Railway com Nixpacks (alternativa)
- `Dockerfile` - Container Docker
- `nginx.conf` - Configuração Nginx
- `docker-compose.yml` - Docker Compose
- `runway.yml` - AWS Runway
- `vercel.json` - Vercel (já existente)

## Suporte

Para suporte com o deployment, consulte:
- Documentação da plataforma escolhida
- Logs da aplicação
- README.md principal do projeto 