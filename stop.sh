#!/bin/bash

echo "Stopping Akadal Chain Educational Blockchain Environment..."

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop the system
echo "Stopping containers..."
docker-compose down

echo ""
echo "Akadal Chain has been stopped."
echo ""
echo "To start the system again, run: ./start.sh"
echo "" 