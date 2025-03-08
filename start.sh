#!/bin/bash

echo "Starting Akadal Chain Educational Blockchain Environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Load environment variables
source .env
echo "Using configuration from .env file."
echo "Current HOST_IP setting: ${HOST_IP}"
echo "If you're deploying to a server, make sure to edit the .env file"
echo "and set HOST_IP to your server's public IP address."
echo ""

# Check if HTTPS is enabled
if [ "${ENABLE_HTTPS}" = "true" ]; then
    echo "HTTPS is enabled. Checking for SSL certificates..."
    
    # Check if certificates exist
    if [ ! -f "./certs/server.crt" ] || [ ! -f "./certs/server.key" ]; then
        echo "SSL certificates not found. Generating self-signed certificates..."
        chmod +x generate-certs.sh
        ./generate-certs.sh
    else
        echo "SSL certificates found."
    fi
    
    echo "System will be accessible via HTTPS."
    echo "Note: Self-signed certificates will show security warnings in browsers."
else
    echo "HTTPS is disabled. System will be accessible via HTTP only."
fi

# Start the system
echo "Starting containers..."
docker-compose up -d

# Wait for services to start
echo "Waiting for services to start..."
sleep 10

# Check if services are running
echo "Checking if services are running..."
docker-compose ps

# Fund the faucet directly
echo ""
echo "Funding faucet with ETH..."
echo "This may take a moment..."
echo ""
chmod +x fund-faucet.sh
./fund-faucet.sh

echo ""
echo "Akadal Chain is now running!"
echo "You can access the following services:"

if [ "${ENABLE_HTTPS}" = "true" ]; then
    echo "- Faucet: https://${HOST_IP}:${FAUCET_HTTPS_PORT}"
    echo "- Ethereum Lite Explorer: https://${HOST_IP}:${EXPLORER_HTTPS_PORT}"
    echo "- Blockscout Explorer: https://${HOST_IP}:${BLOCKSCOUT_HTTPS_PORT}"
    echo "- Ethereum RPC: https://${HOST_IP}:${HTTPS_PORT}"
else
    echo "- Faucet: http://${HOST_IP}:${FAUCET_PORT}"
    echo "- Ethereum Lite Explorer: http://${HOST_IP}:${EXPLORER_PORT}"
    echo "- Blockscout Explorer: http://${HOST_IP}:${BLOCKSCOUT_PORT}"
    echo "- Ethereum RPC: http://${HOST_IP}:${ETHEREUM_RPC_PORT}"
fi

echo ""
echo "To enable infinite faucet funding, run: ./infinite-fund.sh"
echo "To stop the system, run: docker-compose down"
echo "" 