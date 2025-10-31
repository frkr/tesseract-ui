#!/bin/bash

# Script para limpeza de processos usando a porta 5173 (Svelte dev server)
# Uso: ./cleanup_port_5173.sh

echo "🧹 Limpando processos na porta 5173..."

# Verificar processos usando a porta 5173
echo "📋 Verificando processos na porta 5173..."
PORT_PIDS=$(lsof -ti :5173 2>/dev/null)

if [ -n "$PORT_PIDS" ]; then
    echo "🔍 Encontrados processos na porta 5173: $PORT_PIDS"
    
    # Fechar processos na porta
    for pid in $PORT_PIDS; do
        echo "🔄 Fechando processo $pid..."
        kill -TERM $pid 2>/dev/null
        sleep 1
        
        # Se não fechou, forçar com SIGKILL
        if kill -0 $pid 2>/dev/null; then
            echo "⚡ Forçando fechamento do processo $pid..."
            kill -KILL $pid 2>/dev/null
        fi
    done
    
    echo "✅ Processos na porta 5173 fechados"
else
    echo "ℹ️  Nenhum processo encontrado usando a porta 5173"
fi

# Verificação final
echo "🔍 Verificação final..."
REMAINING_PROCESSES=$(lsof -ti :5173 2>/dev/null | wc -l)

if [ "$REMAINING_PROCESSES" -eq 0 ]; then
    echo "✅ Limpeza concluída - Porta 5173 está livre"
else
    echo "⚠️  Ainda há $REMAINING_PROCESSES processo(s) usando a porta 5173:"
    lsof -i :5173
fi

echo "🎉 Limpeza finalizada!"
