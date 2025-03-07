@echo off
echo Starting Infinite Faucet Funding Service...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Install dependencies if needed
if not exist node_modules (
    echo Installing dependencies...
    npm install web3
)

REM Start the auto-fund service
echo Starting auto-fund service...
start "Faucet Auto-Fund Service" cmd /k node auto-fund.js

echo.
echo Infinite Faucet Funding Service is running in a separate window.
echo You can close this window, but keep the other window open to maintain the service.
echo. 