@echo off
echo ========================================
echo    Planning Poker - Diagnostic
echo ========================================
echo.

echo [*] Checking if Node.js is installed...
node --version
if errorlevel 1 (
    echo [!] Node.js not found!
    pause
    exit /b 1
)
echo.

echo [*] Checking if npm is installed...
npm --version
if errorlevel 1 (
    echo [!] npm not found!
    pause
    exit /b 1
)
echo.

echo [*] Checking if dependencies are installed...
if not exist "node_modules\" (
    echo [!] Root dependencies missing
) else (
    echo [+] Root dependencies OK
)

if not exist "server\node_modules\" (
    echo [!] Server dependencies missing
) else (
    echo [+] Server dependencies OK
)

if not exist "client\node_modules\" (
    echo [!] Client dependencies missing
) else (
    echo [+] Client dependencies OK
)
echo.

echo [*] Checking for running Node.js processes...
tasklist /FI "IMAGENAME eq node.exe" 2>nul | find /I /N "node.exe">nul
if "%ERRORLEVEL%"=="0" (
    echo [!] Node.js processes are running!
    echo [*] You may need to run stop.bat first
    tasklist /FI "IMAGENAME eq node.exe"
) else (
    echo [+] No Node.js processes running
)
echo.

echo [*] Testing backend server connection...
curl -s http://localhost:3001/api/rooms/test >nul 2>&1
if errorlevel 1 (
    echo [!] Backend server is NOT responding on port 3001
    echo [*] Make sure to run start.bat first
) else (
    echo [+] Backend server is responding on port 3001
)
echo.

echo [*] Checking ports...
netstat -ano | findstr ":3001" >nul 2>&1
if errorlevel 1 (
    echo [!] Port 3001 is FREE (backend not running?)
) else (
    echo [+] Port 3001 is IN USE (backend might be running)
    netstat -ano | findstr ":3001"
)
echo.

netstat -ano | findstr ":5173" >nul 2>&1
if errorlevel 1 (
    echo [!] Port 5173 is FREE (frontend not running?)
) else (
    echo [+] Port 5173 is IN USE (frontend might be running)
    netstat -ano | findstr ":5173"
)
echo.

echo ========================================
echo    Diagnostic Complete
echo ========================================
echo.
pause
