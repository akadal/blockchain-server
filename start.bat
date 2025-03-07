@echo off
echo Starting Akadal Chain Educational Blockchain Environment...

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if Docker Compose is installed
where docker-compose >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Start the system
echo Starting containers...
docker-compose up -d

REM Wait for services to start
echo Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check if services are running
echo Checking if services are running...
docker-compose ps

REM Fund the faucet directly
echo.
echo Funding faucet with ETH...
echo This may take a moment...
echo.
call fund-faucet.bat

echo.
echo Akadal Chain is now running!
echo You can access the following services:
echo - Faucet: http://localhost:3000
echo - Ethereum RPC: http://localhost:8545
echo.
echo To test the system, run: npm test
echo To stop the system, run: stop.bat
echo. 