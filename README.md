# Akadal Chain: Educational Blockchain Environment

This repository contains a simple educational blockchain environment with an Ethereum node, a network explorer, and a faucet for distributing test tokens to students.

## System Components

1. **Ethereum Node (Geth)**: A full-featured EVM-compatible blockchain
2. **Ethereum Network Stats**: A simple explorer to view blockchain activity
3. **Custom Faucet**: A web UI to distribute test ETH to students

## Quick Start

### Prerequisites

- Docker and Docker Compose installed on your system
- At least 2GB RAM, 2 vCPUs, and 40GB SSD storage
- Node.js (for infinite faucet funding)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/akadal-chain.git
   cd akadal-chain
   ```

2. Start the system:
   ```
   # On Windows
   simple-fund.bat
   
   # On Linux/Mac
   ./start.sh
   ```

3. (Optional) Enable infinite faucet funding:
   ```
   # On Windows
   infinite-fund.bat
   
   # On Linux/Mac
   ./infinite-fund.sh
   ```

### Access Points

Once the system is running, you can access the following services:

- **Faucet**: http://localhost:3000
- **Network Explorer**: http://localhost:8080
- **Ethereum RPC**: http://localhost:8545

## Usage Instructions

### For Students

1. **Set up MetaMask with Akadal Chain**
   - Install MetaMask browser extension
   - Open MetaMask and select "Add Network"
   - Enter the network details:
     - Network Name: Akadal Chain
     - RPC URL: http://localhost:8545
     - Chain ID: 1337
     - Currency Symbol: ETH

2. **Request Test ETH**
   - Navigate to the faucet URL (http://localhost:3000)
   - Enter your MetaMask wallet address
   - Click "Request Tokens"
   - Wait for confirmation

3. **Verify Receipt of Tokens**
   - Open MetaMask to see your test ETH balance
   - Check the explorer (http://localhost:8080) to view network activity

4. **Interact with the Chain**
   - Deploy and test smart contracts
   - Execute transactions
   - Use tools like Remix IDE connected to your local node
   - Monitor blockchain activity in the explorer

### For Instructors

1. **Monitor System Status**
   - Check container status: `docker-compose ps`
   - View logs: `docker-compose logs -f [service]`
   - Monitor blockchain activity through the explorer (http://localhost:8080)

2. **Manage Faucet Funds**
   - The faucet is automatically funded during system startup
   - For unlimited funding, run the infinite funding service:
     ```
     # On Windows
     infinite-fund.bat
     
     # On Linux/Mac
     ./infinite-fund.sh
     ```
   - This service will monitor the faucet balance and automatically refill it when needed
   - For manual funding, run:
     ```
     # On Windows
     simple-fund.bat
     
     # On Linux/Mac
     ./fund-faucet.sh
     ```

3. **System Maintenance**
   - Update system: `docker-compose pull && docker-compose up -d`
   - Restart services if necessary: `docker-compose restart [service]`
   - Stop all services: `docker-compose down`
   - Stop and remove volumes: `docker-compose down -v` (caution: this will delete all blockchain data)

## Troubleshooting

### Common Issues

1. **Services not starting**
   - Check logs: `docker-compose logs -f`
   - Ensure you have enough system resources
   - Verify that all required ports are available

2. **Explorer not showing data**
   - It may take a few minutes for the explorer to connect to the Ethereum node
   - Check explorer logs: `docker-compose logs -f explorer`
   - Restart the explorer: `docker-compose restart explorer`

3. **Faucet not sending ETH ("Faucet balance too low" error)**
   - Run the infinite funding service:
     ```
     # On Windows
     infinite-fund.bat
     
     # On Linux/Mac
     ./infinite-fund.sh
     ```
   - Check faucet logs: `docker-compose logs -f faucet`
   - Verify that the Ethereum node is accessible from the faucet container
   - Restart the faucet: `docker-compose restart faucet`

## Cross-Platform Compatibility

This system is designed to work on both Windows and Linux/Mac environments:

- **Windows**: Use the `.bat` files for starting and managing the system
- **Linux/Mac**: Use the `.sh` files for starting and managing the system

The core functionality is identical across platforms, with only the shell scripts differing to accommodate platform-specific requirements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

Created by Assoc. Prof. Dr. Emre Akadal for educational purposes. 