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

REM Check if .env file exists
if not exist .env (
    echo Creating default .env file...
    (
        echo # Akadal Chain Environment Configuration
        echo.
        echo # Network Configuration
        echo # Use 'localhost' for local development, or your server's IP address for remote access
        echo HOST_IP=localhost
        echo.
        echo # Ports Configuration
        echo ETHEREUM_RPC_PORT=8545
        echo ETHEREUM_WS_PORT=8546
        echo EXPLORER_PORT=8080
        echo BLOCKSCOUT_PORT=4000
        echo FAUCET_PORT=3000
        echo POSTGRES_PORT=5432
        echo.
        echo # Ethereum Node Configuration
        echo NETWORK_ID=1337
        echo.
        echo # Faucet Configuration
        echo ETH_AMOUNT=100
        echo FUND_PRIVATE_KEY=0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
        echo FUND_ADDRESS=0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1
        echo FAUCET_NAME=Akadal Chain Faucet
        echo FAUCET_DESCRIPTION=Blockchain course test tokens
        echo.
        echo # Blockscout Configuration
        echo BLOCKSCOUT_NETWORK_NAME=Akadal Chain
        echo BLOCKSCOUT_SUBNETWORK=Blockchain Course
        echo.
        echo # Creator Information
        echo CREATOR_NAME=Assoc. Prof. Dr. Emre Akadal
        echo CREATOR_URL=https://akadal.tr
    ) > .env
    echo Default .env file created.
) else (
    echo .env file found. Using existing configuration.
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

REM Get HOST_IP from .env file
for /f "tokens=2 delims==" %%a in ('findstr /C:"HOST_IP" .env') do set HOST_IP=%%a
REM Get port values from .env file
for /f "tokens=2 delims==" %%a in ('findstr /C:"FAUCET_PORT" .env') do set FAUCET_PORT=%%a
for /f "tokens=2 delims==" %%a in ('findstr /C:"EXPLORER_PORT" .env') do set EXPLORER_PORT=%%a
for /f "tokens=2 delims==" %%a in ('findstr /C:"BLOCKSCOUT_PORT" .env') do set BLOCKSCOUT_PORT=%%a
for /f "tokens=2 delims==" %%a in ('findstr /C:"ETHEREUM_RPC_PORT" .env') do set ETHEREUM_RPC_PORT=%%a

echo.
echo Akadal Chain is now running!
echo You can access the following services:
echo - Faucet: http://%HOST_IP%:%FAUCET_PORT%
echo - Ethereum Lite Explorer: http://%HOST_IP%:%EXPLORER_PORT%
echo - Blockscout Explorer: http://%HOST_IP%:%BLOCKSCOUT_PORT%
echo - Ethereum RPC: http://%HOST_IP%:%ETHEREUM_RPC_PORT%
echo.
echo To enable infinite faucet funding, run: infinite-fund.bat
echo To stop the system, run: stop.bat
echo.
echo Note: If you're deploying to a server, make sure to edit the .env file
echo and set HOST_IP to your server's public IP address.
echo. 