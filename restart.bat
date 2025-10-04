@echo off
echo ========================================
echo    Planning Poker - Restarting Servers
echo ========================================
echo.

echo [*] Stopping all Node.js processes...
taskkill /F /IM node.exe 2>nul

if errorlevel 1 (
    echo [!] No processes to stop
) else (
    echo [+] Processes stopped
)

timeout /t 2 /nobreak >nul

echo.
echo [*] Starting Backend Server...
start "Planning Poker - Backend" cmd /k "cd server && npm run dev"

timeout /t 2 /nobreak >nul

echo [*] Starting Frontend Client...
start "Planning Poker - Frontend" cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo    Servers Restarted Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo ** IMPORTANT **
echo In your browser, press Ctrl + Shift + R
echo to hard refresh and clear the cache!
echo.
echo Press any key to close this window...
pause >nul
