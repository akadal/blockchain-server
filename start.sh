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
echo "- Faucet: http://localhost:3000"
echo "- Network Explorer: http://localhost:8080"
echo "- Ethereum RPC: http://localhost:8545"
echo ""
echo "To enable infinite faucet funding, run: ./infinite-fund.sh"
echo "To stop the system, run: docker-compose down"
echo "" 