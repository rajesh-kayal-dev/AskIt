@echo off
echo Starting Auth Service...
start cmd /k "cd services\auth && npm run dev"

timeout /t 2 >nul

echo Starting Chat Service...
start cmd /k "cd services\chat && npm run dev"

timeout /t 2 >nul

echo Starting Agent Service...
start cmd /k "cd services\agent && npm run dev"

echo All services are starting up!
