#!/bin/bash

# Script para limpeza manual de processos Chrome/ChromeDriver
# Uso: ./cleanup_chrome.sh

echo "🧹 Limpando processos Chrome/ChromeDriver..."

# Verificar processos do Chrome
echo "📋 Verificando processos do Chrome..."
CHROME_PIDS=$(ps aux | grep -i chrome | grep -v grep | awk '{print $2}')

if [ -n "$CHROME_PIDS" ]; then
    echo "🔍 Encontrados processos do Chrome: $CHROME_PIDS"
    
    # Fechar processos do Chrome
    for pid in $CHROME_PIDS; do
        echo "🔄 Fechando processo $pid..."
        kill -TERM $pid 2>/dev/null
        sleep 1
        
        # Se não fechou, forçar com SIGKILL
        if kill -0 $pid 2>/dev/null; then
            echo "⚡ Forçando fechamento do processo $pid..."
            kill -KILL $pid 2>/dev/null
        fi
    done
    
    echo "✅ Processos do Chrome fechados"
else
    echo "ℹ️  Nenhum processo do Chrome encontrado"
fi

# Verificar processos do ChromeDriver
echo "📋 Verificando processos do ChromeDriver..."
CHROMEDRIVER_PIDS=$(ps aux | grep -i chromedriver | grep -v grep | awk '{print $2}')

if [ -n "$CHROMEDRIVER_PIDS" ]; then
    echo "🔍 Encontrados processos do ChromeDriver: $CHROMEDRIVER_PIDS"
    
    # Fechar processos do ChromeDriver
    for pid in $CHROMEDRIVER_PIDS; do
        echo "🔄 Fechando processo $pid..."
        kill -TERM $pid 2>/dev/null
        sleep 1
        
        # Se não fechou, forçar com SIGKILL
        if kill -0 $pid 2>/dev/null; then
            echo "⚡ Forçando fechamento do processo $pid..."
            kill -KILL $pid 2>/dev/null
        fi
    done
    
    echo "✅ Processos do ChromeDriver fechados"
else
    echo "ℹ️  Nenhum processo do ChromeDriver encontrado"
fi

# Verificação final
echo "🔍 Verificação final..."
REMAINING_PROCESSES=$(ps aux | grep -E "(chrome|chromedriver)" | grep -v grep | wc -l)

if [ "$REMAINING_PROCESSES" -eq 0 ]; then
    echo "✅ Limpeza concluída - Nenhum processo Chrome/ChromeDriver rodando"
else
    echo "⚠️  Ainda há $REMAINING_PROCESSES processo(s) rodando:"
    ps aux | grep -E "(chrome|chromedriver)" | grep -v grep
fi

echo "🎉 Limpeza finalizada!"
