@echo off
echo =========================================
echo Stopping all AskIt Node.js Services...
echo =========================================

:: Force kill all running node.exe processes
taskkill /F /IM node.exe

echo.
echo All Node.js services have been stopped.
echo Press any key to exit...
pause >nul
