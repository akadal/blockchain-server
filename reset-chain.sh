#!/bin/bash

# Akadal Chain - Daily Reset Script
# This script stops the blockchain, wipes all data, and restarts it.
# Ideally run via cron at 4:00 AM.

# Determine script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "[$(date)] Starting daily blockchain reset..."

# 1. Stop all services
echo "Stopping services..."
docker-compose down

# 2. Remove specific volumes (Chain data and Blockscout DB)
# We preserve configs but strictly wipe state.
echo "Wiping blockchain state..."
docker volume rm blockchain-server_geth-data
docker volume rm blockchain-server_postgres-data

# Note: Adjust volume names if project name is different (defaults to directory name)
# If unsure, we can use `docker volume prune -f` but that might be too aggressive.
# Alternatively, force remove anonymous volumes with down -v
# docker-compose down -v 
# (This is safer/easier as it removes volumes defined in the compose file)

echo "Ensuring clean slate..."
docker-compose down -v

# 3. Pull latest images (optional, good for maintenance)
# echo "Pulling latest images..."
# docker-compose pull

# 4. Start services
echo "Starting services..."
docker-compose up -d

# 5. Wait for health
echo "Waiting for system to behave..."
sleep 30

# 6. Check status
if [ $(docker-compose ps -q | wc -l) -gt 0 ]; then
  echo "[$(date)] Reset successful. System is running."
else
  echo "[$(date)] ERROR: System failed to restart."
  exit 1
fi
