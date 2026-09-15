@echo off
chcp 65001 >nul
setlocal

cd /d "%~dp0"
echo ============================================
echo  Deploy La'Belle Atelie para GitHub + Vercel
echo ============================================
echo.

if not exist .git (
    echo [1/6] Inicializando repositorio git...
    git init
    timeout /t 2 >nul
) else (
    echo [1/6] Repositorio git ja existe.
)

echo [2/6] Configurando usuario git...
git config user.name "victorspotify424-ship-it"
git config user.email "victorspotify424-ship-it@users.noreply.github.com"

echo [3/6] Adicionando todos os arquivos...
git add .

echo [4/6] Criando commit...
git commit -m "Migrate from Lovable to Vercel"
if errorlevel 1 (
    echo.
    echo ERRO: Nao foi possivel criar o commit.
    echo Verifique se o repositorio em https://github.com/victorspotify424-ship-it/isabelle-projeto.git ja existe.
    pause
    exit /b 1
)

echo [5/6] Conectando ao GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/victorspotify424-ship-it/isabelle-projeto.git
git branch -M main

echo [6/6] Enviando para o GitHub...
git push -u origin main
if errorlevel 1 (
    echo.
    echo ERRO no push. Pode ser necessario autenticar no GitHub.
    echo Ao pedir usuario: digite seu usuario GitHub
    echo Ao pedir senha: use um Personal Access Token (Nao a senha da conta)
    pause
    exit /b 1
)

echo.
echo ============================================
echo  PUSH CONCLUIDO COM SUCESSO!
echo ============================================
echo.
echo Proximos passos:
echo 1. Acesse https://vercel.com/new
echo 2. Importe o repositorio isabelle-projeto
echo 3. Clique em Deploy (a Vercel detecta TanStack Start automaticamente)
echo.
pause