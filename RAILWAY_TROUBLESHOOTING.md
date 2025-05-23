# Railway Troubleshooting - "npm command not found"

## 🚨 Problema: The executable `npm` could not be found

### Causa:
O Railway está tentando executar `npm start` automaticamente porque detecta um projeto Node.js, mesmo quando usando Docker que não tem npm no container final.

### ✅ Soluções Implementadas:

#### 1. **Dockerfile Específico (`Dockerfile.railway`)**
- Container final apenas com Nginx
- Comando explícito: `ENTRYPOINT ["nginx"]`
- Sem Node.js/npm no container final

#### 2. **railway.json Atualizado**
```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile.railway"
  },
  "ignoreStartCommand": true
}
```

#### 3. **Procfile**
- Define comando web explícito
- Força uso apenas do nginx

#### 4. **Arquivo .nixpacks.toml**
- Desabilita auto-install
- Força uso do Docker

### 🚀 Para Fazer o Deploy:

1. **Certifique-se que os arquivos estão atualizados:**
   ```bash
   git add .
   git commit -m "fix: railway deployment configuration"
   git push
   ```

2. **Deploy no Railway:**
   ```bash
   railway deploy
   ```

### 🔍 Verificar se está funcionando:

1. **Logs do Railway:**
   - Deve mostrar apenas logs do nginx
   - Não deve tentar executar npm

2. **Health Check:**
   - Teste: `https://sua-app.up.railway.app/health`
   - Deve retornar: `healthy`

3. **Aplicação:**
   - Teste: `https://sua-app.up.railway.app`
   - Deve carregar o dashboard

### 🛠️ Se ainda não funcionar:

#### Opção A: Usar Nixpacks
```bash
mv railway.json railway.docker.json
mv railway.nixpacks.json railway.json
railway deploy
```

#### Opção B: Verificar configurações
1. No dashboard Railway > Settings
2. Verificar se não há comando personalizado configurado
3. Limpar qualquer comando start manual

#### Opção C: Deploy manual
```bash
# Build local e push para registry
docker build -f Dockerfile.railway -t sua-imagem .
docker tag sua-imagem registry.railway.app/projeto/imagem
docker push registry.railway.app/projeto/imagem
```

### 📋 Checklist de Verificação:

- [ ] `Dockerfile.railway` existe e está correto
- [ ] `railway.json` aponta para `Dockerfile.railway`
- [ ] `ignoreStartCommand: true` no railway.json
- [ ] Procfile criado com comando nginx
- [ ] `.nixpacks.toml` criado
- [ ] Git atualizado com as mudanças
- [ ] Deploy realizado após as mudanças

### 🎯 Resultado Esperado:

```
=========================
Build completed successfully
=========================

=========================
Container started successfully
=========================

nginx: ready to accept connections
```

### 📞 Se nada funcionar:

Use a **Opção Nixpacks** que é mais simples:
```bash
mv railway.json railway.docker.json
mv railway.nixpacks.json railway.json
railway deploy
```

Esta opção usa Node.js nativo no Railway e é mais compatível. 