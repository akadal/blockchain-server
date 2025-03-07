const { Web3 } = require('web3');

// Configuration
const rpcUrl = 'http://localhost:8545';
const faucetAddress = '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1';
const amountToSend = '10000000000'; // 10 billion ETH
const checkInterval = 60000; // 1 minute

// Connect to Ethereum node
const web3 = new Web3(rpcUrl);

async function fundFaucet() {
  try {
    // Get coinbase account
    const coinbase = await web3.eth.getCoinbase();
    
    // Get faucet balance
    const balance = await web3.eth.getBalance(faucetAddress);
    const balanceEth = web3.utils.fromWei(balance, 'ether');
    
    console.log(`Current faucet balance: ${balanceEth} ETH`);
    
    // If balance is below threshold, send more ETH
    if (BigInt(balance) < BigInt(web3.utils.toWei('5000000000', 'ether'))) {
      console.log(`Faucet balance is below threshold. Sending ${amountToSend} ETH...`);
      
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
    } else {
      console.log('Faucet has sufficient funds. No action needed.');
    }
  } catch (error) {
    console.error(`Error funding faucet: ${error.message}`);
  }
}

// Initial fund
console.log('Starting auto-fund service for faucet...');
fundFaucet();

// Set interval to check and fund periodically
setInterval(fundFaucet, checkInterval);

console.log(`Auto-fund service is running. Will check faucet balance every ${checkInterval/1000} seconds.`); 