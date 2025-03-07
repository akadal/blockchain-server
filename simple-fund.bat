@echo off
echo Starting Akadal Chain Educational Blockchain Environment...

REM Start the system if not already running
docker-compose up -d

REM Wait for Ethereum node to start
echo Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check if services are running
echo Checking if services are running...
docker-compose ps

REM Fund the faucet account
echo.
echo Funding faucet with ETH...
echo This may take a moment...
echo.
docker exec ethereum-node geth --exec "eth.sendTransaction({from: eth.coinbase, to: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1', value: web3.toWei(1000, 'ether')})" attach http://localhost:8545

echo.
echo Akadal Chain is now running!
echo You can access the following services:
echo - Faucet: http://localhost:3000
echo - Network Explorer: http://localhost:8080
echo - Ethereum RPC: http://localhost:8545
echo.
echo To enable infinite faucet funding, run: infinite-fund.bat
echo To stop the system, run: docker-compose down 