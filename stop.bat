@echo off
echo ========================================
echo    Planning Poker - Stopping Servers
echo ========================================
echo.

echo [*] Stopping all Node.js processes...
taskkill /F /IM node.exe 2>nul

if errorlevel 1 (
    echo [!] No Node.js processes found running
) else (
    echo [+] All Node.js processes stopped successfully
)

echo.
echo ========================================
echo    Cleanup Complete!
echo ========================================
echo.
pause
