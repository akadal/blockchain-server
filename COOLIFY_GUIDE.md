# Coolify Deployment & Configuration Guide

This guide explains how to properly configure your Blockchain Server on Coolify, ensuring that **MetaMask**, **Explorers**, and the **Faucet** work correctly.

## 1. Prerequisites
- A domain name (e.g., `akadal.tr`) pointing to your Coolify server IP.
- A project created in Coolify linked to this repository.

## 2. Resource Configuration in Coolify

When you deploy this project using Docker Compose in Coolify, you must manually configure the **Domains** for each service to expose them to the internet.

### A. Ethereum RPC (Critical for MetaMask)

1. Go to your Coolify Project Resources.
2. Select the `ethereum` service.
3. Find the **Domains** section.
4. Add a domain: `https://rpc.blockchain.akadal.tr` (or your equivalent).
   - **Port**: `8545`
   - **HTTPS/SSL**: Enabled (Coolify handles this).
5. **IMPORTANT**: Go to **Configuration** -> **General** or **Proxy**.
   - Ensure "Proxy" is enabled.
   - If utilizing Cloudflare: Use **Full** or **Full (Strict)** SSL mode in Cloudflare, NOT "Flexible". "Flexible" causes redirect loops.
   - If usage of "DNS Only" (Grey Cloud) in Cloudflare is preferred, Coolify will manage Let's Encrypt certificates automatically.

### B. Blockscout Explorer

1. Select the `blockscout` service.
2. Add Domain: `https://explorer.blockchain.akadal.tr`
   - **Port**: `4000`

### C. Faucet

1. Select the `faucet` service.
2. Add Domain: `https://faucet.blockchain.akadal.tr`
   - **Port**: `3000`

---

## 3. Fixing "Restarting" Loop

If your services keep restarting:
1. **Health Checks**: We have updated the `docker-compose.yml` to be more lenient with startup times (`start_period: 30s`) and use a standard `wget` check.
2. **Resources**: Ensure the server has at least **4GB RAM**. The Geth node and Blockscout are memory intensive.
   - If running on a small VPS, enable **Swap** in Coolify Server settings.

---

## 4. Connecting MetaMask

Once the services are green (Running):

1. Open MetaMask.
2. Click the Network dropdown -> **Add Network** -> **Add a network manually**.
3. Fill in the details:
   - **Network Name**: Akadal Chain
   - **RPC URL**: `https://rpc.blockchain.akadal.tr` (The domain you set for `ethereum` service)
   - **Chain ID**: `1337` (Default for this dev chain).
   - **Currency Symbol**: `ETH`
   - **Block Explorer URL**: `https://explorer.blockchain.akadal.tr`
4. Click **Save**.

### Troubleshooting Connection
- **"Could not fetch chain ID"**:
  - Check if the RPC URL is accessible in a browser. It should return a JSON error or 404, not a "Bad Gateway" or "Connection Refused".
  - If using Cloudflare, turn off "Bot Fight Mode" or "Under Attack Mode" as they can block RPC calls.
  - Verify `corsdomain` is `*` (configured in docker-compose).
- **"Chain ID does not match"**:
  - Ensure `NETWORK_ID` in `.env` matches what you enter in MetaMask (Default: 1337).

## 5. Environment Variables in Coolify

Most configuration is now **automatic** for the production environment (`blockchain.akadal.tr`).

You **ONLY** need to add these secret variables in Coolify's Environment Variables section:

```env
FUND_PRIVATE_KEY=your_private_key_here
FUND_ADDRESS=your_wallet_address_here
```

*Note: `NETWORK_ID`, `rpc`, `explorer`, and `faucet` URLs are now pre-configured in `docker-compose.yml`.*

