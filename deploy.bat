@echo off
REM Script de Deploy Automático - Fiadumont (Windows)
REM Execute este script na pasta fiadumont-deploy

echo ========================================
echo   Deploy Automático - Fiadumont
echo ========================================
echo.

REM Verificar se está na pasta correcta
if not exist "index.html" (
    echo [ERRO] index.html nao encontrado!
    echo Por favor, execute este script na pasta fiadumont-deploy
    pause
    exit /b 1
)

echo [OK] Pasta correcta detectada
echo.

REM Passo 1: Git Init
echo ========================================
echo Passo 1: Inicializando Git...
echo ========================================
git init
git add .
git commit -m "Fiadumont website - Initial commit"
echo [OK] Git inicializado
echo.

REM Passo 2: Adicionar Remote
echo ========================================
echo Passo 2: Conectando ao GitHub...
echo ========================================
git remote remove origin 2>nul
git remote add origin https://github.com/fiadumontt-web/fiadumont.git
git branch -M main
echo [OK] Remote adicionado
echo.

REM Passo 3: Push para GitHub
echo ========================================
echo Passo 3: Enviando para GitHub...
echo ========================================
git push -u origin main --force
if errorlevel 1 (
    echo [ERRO] Falha no push para GitHub
    echo.
    echo Possiveis solucoes:
    echo 1. Verificar credenciais GitHub
    echo 2. Criar Personal Access Token em:
    echo    GitHub - Settings - Developer settings - Personal access tokens
    echo.
    pause
    exit /b 1
)
echo [OK] Push bem sucedido!
echo.

REM Passo 4: Opções de Deploy
echo ========================================
echo Passo 4: Deploy no Vercel
echo ========================================
echo.
echo Escolha uma opcao:
echo 1) Deploy via Vercel CLI
echo 2) Abrir Vercel.com para deploy manual
echo.
set /p opcao="Opcao (1 ou 2): "

if "%opcao%"=="1" (
    echo.
    echo Verificando Vercel CLI...
    where vercel >nul 2>&1
    if errorlevel 1 (
        echo [AVISO] Vercel CLI nao encontrado. Instalando...
        npm install -g vercel
    )
    
    echo.
    echo Executando deploy...
    vercel --prod
    
    if not errorlevel 1 (
        echo.
        echo ========================================
        echo   DEPLOY COMPLETO!
        echo ========================================
        echo Teu site esta online!
    )
) else (
    echo.
    echo [OK] Codigo enviado para GitHub!
    echo.
    echo Proximos passos:
    echo 1. Ir para: https://vercel.com/new
    echo 2. Selecionar o repositorio: fiadumont
    echo 3. Clicar em Deploy
    echo.
    echo Abrindo Vercel no browser...
    start https://vercel.com/new
)

echo.
echo ========================================
echo   Setup Completo!
echo ========================================
echo.
echo URLs importantes:
echo GitHub: https://github.com/fiadumontt-web/fiadumont
echo Vercel: https://vercel.com/dashboard
echo.
pause
