```markdown
# Product Requirements Document (PRD)
# Akadal Chain: Educational Blockchain Environment

## Version 1.0
**Last Updated:** March 7, 2025
**Author:** Assoc. Prof. Dr. Emre Akadal

## 1. Introduction

### 1.1 Purpose
This document outlines the requirements and specifications for Akadal Chain, an educational blockchain environment designed for teaching blockchain concepts and development. The system provides a fully functional Ethereum-compatible blockchain, a block explorer, and a faucet for distributing test tokens to students.

### 1.2 Scope
Akadal Chain is an all-in-one blockchain learning environment that allows students to:
- Interact with a live blockchain
- Deploy and test smart contracts
- Explore transactions and blocks visually
- Obtain test ETH for development purposes
- Learn blockchain concepts through hands-on experience

### 1.3 Target Audience
- University students in blockchain courses
- Instructors teaching blockchain technology
- Educational institutions offering blockchain programs
- Self-learners exploring blockchain development

## 2. System Overview

### 2.1 Architecture
Akadal Chain consists of three main components deployed on a single VPS server using Docker:

1. **Ethereum Node (Geth)**: Provides the core blockchain functionality with EVM support
2. **BlockScout Explorer**: Delivers visual blockchain exploration capabilities
3. **Custom Faucet**: Facilitates distribution of test ETH to students

All components are containerized using Docker and orchestrated with Docker Compose for simplified deployment and management.

### 2.2 Technical Stack
- **Blockchain**: Go Ethereum (Geth) with Proof of Authority consensus
- **Explorer**: BlockScout
- **Faucet**: Custom-built Node.js application
- **Deployment**: Docker + Docker Compose
- **Infrastructure**: Single VPS (recommended 2GB RAM, 2 CPU, 40GB SSD)
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express

## 3. Detailed Requirements

### 3.1 Ethereum Node Requirements

#### 3.1.1 Core Functionality
- Run a full-featured EVM-compatible blockchain
- Support standard Ethereum JSON-RPC API
- Configure as a development chain with instant blocks
- Pre-fund development accounts with test ETH
- Enable WebSocket connections for real-time updates
- Set custom network ID (1337) for easy wallet configuration

#### 3.1.2 Configuration Parameters
- HTTP RPC enabled on port 8545
- WebSocket RPC enabled on port 8546
- P2P networking on port 30303
- Custom chain ID: 1337
- Dev mode with periodic block creation
- Unlocked accounts for simplified testing
- Mining enabled with single thread

#### 3.1.3 Data Persistence
- Store blockchain data in Docker volume
- Maintain state between restarts
- Allow for data backup and restoration

### 3.2 BlockScout Explorer Requirements

#### 3.2.1 Core Functionality
- Provide a web interface to explore blockchain data
- Display blocks, transactions, and accounts
- Show smart contract verification and interaction
- Support token tracking and transfers
- Offer real-time blockchain statistics
- Enable transaction searching and filtering

#### 3.2.2 Configuration Parameters
- Connect to the Ethereum node via RPC
- Run on port 4000
- Use PostgreSQL for data storage
- Configure custom branding (Akadal Chain)
- Set up with appropriate network information

#### 3.2.3 User Interface Elements
- Dashboard with network statistics
- Block explorer with detailed views
- Transaction viewer with decoded inputs
- Address pages with balance and transaction history
- Token pages with transfers and holders
- Smart contract verification and interaction

### 3.3 Faucet Requirements

#### 3.3.1 Core Functionality
- Distribute test ETH to student wallet addresses
- Provide a simple web interface for requesting funds
- Display network information and connection details
- Offer educational information about the test network
- Allow unlimited requests from the same wallet address
- Support high volume of requests from a class of 200+ students

#### 3.3.2 User Interface Elements
- Clean, modern design with responsive layout
- Wallet address input field with validation
- "Request Tokens" button with clear status indicators
- Network information display (RPC URL, Chain ID, etc.)
- Educational warnings about test networks
- Network configuration instructions for MetaMask
- Footer with creator attribution and links

#### 3.3.3 API Endpoints
- `/api/info` - GET endpoint for network information
- `/api/send` - POST endpoint for requesting tokens

#### 3.3.4 Configuration Parameters
- Default distribution amount: 100 ETH per request
- RPC connection to Ethereum node
- Explorer URL for transaction links
- Customizable faucet name, description, and branding
- Configurable private key for the funding account

### 3.4 Integration Requirements

#### 3.4.1 Inter-component Communication
- Faucet connects to Ethereum node via RPC
- BlockScout connects to Ethereum node via RPC
- Faucet links to BlockScout for transaction verification

#### 3.4.2 External Tool Compatibility
- Support MetaMask wallet connection
- Compatible with Remix IDE for smart contract development
- Work with Truffle, Hardhat, and other development frameworks
- Support standard Ethereum libraries (web3.js, ethers.js)

## 4. Deployment Specifications

### 4.1 Server Requirements
- Linux-based VPS (Ubuntu 20.04 LTS or newer recommended)
- Minimum: 2GB RAM, 2 vCPUs, 40GB SSD
- Recommended for 200+ students: 4GB RAM, 4 vCPUs, 80GB SSD
- Docker and Docker Compose installed
- Open ports: 3000, 4000, 8545, 8546, 30303

### 4.2 Docker Compose Configuration
- Single docker-compose.yml file for all components
- Volume configuration for data persistence
- Container networking setup
- Environment variable configuration
- Health checks and restart policies

### 4.3 Installation Process
1. Set up VPS with Docker and Docker Compose
2. Create project directory structure
3. Configure the docker-compose.yml file
4. Create faucet application files
5. Launch the system with `docker-compose up -d`
6. Verify all services are running correctly
7. Provide access to students

## 5. Docker Compose Configuration

```yaml
version: '3.8'

services:
  # Ethereum Node - Fast dev chain with preloaded ETH
  ethereum:
    image: ethereum/client-go:latest
    container_name: ethereum-node
    restart: always
    command:
      - --dev
      - --dev.period=1
      - --http
      - --http.addr=0.0.0.0
      - --http.api=eth,net,web3,personal,miner,admin,debug,txpool
      - --http.corsdomain=*
      - --http.vhosts=*
      - --ws
      - --ws.addr=0.0.0.0
      - --ws.api=eth,net,web3,personal,miner,admin,debug,txpool
      - --ws.origins=*
      - --allow-insecure-unlock
      - --unlock=0
      - --password=/dev/null
      - --mine
      - --miner.threads=1
      - --miner.etherbase=0x0000000000000000000000000000000000000001
      - --networkid=1337
    ports:
      - "8545:8545"  # HTTP RPC
      - "8546:8546"  # WS RPC
      - "30303:30303"  # P2P
    volumes:
      - geth-data:/root/.ethereum
      
  # Database for BlockScout Explorer
  postgres:
    image: postgres:14-alpine
    container_name: postgres
    restart: always
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_USER: postgres
      POSTGRES_DB: blockscout
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  # BlockScout Explorer - Ethereum Block Explorer
  blockscout:
    image: blockscout/blockscout:latest
    container_name: blockscout
    restart: always
    depends_on:
      - ethereum
      - postgres
    environment:
      ETHEREUM_JSONRPC_VARIANT: 'geth'
      ETHEREUM_JSONRPC_HTTP_URL: http://ethereum:8545
      ETHEREUM_JSONRPC_WS_URL: ws://ethereum:8546
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/blockscout
      ECTO_USE_SSL: 'false'
      SECRET_KEY_BASE: "56NtB48ear7+wMSf0IQuWDAAazhpb31qyc7GiyspBP2vh7t5zlCsF5QDv76chXeN"
      PORT: 4000
      COIN: "ETH"
      NETWORK: "Akadal Chain"
      SUBNETWORK: "Blockchain Course"
      LOGO: "/images/blockscout_logo.svg"
      CHAIN_ID: 1337
    ports:
      - "4000:4000"
      
  # Faucet - Web UI to distribute test ETH to students
  faucet:
    build:
      context: ./faucet
      dockerfile: Dockerfile
    container_name: eth-faucet
    restart: always
    environment:
      NODE_ENV: production
      RPC_URL: http://ethereum:8545
      CHAIN_ID: 1337
      EXPLORER_URL: http://blockscout:4000
      PORT: 3000
      ETH_AMOUNT: "100"
      FUND_PRIVATE_KEY: "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
      FUND_ADDRESS: "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"
      FAUCET_NAME: "Akadal Chain Faucet"
      FAUCET_DESCRIPTION: "Blockchain course test tokens"
      CREATOR_NAME: "Assoc. Prof. Dr. Emre Akadal"
      CREATOR_URL: "https://akadal.tr"
    ports:
      - "3000:3000"
    depends_on:
      - ethereum

volumes:
  geth-data:
  postgres-data:
```

## 6. Faucet Implementation

### 6.1 Dockerfile

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY index.js .
COPY public ./public

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]
```

### 6.2 package.json

```json
{
  "name": "akadal-faucet",
  "version": "1.0.0",
  "description": "Akadal Chain Faucet for Blockchain Course",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.1",
    "web3": "^1.8.1",
    "cors": "^2.8.5"
  }
}
```

### 6.3 index.js

```javascript
const express = require('express');
const Web3 = require('web3');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Environment variables with defaults
const rpcUrl = process.env.RPC_URL || 'http://ethereum:8545';
const chainId = process.env.CHAIN_ID || '1337';
const explorerUrl = process.env.EXPLORER_URL || 'http://localhost:4000';
const ethAmount = process.env.ETH_AMOUNT || '100';
const privateKey = process.env.FUND_PRIVATE_KEY || '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d';
const faucetName = process.env.FAUCET_NAME || 'Akadal Chain Faucet';
const faucetDesc = process.env.FAUCET_DESCRIPTION || 'Blockchain course test tokens';
const creatorName = process.env.CREATOR_NAME || 'Assoc. Prof. Dr. Emre Akadal';
const creatorUrl = process.env.CREATOR_URL || 'https://akadal.tr';

// Web3 setup
const web3 = new Web3(rpcUrl);
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/api/info', (req, res) => {
  res.json({
    networkName: faucetName,
    description: faucetDesc,
    rpcUrl: rpcUrl.replace('ethereum', 'localhost'),
    chainId: chainId,
    explorerUrl: explorerUrl.replace('blockscout', 'localhost'),
    ethAmount: ethAmount,
    faucetAddress: account.address,
    creator: {
      name: creatorName,
      url: creatorUrl
    }
  });
});

app.post('/api/send', async (req, res) => {
  const { wallet } = req.body;
  
  // Validate wallet address
  if (!wallet || !/^0x[a-fA-F0-9]{40}$/i.test(wallet)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid wallet address' 
    });
  }
  
  try {
    // Check balance of faucet
    const balance = await web3.eth.getBalance(account.address);
    const balanceEth = web3.utils.fromWei(balance, 'ether');
    
    const sendAmount = web3.utils.toWei(ethAmount, 'ether');
    
    if (Number(balance) < Number(sendAmount)) {
      return res.status(400).json({
        success: false,
        message: `Faucet balance too low (${balanceEth} ETH). Please contact administrator.`
      });
    }
    
    // Send ETH
    const tx = await web3.eth.sendTransaction({
      from: account.address,
      to: wallet,
      value: sendAmount,
      gas: 21000
    });
    
    return res.json({ 
      success: true, 
      message: `${ethAmount} ETH has been sent to your wallet!`,
      txHash: tx.transactionHash,
      explorerUrl: `${explorerUrl.replace('blockscout', 'localhost')}/tx/${tx.transactionHash}`
    });
  } catch (error) {
    console.error('Error sending ETH:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to send ETH' 
    });
  }
});

// Create public directory and index.html
const fs = require('fs');
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public');
}

// Create HTML file
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${faucetName}</title>
    <style>
        :root {
            --primary: #4f46e5;
            --primary-hover: #3730a3;
            --secondary: #f97316;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --text: #1e293b;
            --text-light: #64748b;
            --success: #10b981;
            --error: #ef4444;
            --warning: #f59e0b;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            line-height: 1.6;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .header {
            background: linear-gradient(45deg, var(--primary), #6366f1);
            color: white;
            padding: 2rem 1rem;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 2rem;
            font-weight: 700;
        }
        
        .header p {
            margin-top: 0.5rem;
            opacity: 0.9;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 2rem 1rem;
            flex: 1;
        }
        
        .card {
            background: var(--card-bg);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            padding: 2rem;
            margin-bottom: 1.5rem;
        }
        
        h2 {
            margin-top: 0;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--text);
        }
        
        p {
            color: var(--text-light);
            margin-bottom: 1.5rem;
        }
        
        input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            font-size: 1rem;
            outline: none;
            transition: all 0.2s;
            margin-bottom: 1rem;
        }
        
        input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
        }
        
        .token-amount {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(79, 70, 229, 0.1);
            border-radius: 8px;
            padding: 1rem;
            margin: 1.5rem 0;
        }
        
        .token-amount-value {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--primary);
        }
        
        button {
            background-color: var(--primary);
            color: white;
            border: none;
            border-radius: 0.5rem;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
            width: 100%;
            margin-bottom: 0.75rem;
        }
        
        button:hover {
            background-color: var(--primary-hover);
        }
        
        button:disabled {
            background-color: #cbd5e1;
            cursor: not-allowed;
        }
        
        .btn-secondary {
            background-color: white;
            color: var(--primary);
            border: 1px solid var(--primary);
        }
        
        .btn-secondary:hover {
            background-color: rgba(79, 70, 229, 0.05);
        }
        
        .status {
            margin-top: 1.5rem;
            padding: 1rem;
            border-radius: 0.5rem;
            display: none;
            font-weight: 500;
        }
        
        .status.success {
            background-color: rgba(16, 185, 129, 0.1);
            color: var(--success);
            border: 1px solid rgba(16, 185, 129, 0.2);
        }
        
        .status.error {
            background-color: rgba(239, 68, 68, 0.1);
            color: var(--error);
            border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        .status.warning {
            background-color: rgba(245, 158, 11, 0.1);
            color: var(--warning);
            border: 1px solid rgba(245, 158, 11, 0.2);
        }
        
        .network-info {
            margin-top: 1rem;
        }
        
        .network-info h3 {
            font-size: 1rem;
            margin-bottom: 0.75rem;
            color: var(--text);
        }
        
        .network-params {
            background-color: #f8fafc;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-bottom: 1rem;
        }
        
        .network-param {
            display: flex;
            margin-bottom: 0.5rem;
        }
        
        .network-param:last-child {
            margin-bottom: 0;
        }
        
        .param-name {
            font-weight: 600;
            min-width: 120px;
            margin-right: 0.5rem;
        }
        
        .param-value {
            color: var(--text-light);
            word-break: break-all;
        }
        
        .warning-banner {
            background-color: rgba(245, 158, 11, 0.1);
            border-left: 4px solid var(--warning);
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
        }
        
        .warning-banner h3 {
            font-size: 1rem;
            color: var(--warning);
            margin-bottom: 0.5rem;
        }
        
        footer {
            text-align: center;
            padding: 2rem 1rem;
            background-color: #f1f5f9;
            color: var(--text-light);
            font-size: 0.875rem;
            margin-top: auto;
        }
        
        .credit {
            margin-top: 0.5rem;
            font-style: italic;
        }
        
        .credit a {
            color: var(--primary);
            text-decoration: none;
            transition: color 0.2s;
        }
        
        .credit a:hover {
            color: var(--primary-hover);
            text-decoration: underline;
        }
        
        ul {
            padding-left: 1.5rem;
        }
        
        li {
            margin-bottom: 0.5rem;
            color: var(--text-light);
        }
        
        @media (max-width: 600px) {
            .header h1 {
                font-size: 1.5rem;
            }
            
            .card {
                padding: 1.5rem;
            }
            
            .token-amount-value {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 id="faucet-name">Akadal Chain Faucet</h1>
        <p id="faucet-desc">Created for Blockchain course testing purposes.</p>
    </div>
    
    <div class="container">
        <div class="warning-banner">
            <h3>Test Network Warning</h3>
            <p>The ETH used on this network is not real ETH. It can only be used for testing purposes, has no real value, and is not valid on the main network.</p>
        </div>
        
        <div class="card">
            <h2>Get Test ETH</h2>
            <p>You can get test ETH to use on the chain for development and testing within the Blockchain course.</p>
            
            <div class="token-amount">
                <div class="token-amount-value" id="eth-amount">100 ETH</div>
            </div>
            
            <input type="text" id="wallet" placeholder="0x..." autocomplete="off" />
            <button id="request-btn">Request Tokens</button>
            
            <div id="status-message" class="status"></div>
        </div>
        
        <div class="card">
            <h2>Network Information</h2>
            <p>Use the following details to add this network to your wallet:</p>
            
            <div class="network-params">
                <div class="network-param">
                    <div class="param-name">Network Name:</div>
                    <div class="param-value" id="network-name">Akadal Chain</div>
                </div>
                <div class="network-param">
                    <div class="param-name">RPC URL:</div>
                    <div class="param-value" id="rpc-url">http://localhost:8545</div>
                </div>
                <div class="network-param">
                    <div class="param-name">Chain ID:</div>
                    <div class="param-value" id="chain-id">1337</div>
                </div>
                <div class="network-param">
                    <div class="param-name">Currency:</div>
                    <div class="param-value">ETH</div>
                </div>
                <div class="network-param">
                    <div class="param-name">Explorer URL:</div>
                    <div class="param-value">
                      <a id="explorer-url" href="#" target="_blank">Block Explorer</a>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h2>Information</h2>
            <ul>
                <li>There are no real transaction fees on this test network; you can test smart contracts for free.</li>
                <li>After adding the network settings to your wallet, you can view your test ETH.</li>
                <li>You can use this test ETH to deploy your smart contracts to the test network.</li>
                <li>If you encounter any issues, please contact your course instructor.</li>
            </ul>
        </div>
    </div>
    
    <footer>
        <div id="copyright">Blockchain Course Test Network © 2025</div>
        <div class="credit">Created by <a id="creator-link" href="${creatorUrl}" target="_blank">${creatorName}</a></div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', async function() {
            // Get network info
            try {
                const response = await fetch('/api/info');
                const info = await response.json();
                
                // Update UI with network info
                document.getElementById('faucet-name').textContent = info.networkName;
                document.getElementById('faucet-desc').textContent = info.description;
                document.getElementById('eth-amount').textContent = info.ethAmount + ' ETH';
                document.getElementById('network-name').textContent = info.networkName;
                document.getElementById('rpc-url').textContent = info.rpcUrl;
                document.getElementById('chain-id').textContent = info.chainId;
                
                const explorerLink = document.getElementById('explorer-url');
                explorerLink.href = info.explorerUrl;
                explorerLink.textContent = 'Block Explorer';
                
                const creatorLink = document.getElementById('creator-link');
                creatorLink.href = info.creator.url;
                creatorLink.textContent = info.creator.name;
            } catch (error) {
                console.error('Failed to load network info:', error);
            }
            
            // Request tokens
            const requestBtn = document.getElementById('request-btn');
            const walletInput = document.getElementById('wallet');
            const statusMessage = document.getElementById('status-message');
            
            requestBtn.addEventListener('click', async function() {
                const wallet = walletInput.value.trim();
                
                // Validate wallet address
                if (!wallet || !/^0x[a-fA-F0-9]{40}$/i.test(wallet)) {
                    statusMessage.textContent = 'Please enter a valid wallet address.';
                    statusMessage.className = 'status error';
                    statusMessage.style.display = 'block';
                    return;
                }
                
                requestBtn.disabled = true;
                statusMessage.textContent = 'Sending test ETH...';
                statusMessage.className = 'status';
                statusMessage.style.display = 'block';
                
                try {
                    const response = await fetch('/api/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ wallet }),
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        statusMessage.innerHTML = 'Success! ' + result.message + 
                            '<br><a href="' + result.explorerUrl + '" target="_blank">View transaction</a>';
                        statusMessage.className = 'status success';
                    } else {
                        statusMessage.textContent = 'Error: ' + result.message;
                        statusMessage.className = 'status error';
                    }
                } catch (error) {
                    statusMessage.textContent = 'Error: Could not connect to faucet.';
                    statusMessage.className = 'status error';
                    console.error(error);
                } finally {
                    requestBtn.disabled = false;
                }
            });
        });
    </script>
</body>
</html>
`;

fs.writeFileSync('./public/index.html', htmlContent);

// Start server
app.listen(port, () => {
  console.log(`Faucet server running at http://localhost:${port}`);
  console.log(`Connected to Ethereum node at ${rpcUrl}`);
  console.log(`Faucet address: ${account.address}`);
});
```

## 7. User Documentation

### 7.1 System URLs and Access Points

Once deployed, the system will be accessible at the following URLs:

- **Faucet**: `http://<VPS_IP>:3000`
- **BlockScout Explorer**: `http://<VPS_IP>:4000`
- **Ethereum RPC**: `http://<VPS_IP>:8545`
- **Ethereum WebSocket**: `ws://<VPS_IP>:8546`

### 7.2 Student Instructions

Students should follow these steps to interact with Akadal Chain:

1. **Set up MetaMask with Akadal Chain**
   - Install MetaMask browser extension
   - Open MetaMask and select "Add Network"
   - Enter the network details provided on the faucet page

2. **Request Test ETH**
   - Navigate to the faucet URL
   - Enter your MetaMask wallet address
   - Click "Request Tokens"
   - Wait for confirmation

3. **Verify Receipt of Tokens**
   - Open MetaMask to see test ETH balance
   - Alternatively, check the explorer for your transaction

4. **Interact with the Chain**
   - Connect your development environment to the RPC URL
   - Deploy smart contracts
   - Execute transactions
   - View results in MetaMask and the explorer

### 7.3 Instructor Management

Instructors can manage the system using the following approaches:

1. **Monitor System Status**
   - Check container status: `docker-compose ps`
   - View logs: `docker-compose logs -f [service]`
   - Monitor blockchain activity through explorer

2. **Manage Faucet Funds**
   - Fund the faucet address if needed
   - Adjust token distribution amount

3. **System Maintenance**
   - Update system: `docker-compose pull && docker-compose up -d`
   - Backup data volumes for persistence
   - Restart services if necessary: `docker-compose restart [service]`

## 8. Future Enhancements

### 8.1 Potential Improvements
- SSL/TLS support for secure access
- User authentication for faucet access control
- Custom token creation and distribution
- Integrated development environment
- More detailed analytics and monitoring
- Integration with learning management systems
- Additional educational resources and tutorials
- Smart contract templates for common use cases

### 8.2 Scaling Considerations
- Increase VPS resources as student numbers grow
- Implement load balancing for larger classes
- Set up replication for high availability
- Consider multi-node setup for advanced courses

## 9. Project Timeline and Milestones

### 9.1 Development Timeline
- **Week 1**: Initial setup and configuration
- **Week 2**: Component integration and testing
- **Week 3**: User interface refinement and documentation
- **Week 4**: Final testing and deployment

### 9.2 Key Milestones
- Ethereum node deployment and validation
- BlockScout explorer integration
- Faucet development and testing
- Full system integration
- Documentation completion
- Production deployment
- Student onboarding

## 10. Decision Log

### 10.1 Technology Choices
- **Geth vs. Alternatives**: Geth was chosen for its stability, widespread adoption, and EVM compatibility.
- **BlockScout vs. Alternatives**: BlockScout provides the most comprehensive explorer functionality with modern UI.
- **Custom Faucet vs. Existing Solutions**: Custom faucet development allows for full control over distribution logic and unlimited token distribution.
- **Docker Compose vs. Kubernetes**: Docker Compose provides simpler deployment for single-server setup.

### 10.2 Configuration Decisions
- **Chain ID 1337**: Standard for local development chains, easily recognizable.
- **Dev Mode**: Provides instant blocks for better student experience.
- **100 ETH Distribution**: Sufficient for extensive testing without requiring frequent requests.
- **No Request Limits**: Removed limits on the same address requesting multiple times for educational flexibility.

## 11. Conclusion

The Akadal Chain educational blockchain environment provides a comprehensive, accessible, and user-friendly platform for teaching blockchain concepts and development. By combining a functional Ethereum node, block explorer, and custom faucet in an integrated Docker setup, it offers a complete educational experience that can scale to accommodate classes of 200+ students.

This all-in-one solution eliminates the limitations of third-party services, provides full control over the environment, and ensures students have a consistent and reliable platform for learning blockchain development.
```