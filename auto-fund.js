const { Web3 } = require('web3');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Configuration from .env file
const rpcUrl = process.env.RPC_URL || `http://${process.env.HOST_IP || 'localhost'}:${process.env.ETHEREUM_RPC_PORT || '8545'}`;
const faucetAddress = process.env.FUND_ADDRESS || '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1';
// Default to 10 billion ETH if not specified
const amountToSend = process.env.FUND_AMOUNT || '10000000000';
const checkInterval = parseInt(process.env.FUND_INTERVAL || '60000'); // Default 1 minute

console.log(`Using RPC URL: ${rpcUrl}`);
console.log(`Funding address: ${faucetAddress}`);

// Connect to Ethereum node
const web3 = new Web3(rpcUrl);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fundFaucet() {
  try {
    // Check if node is ready
    try {
        await web3.eth.net.isListening();
    } catch (e) {
        console.log('Ethereum node not ready yet, retrying in 5s...');
        return;
    }

    // Get coinbase account
    const coinbase = await web3.eth.getCoinbase();
    if (!coinbase) {
        console.log('No coinbase account found, waiting...');
        return;
    }
    
    // Get faucet balance
    const balance = await web3.eth.getBalance(faucetAddress);
    const balanceEth = web3.utils.fromWei(balance, 'ether');
    
    console.log(`Current faucet balance: ${balanceEth} ETH`);
    
    // If balance is below threshold (half of amountToSend), send more ETH
    const threshold = BigInt(web3.utils.toWei(amountToSend, 'ether')) / 2n;
    
    if (BigInt(balance) < threshold) {
      console.log(`Faucet balance is below threshold. Sending ${amountToSend} ETH...`);
      
      try {
          const tx = await web3.eth.sendTransaction({
            from: coinbase,
            to: faucetAddress,
            value: web3.utils.toWei(amountToSend, 'ether'),
            gas: 21000
          });
          
          console.log(`Transaction successful! Hash: ${tx.transactionHash}`);
          
          // Get new balance
          const newBalance = await web3.eth.getBalance(faucetAddress);
          console.log(`New faucet balance: ${web3.utils.fromWei(newBalance, 'ether')} ETH`);
      } catch (txError) {
          console.error(`Transaction failed: ${txError.message}`);
      }
    } else {
      console.log('Faucet has sufficient funds. No action needed.');
    }
  } catch (error) {
    console.error(`Error in fund service: ${error.message}`);
  }
}

async function startService() {
    console.log('Starting auto-fund service for faucet...');
    
    // Initial loop
    while (true) {
        await fundFaucet();
        await sleep(checkInterval);
    }
}

startService(); 