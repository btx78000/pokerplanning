@echo off
echo ========================================
echo    Planning Poker - Clean Restart
echo ========================================
echo.

echo [*] Killing ALL Node.js processes...
taskkill /F /IM node.exe 2>nul
if errorlevel 1 (
    echo [!] No Node.js processes found
) else (
    echo [+] All Node.js processes killed
)

timeout /t 2 /nobreak >nul

echo.
echo [*] Cleaning port 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do (
    echo [*] Killing process on port 3001 (PID: %%a)
    taskkill /F /PID %%a 2>nul
)

echo [*] Cleaning port 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173"') do (
    echo [*] Killing process on port 5173 (PID: %%a)
    taskkill /F /PID %%a 2>nul
)

timeout /t 2 /nobreak >nul

echo.
echo [*] Starting Backend Server...
start "Planning Poker - Backend" cmd /k "cd /d "%~dp0server" && echo Starting backend... && npm run dev"

timeout /t 5 /nobreak >nul

echo [*] Starting Frontend Client...
start "Planning Poker - Frontend" cmd /k "cd /d "%~dp0client" && echo Starting frontend... && npm run dev"

echo.
echo ========================================
echo    Clean Restart Complete!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo ** IMPORTANT STEPS **
echo 1. Wait 10 seconds for servers to fully start
echo 2. Open browser to http://localhost:5173
echo 3. Press Ctrl + Shift + R to hard refresh
echo 4. Check console for "Connected to server" message
echo.
echo Press any key to close this window...
pause >nul
