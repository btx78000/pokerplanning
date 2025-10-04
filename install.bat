@echo off
echo ========================================
echo    Planning Poker - Installation
echo ========================================
echo.

echo [*] Installing root dependencies...
call npm install
if errorlevel 1 (
    echo [!] Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo [*] Installing server dependencies...
cd server
call npm install
if errorlevel 1 (
    echo [!] Failed to install server dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [*] Installing client dependencies...
cd client
call npm install
if errorlevel 1 (
    echo [!] Failed to install client dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo    Installation Complete!
echo ========================================
echo.
echo You can now run start.bat to launch the app
echo.
pause
