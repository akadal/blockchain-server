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

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating default .env file..."
    cat > .env << EOL
# Akadal Chain Environment Configuration

# Network Configuration
# Use 'localhost' for local development, or your server's IP address for remote access
HOST_IP=localhost

# Ports Configuration
ETHEREUM_RPC_PORT=8545
ETHEREUM_WS_PORT=8546
EXPLORER_PORT=8080
BLOCKSCOUT_PORT=4000
FAUCET_PORT=3000
POSTGRES_PORT=5432

# Ethereum Node Configuration
NETWORK_ID=1337

# Faucet Configuration
ETH_AMOUNT=100
FUND_PRIVATE_KEY=0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
FUND_ADDRESS=0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1
FAUCET_NAME=Akadal Chain Faucet
FAUCET_DESCRIPTION=Blockchain course test tokens

# Blockscout Configuration
BLOCKSCOUT_NETWORK_NAME=Akadal Chain
BLOCKSCOUT_SUBNETWORK=Blockchain Course

# Creator Information
CREATOR_NAME=Assoc. Prof. Dr. Emre Akadal
CREATOR_URL=https://akadal.tr
EOL
    echo "Default .env file created."
else
    echo ".env file found. Using existing configuration."
fi

# Load environment variables
source .env

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
echo "- Faucet: http://${HOST_IP}:${FAUCET_PORT}"
echo "- Ethereum Lite Explorer: http://${HOST_IP}:${EXPLORER_PORT}"
echo "- Blockscout Explorer: http://${HOST_IP}:${BLOCKSCOUT_PORT}"
echo "- Ethereum RPC: http://${HOST_IP}:${ETHEREUM_RPC_PORT}"
echo ""
echo "To enable infinite faucet funding, run: ./infinite-fund.sh"
echo "To stop the system, run: docker-compose down"
echo ""
echo "Note: If you're deploying to a server, make sure to edit the .env file"
echo "and set HOST_IP to your server's public IP address."
echo "" 