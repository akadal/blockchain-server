const { Web3 } = require('web3');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Configuration from .env file
const host = process.env.HOST_IP || 'localhost';
const ethereumPort = process.env.ETHEREUM_RPC_PORT || '8545';
const faucetPort = process.env.FAUCET_PORT || '3000';
const explorerPort = process.env.EXPLORER_PORT || '8080';
const blockscoutPort = process.env.BLOCKSCOUT_PORT || '4000';

const rpcUrl = `http://${host}:${ethereumPort}`;
const faucetUrl = `http://${host}:${faucetPort}`;
const explorerUrl = `http://${host}:${explorerPort}`;
const blockscoutUrl = `http://${host}:${blockscoutPort}`;

console.log(`Using RPC URL: ${rpcUrl}`);
console.log(`Using Faucet URL: ${faucetUrl}`);
console.log(`Using Explorer URL: ${explorerUrl}`);
console.log(`Using Blockscout URL: ${blockscoutUrl}`);

async function testSystem() {
  console.log('Testing Akadal Chain Educational Blockchain Environment...');
  console.log('=====================================================');

  // Test 1: Check if Ethereum node is running
  console.log('\n1. Testing Ethereum Node Connection...');
  try {
    const web3 = new Web3(rpcUrl);
    const blockNumber = await web3.eth.getBlockNumber();
    console.log('✅ Ethereum Node is running!');
    console.log(`   Current block number: ${blockNumber}`);
    
    // Get network ID
    const networkId = await web3.eth.net.getId();
    console.log(`   Network ID: ${networkId}`);
    
    // Get accounts
    const accounts = await web3.eth.getAccounts();
    console.log(`   Available accounts: ${accounts.length}`);
    if (accounts.length > 0) {
      console.log(`   First account: ${accounts[0]}`);
      
      // Get balance
      const balance = await web3.eth.getBalance(accounts[0]);
      console.log(`   Balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);
    }
  } catch (error) {
    console.log('❌ Failed to connect to Ethereum Node!');
    console.error(`   Error: ${error.message}`);
  }

  // Test 2: Check if Faucet is running
  console.log('\n2. Testing Faucet API...');
  try {
    const response = await axios.get(`${faucetUrl}/api/info`);
    console.log('✅ Faucet API is running!');
    console.log(`   Faucet name: ${response.data.networkName}`);
    console.log(`   Chain ID: ${response.data.chainId}`);
    console.log(`   ETH amount: ${response.data.ethAmount} ETH`);
    console.log(`   Faucet address: ${response.data.faucetAddress}`);
  } catch (error) {
    console.log('❌ Failed to connect to Faucet API!');
    console.error(`   Error: ${error.message}`);
  }

  // Test 3: Check if Explorer is running
  console.log('\n3. Testing Ethereum Explorer...');
  try {
    const response = await axios.get(explorerUrl);
    console.log('✅ Ethereum Explorer is running!');
    console.log(`   Explorer URL: ${explorerUrl}`);
  } catch (error) {
    console.log('❌ Failed to connect to Ethereum Explorer!');
    console.error(`   Error: ${error.message}`);
  }

  // Test 4: Check if Blockscout Explorer is running
  console.log('\n4. Testing Blockscout Explorer...');
  try {
    const response = await axios.get(blockscoutUrl);
    console.log('✅ Blockscout Explorer is running!');
    console.log(`   Blockscout URL: ${blockscoutUrl}`);
  } catch (error) {
    console.log('❌ Failed to connect to Blockscout Explorer!');
    console.error(`   Error: ${error.message}`);
  }

  console.log('\n=====================================================');
  console.log('Test completed!');
}

testSystem().catch(console.error); 