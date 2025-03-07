#!/bin/bash

echo "Starting Infinite Faucet Funding Service..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install web3
fi

# Start the auto-fund service
echo "Starting auto-fund service..."
nohup node auto-fund.js > auto-fund.log 2>&1 &

echo ""
echo "Infinite Faucet Funding Service is running in the background."
echo "You can check the logs with: tail -f auto-fund.log"
echo "To stop the service, run: pkill -f 'node auto-fund.js'"
echo "" 