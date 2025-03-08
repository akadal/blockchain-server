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

REM Get HOST_IP from .env file
for /f "tokens=2 delims==" %%a in ('findstr /C:"HOST_IP" .env') do set HOST_IP=%%a
REM Get port values from .env file
for /f "tokens=2 delims==" %%a in ('findstr /C:"FAUCET_PORT" .env') do set FAUCET_PORT=%%a
for /f "tokens=2 delims==" %%a in ('findstr /C:"EXPLORER_PORT" .env') do set EXPLORER_PORT=%%a
for /f "tokens=2 delims==" %%a in ('findstr /C:"BLOCKSCOUT_PORT" .env') do set BLOCKSCOUT_PORT=%%a
for /f "tokens=2 delims==" %%a in ('findstr /C:"ETHEREUM_RPC_PORT" .env') do set ETHEREUM_RPC_PORT=%%a
for /f "tokens=2 delims==" %%a in ('findstr /C:"ENABLE_HTTPS" .env') do set ENABLE_HTTPS=%%a
for /f "tokens=2 delims==" %%a in ('findstr /C:"FAUCET_HTTPS_PORT" .env') do set FAUCET_HTTPS_PORT=%%a
for /f "tokens=2 delims==" %%a in ('findstr /C:"EXPLORER_HTTPS_PORT" .env') do set EXPLORER_HTTPS_PORT=%%a
for /f "tokens=2 delims==" %%a in ('findstr /C:"BLOCKSCOUT_HTTPS_PORT" .env') do set BLOCKSCOUT_HTTPS_PORT=%%a
for /f "tokens=2 delims==" %%a in ('findstr /C:"HTTPS_PORT" .env') do set HTTPS_PORT=%%a

echo Using configuration from .env file.
echo Current HOST_IP setting: %HOST_IP%
echo If you're deploying to a server, make sure to edit the .env file
echo and set HOST_IP to your server's public IP address.
echo.

REM Check if HTTPS is enabled
if "%ENABLE_HTTPS%"=="true" (
    echo HTTPS is enabled. Checking for SSL certificates...
    
    REM Check if certificates exist
    if not exist ".\certs\server.crt" (
        echo SSL certificates not found. Generating self-signed certificates...
        call generate-certs.bat
    ) else (
        echo SSL certificates found.
    )
    
    echo System will be accessible via HTTPS.
    echo Note: Self-signed certificates will show security warnings in browsers.
) else (
    echo HTTPS is disabled. System will be accessible via HTTP only.
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

if "%ENABLE_HTTPS%"=="true" (
    echo - Faucet: https://%HOST_IP%:%FAUCET_HTTPS_PORT%
    echo - Ethereum Lite Explorer: https://%HOST_IP%:%EXPLORER_HTTPS_PORT%
    echo - Blockscout Explorer: https://%HOST_IP%:%BLOCKSCOUT_HTTPS_PORT%
    echo - Ethereum RPC: https://%HOST_IP%:%HTTPS_PORT%
) else (
    echo - Faucet: http://%HOST_IP%:%FAUCET_PORT%
    echo - Ethereum Lite Explorer: http://%HOST_IP%:%EXPLORER_PORT%
    echo - Blockscout Explorer: http://%HOST_IP%:%BLOCKSCOUT_PORT%
    echo - Ethereum RPC: http://%HOST_IP%:%ETHEREUM_RPC_PORT%
)

echo.
echo To enable infinite faucet funding, run: infinite-fund.bat
echo To stop the system, run: stop.bat
echo. 