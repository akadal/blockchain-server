# Akadal Chain: Educational Blockchain Environment

A robust, containerized Ethereum blockchain environment designed for educational purposes. This system provides a full EVM-compatible chain, advanced block explorers, and an automated faucet, all optimized for Stability and seamless Deployment (Coolify/Docker).

## 🚀 System Components

1.  **Ethereum Node (Geth)**:
    *   Fast, developer-mode EVM chain.
    *   Pre-configured with large ETH allocations for testing.
    *   Optimized with resource limits (1GB RAM) to prevent crashes.
2.  **Blockscout Explorer**:
    *   Full-featured explorer with smart contract verification and interaction.
    *   Backed by a dedicated PostgreSQL database.
3.  **Ethereum Lite Explorer**:
    *   Lightweight visual explorer for quick block checking.
4.  **Student Faucet**:
    *   Web interface for students to request test ETH.
    *   Auto-detects network settings for MetaMask.
    *   Robust "Auto-Fund" backend that keeps the faucet wallet topped up.
5.  **Automation Scripts**:
    *   Daily chain reset tools to keep the environment fresh.

---

## 🛠️ Deployment Instructions

This project is tailored for deployment via **Coolify** or standard **Docker Compose** on a Linux VPS.

### Option A: Coolify Deployment (Recommended)

1.  **Create Service**:
    *   Go to your Coolify dashboard.
    *   Select **"+ Add"** -> **"Docker Compose"**.
2.  **Configuration**:
    *   Copy the contents of `docker-compose.yml` into the editor.
3.  **Environment Variables**:
    *   Set the following variables in the Coolify "Environment Variables" section:
    ```bash
    # Domain Configuration
    HOST_IP=blockchain.akadal.tr   # Your actual domain
    ENABLE_HTTPS=false             # Let Coolify handle SSL termination

    # Port Mapping (Optional - Defaults are standard)
    ETHEREUM_RPC_PORT=8545
    EXPLORER_PORT=8080
    BLOCKSCOUT_PORT=4000
    FAUCET_PORT=3000

    # Customization
    NETWORK_ID=1337
    FAUCET_NAME="Akadal Chain Faucet"
    ```
4.  **Deploy**:
    *   Click **"Deploy"**. Coolify will build the images and start the stack.
    *   *Note*: The build might take a few minutes as it compiles the Faucet and sets up Blockscout.
5.  **Domain Setup**:
    *   In Coolify, configure your domains for the exposed ports:
        *   `https://blockchain.akadal.tr` -> Container Port `3000` (Faucet - Landing Page)
        *   `https://explorer.blockchain.akadal.tr` -> Container Port `4000` (Blockscout)
        *   `https://rpc.blockchain.akadal.tr` -> Container Port `8545` (RPC)

### Option B: Manual Docker Deployment (Ubuntu/Debian)

1.  **Clone & Setup**:
    ```bash
    git clone https://github.com/akadal/blockchain-server.git
    cd blockchain-server
    cp .env.example .env
    ```
2.  **Configure `.env`**:
    *   Edit `.env` and set `HOST_IP=your-server-ip`.
    *   If you need built-in SSL (without a reverse proxy), set `ENABLE_HTTPS=true` and run `./generate-certs.sh`.
3.  **Start System**:
    ```bash
    docker-compose up -d
    ```

---

## 🔄 Automation & Maintenance

To ensure the test network remains stable and doesn't get bloated with old student data, the system includes a **Daily Reset Script**.

### Setting up the Daily Reset (Cron Job)

We recommend wiping the chain every night at **4:00 AM**.

1.  **Open Crontab**:
    ```bash
    crontab -e
    ```
2.  **Add Entry**:
    ```bash
    # Reset blockchain daily at 4:00 AM
    0 4 * * * /path/to/blockchain-server/reset-chain.sh >> /var/log/blockchain-reset.log 2>&1
    ```
3.  **Verify**:
    *   Ensure `reset-chain.sh` is executable: `chmod +x reset-chain.sh`.
    *   The script will:
        1.  Stop all containers.
        2.  **Delete** the blockchain volume (`geth-data`) and database (`postgres-data`).
        3.  Restart the containers fresh.

> **Warning**: This action creates a **hard reset**. All deployed smart contracts, transactions, and balances will be lost. This is intended for educational testnets.

---

## 👩‍💻 Student Guide

### Connecting MetaMask
1.  **Network Name**: Akadal Chain
2.  **RPC URL**: `https://rpc.blockchain.akadal.tr` (or your configured RPC URL)
3.  **Chain ID**: `1337`
4.  **Currency**: `ETH`

### Getting Test Funds
1.  Go to `https://blockchain.akadal.tr` (Faucet URL).
2.  Paste your wallet address.
3.  Click **"Request Tokens"**.
4.  You will receive 100 Test ETH immediately.

### Smart Contract Development
*   **Remix IDE**: Select "Injected Provider - MetaMask" to deploy directly to the chain.
*   **Verification**: Use the Blockscout Explorer at `https://explorer.blockchain.akadal.tr` to verify and interact with your contracts.

---

## 🔧 Troubleshooting

### 1. "Faucet balance too low"
*   **Cause**: The faucet wallet ran dry.
*   **Fix**: The `auto-fund.js` script runs automatically inside the faucet container to refill it from the genesis account.
*   **Check**: View logs with `docker-compose logs -f faucet`.

### 2. System Crashes / Services Restarting
*   **Cause**: Docker resource limits.
*   **Fix**: We have imposed RAM limits (1GB for Geth, 1.5GB for Blockscout) to prevent the server from freezing. If your server is very large, you can increase these in `docker-compose.yml` under `deploy.resources.limits`.

### 3. "Connection Refused" on RPC
*   **Cause**: The node is resetting or starting up.
*   **Wait**: Give the system 30 seconds after a reset (especially at 4:00 AM) to initialize the DAG and start listening.

---

## 📜 License
MIT License. Created for educational purposes by Assoc. Prof. Dr. Emre Akadal.