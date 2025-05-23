#!/bin/sh

# Script de health check para diagnosticar problemas

echo "=== Health Check Debug ==="
echo "Data: $(date)"

# Verificar se nginx está rodando
echo "Verificando processo nginx..."
if pgrep nginx > /dev/null; then
    echo "✓ Nginx está rodando"
else
    echo "✗ Nginx não está rodando"
    exit 1
fi

# Verificar se a porta 80 está ouvindo
echo "Verificando porta 80..."
if netstat -tlnp 2>/dev/null | grep :80 > /dev/null; then
    echo "✓ Porta 80 está ouvindo"
else
    echo "✗ Porta 80 não está ouvindo"
    exit 1
fi

# Testar o endpoint de health
echo "Testando endpoint /health..."
response=$(curl -f --connect-timeout 5 --max-time 10 -s http://localhost/health 2>&1)
curl_exit_code=$?

if [ $curl_exit_code -eq 0 ]; then
    echo "✓ Health endpoint respondeu: $response"
    exit 0
else
    echo "✗ Health endpoint falhou (exit code: $curl_exit_code)"
    echo "Resposta: $response"
    
    # Tentar testar a página principal
    echo "Testando página principal..."
    main_response=$(curl -f --connect-timeout 5 --max-time 10 -s http://localhost/ 2>&1)
    main_exit_code=$?
    
    if [ $main_exit_code -eq 0 ]; then
        echo "✓ Página principal funciona"
    else
        echo "✗ Página principal também falha (exit code: $main_exit_code)"
        echo "Resposta: $main_response"
    fi
    
    exit 1
fi 