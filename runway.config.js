// Configuração para deploy em diferentes plataformas
// Projeto: Dashboard Profissional - Iazi

const config = {
  // Configuração base do projeto
  project: {
    name: "iazi-professional-dashboard",
    description: "Dashboard profissional para gerenciamento de agendamentos e serviços",
    version: "1.0.0",
    framework: "react-vite"
  },

  // Configuração de build
  build: {
    command: "npm run build",
    directory: "dist",
    environment: {
      NODE_VERSION: "18",
      NPM_VERSION: "9"
    }
  },

  // Configuração para Vercel
  vercel: {
    framework: "vite",
    buildCommand: "npm run build",
    outputDirectory: "dist",
    installCommand: "npm install",
    devCommand: "npm run dev",
    functions: {
      "src/api/*.ts": {
        runtime: "nodejs18.x"
      }
    },
    env: {
      VITE_API_URL: "https://iazi.up.railway.app/api",
      VITE_APP_NAME: "Iazi Professional Dashboard"
    },
    headers: [
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*"
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS"
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization"
          }
        ]
      }
    ]
  },

  // Configuração para Netlify
  netlify: {
    command: "npm run build",
    publish: "dist",
    functions: "netlify/functions",
    environment: {
      VITE_API_URL: "https://iazi.up.railway.app/api",
      VITE_APP_NAME: "Iazi Professional Dashboard"
    },
    redirects: [
      {
        from: "/api/*",
        to: "https://iazi.up.railway.app/api/:splat",
        status: 200
      },
      {
        from: "/*",
        to: "/index.html",
        status: 200
      }
    ]
  },

  // Configuração para Railway
  railway: {
    buildCommand: "npm run build",
    startCommand: "npm run preview",
    environment: {
      NODE_ENV: "production",
      VITE_API_URL: "https://iazi.up.railway.app/api",
      VITE_APP_NAME: "Iazi Professional Dashboard"
    },
    healthcheckPath: "/",
    port: 4173
  },

  // Configuração para AWS (usando Runway CLI)
  aws: {
    region: "us-east-1",
    s3Bucket: "iazi-dashboard-static",
    cloudFrontDistribution: true,
    environment: {
      VITE_API_URL: "https://iazi.up.railway.app/api",
      VITE_APP_NAME: "Iazi Professional Dashboard"
    }
  }
};

module.exports = config; 