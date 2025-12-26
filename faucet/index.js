const express = require('express');
const { Web3 } = require('web3');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const port = process.env.PORT || 3000;

// Environment variables with defaults
const rpcUrl = process.env.RPC_URL || 'http://ethereum:8545';
const chainId = process.env.CHAIN_ID || '1337';
const explorerUrl = process.env.EXPLORER_URL || 'http://localhost:8080';
const blockscoutUrl = process.env.BLOCKSCOUT_URL || 'http://localhost:4000';
const ethAmount = process.env.ETH_AMOUNT || '100';
const privateKey = process.env.FUND_PRIVATE_KEY || '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d';
const faucetName = process.env.FAUCET_NAME || 'Akadal Chain Faucet';
const faucetDesc = process.env.FAUCET_DESCRIPTION || 'Blockchain course test tokens';
const creatorName = process.env.CREATOR_NAME || 'Assoc. Prof. Dr. Emre Akadal';
const creatorUrl = process.env.CREATOR_URL || 'https://akadal.tr';
const enableHttps = process.env.ENABLE_HTTPS === 'true';

// Web3 setup
const web3 = new Web3(rpcUrl);
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
// defaultAccount is deprecated in Web3.js v4, but we'll keep track of our account
const defaultAccount = account.address;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const publicRpcUrl = process.env.PUBLIC_RPC_URL || rpcUrl.replace('ethereum', 'localhost');

// Routes
app.get('/api/info', (req, res) => {
    res.json({
        networkName: faucetName,
        description: faucetDesc,
        rpcUrl: publicRpcUrl,
        chainId: chainId,
        explorerUrl: explorerUrl,
        blockscoutUrl: blockscoutUrl,
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

        if (BigInt(balance) < BigInt(sendAmount)) {
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
            explorerUrl: `${explorerUrl}/tx/${tx.transactionHash}`,
            blockscoutUrl: `${blockscoutUrl}/tx/${tx.transactionHash}`
        });
    } catch (error) {
        console.error('Error sending ETH:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to send ETH'
        });
    }
});

// Create HTML file for the faucet UI
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
                <div class="network-param">
                    <div class="param-name">Blockscout:</div>
                    <div class="param-value">
                      <a id="blockscout-url" href="#" target="_blank">Smart Contract Explorer</a>
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
                
                const blockscoutLink = document.getElementById('blockscout-url');
                blockscoutLink.href = info.blockscoutUrl;
                blockscoutLink.textContent = 'Smart Contract Explorer';
                
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
                            '<br><a href="' + result.explorerUrl + '" target="_blank">View transaction in Block Explorer</a>' +
                            '<br><a href="' + result.blockscoutUrl + '" target="_blank">View transaction in Blockscout</a>';
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

// Create public directory and index.html
if (!fs.existsSync(path.join(__dirname, 'public'))) {
    fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });
}

// Write HTML file
fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), htmlContent);

// Start server
app.listen(port, () => {
    console.log(`Faucet server running at http://localhost:${port}`);
    console.log(`Connected to Ethereum node at ${rpcUrl}`);
    console.log(`Public RPC URL: ${process.env.PUBLIC_RPC_URL || 'Derived from RPC_URL'}`);
    console.log(`Faucet address: ${account.address}`);
}); 