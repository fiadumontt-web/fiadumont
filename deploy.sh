#!/bin/bash

# Script de Deploy Automático - Fiadumont
# Execute este script na pasta fiadumont-deploy

echo "🚀 Iniciando deploy do Fiadumont..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está na pasta correcta
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Erro: index.html não encontrado!${NC}"
    echo "Por favor, execute este script na pasta fiadumont-deploy"
    exit 1
fi

echo -e "${GREEN}✅ Pasta correcta detectada${NC}"
echo ""

# Passo 1: Git Init
echo -e "${YELLOW}📦 Passo 1: Inicializando Git...${NC}"
git init
git add .
git commit -m "Fiadumont website - Initial commit"
echo -e "${GREEN}✅ Git inicializado${NC}"
echo ""

# Passo 2: Adicionar Remote
echo -e "${YELLOW}🔗 Passo 2: Conectando ao GitHub...${NC}"
git remote remove origin 2>/dev/null
git remote add origin https://github.com/fiadumontt-web/fiadumont.git
git branch -M main
echo -e "${GREEN}✅ Remote adicionado${NC}"
echo ""

# Passo 3: Push para GitHub
echo -e "${YELLOW}📤 Passo 3: Enviando para GitHub...${NC}"
git push -u origin main --force
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Push bem sucedido!${NC}"
else
    echo -e "${RED}❌ Erro no push. Verifique suas credenciais GitHub.${NC}"
    echo "Pode precisar de um Personal Access Token"
    echo "GitHub → Settings → Developer settings → Personal access tokens"
    exit 1
fi
echo ""

# Passo 4: Deploy no Vercel
echo -e "${YELLOW}🚀 Passo 4: Deploy no Vercel...${NC}"
echo "Escolha uma opção:"
echo "1) Deploy via Vercel CLI"
echo "2) Abrir Vercel.com para deploy manual"
echo ""
read -p "Opção (1 ou 2): " opcao

if [ "$opcao" = "1" ]; then
    # Verificar se Vercel CLI está instalado
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}⚠️  Vercel CLI não encontrado. Instalando...${NC}"
        npm install -g vercel
    fi
    
    echo ""
    echo -e "${YELLOW}Executando deploy...${NC}"
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}🎉 DEPLOY COMPLETO!${NC}"
        echo "Teu site está online!"
    fi
else
    echo ""
    echo -e "${GREEN}✅ Código enviado para GitHub!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "1. Ir para: https://vercel.com/new"
    echo "2. Selecionar o repositório: fiadumont"
    echo "3. Clicar em Deploy"
    echo ""
    
    # Tentar abrir browser
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "https://vercel.com/new"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "https://vercel.com/new" 2>/dev/null
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        start "https://vercel.com/new"
    fi
fi

echo ""
echo -e "${GREEN}🎊 Setup completo!${NC}"
echo ""
echo "📋 URLs importantes:"
echo "GitHub: https://github.com/fiadumontt-web/fiadumont"
echo "Vercel: https://vercel.com/dashboard"
