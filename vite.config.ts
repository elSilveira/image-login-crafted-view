import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { copyFileSync } from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    {
      name: 'copy-redirects',
      closeBundle() {
        // Copiar o arquivo _redirects para o diretório de build
        copyFileSync(
          path.resolve(__dirname, 'public/_redirects'),
          path.resolve(__dirname, 'dist/_redirects')
        );
        console.log('✅ Arquivo _redirects copiado para a pasta dist');
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Uncomment to use test-main.tsx for debugging
  // build: {
  //   rollupOptions: {
  //     input: {
  //       main: path.resolve(__dirname, 'index.html'),
  //     },
  //   },
  // },
}));
