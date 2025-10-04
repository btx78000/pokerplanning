@echo off
echo ========================================
echo    Planning Poker - Starting Servers
echo ========================================
echo.

:: Check if node_modules exist
if not exist "node_modules\" (
    echo [!] Dependencies not found!
    echo [*] Please run install.bat first
    echo.
    pause
    exit /b 1
)

if not exist "server\node_modules\" (
    echo [!] Server dependencies not found!
    echo [*] Please run install.bat first
    echo.
    pause
    exit /b 1
)

if not exist "client\node_modules\" (
    echo [!] Client dependencies not found!
    echo [*] Please run install.bat first
    echo.
    pause
    exit /b 1
)

echo [*] Starting Backend Server...
start "Planning Poker - Backend" cmd /k "cd server && npm run dev"

timeout /t 2 /nobreak >nul

echo [*] Starting Frontend Client...
start "Planning Poker - Frontend" cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo    Servers Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
echo (Servers will continue running)
pause >nul
