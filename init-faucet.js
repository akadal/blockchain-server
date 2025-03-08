const { Web3 } = require('web3');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Configuration from .env file
const host = process.env.HOST_IP || 'localhost';
const port = process.env.ETHEREUM_RPC_PORT || '8545';
const rpcUrl = `http://${host === 'localhost' ? 'localhost' : 'ethereum'}:${port}`;
const faucetPrivateKey = process.env.FUND_PRIVATE_KEY || '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d';
const faucetAddress = process.env.FUND_ADDRESS || '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1';
const amountToSend = process.env.ETH_AMOUNT || '1000'; // Default: 1000 ETH

console.log(`Using RPC URL: ${rpcUrl}`);
console.log(`Funding address: ${faucetAddress}`);

async function initFaucet() {
  console.log('Initializing Faucet Account...');
  console.log('=================================');

  try {
    // Connect to Ethereum node
    const web3 = new Web3(rpcUrl);
    
    // Get accounts
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      console.log('❌ No accounts found in the Ethereum node!');
      return;
    }
    
    console.log(`Found ${accounts.length} accounts in the Ethereum node.`);
    console.log(`First account: ${accounts[0]}`);
    
    // Check balance of first account
    const balance = await web3.eth.getBalance(accounts[0]);
    console.log(`Balance of first account: ${web3.utils.fromWei(balance, 'ether')} ETH`);
    
    // Check if faucet account exists
    const faucetBalance = await web3.eth.getBalance(faucetAddress);
    console.log(`Current faucet balance: ${web3.utils.fromWei(faucetBalance, 'ether')} ETH`);
    
    // Import faucet account to node
    try {
      // Note: personal.importRawKey is not directly supported in web3.js v4
      // We'll use a different approach
      const account = web3.eth.accounts.privateKeyToAccount(faucetPrivateKey);
      web3.eth.accounts.wallet.add(account);
      console.log(`✅ Added faucet account to wallet: ${faucetAddress}`);
    } catch (error) {
      console.log(`Note: Issue with faucet account: ${error.message}`);
    }
    
    // Send ETH to faucet account
    console.log(`Sending ${amountToSend} ETH to faucet account...`);
    
    const tx = await web3.eth.sendTransaction({
      from: accounts[0],
      to: faucetAddress,
      value: web3.utils.toWei(amountToSend, 'ether'),
      gas: 21000
    });
    
    console.log('✅ Transaction successful!');
    console.log(`Transaction hash: ${tx.transactionHash}`);
    
    // Check new balance
    const newBalance = await web3.eth.getBalance(faucetAddress);
    console.log(`New faucet balance: ${web3.utils.fromWei(newBalance, 'ether')} ETH`);
    
    console.log('=================================');
    console.log('Faucet initialization completed!');
    console.log('You can now use the faucet at http://localhost:3000');
    
  } catch (error) {
    console.log('❌ Error initializing faucet:');
    console.error(error.message);
    console.log('\nTrying alternative method...');
    
    try {
      // Alternative method using direct account creation
      const web3 = new Web3(rpcUrl);
      
      // Add account to wallet
      const account = web3.eth.accounts.privateKeyToAccount(faucetPrivateKey);
      web3.eth.accounts.wallet.add(account);
      
      // Get coinbase account
      const coinbase = await web3.eth.getCoinbase();
      console.log(`Coinbase account: ${coinbase}`);
      
      // Send ETH from coinbase to faucet
      const tx = await web3.eth.sendTransaction({
        from: coinbase,
        to: faucetAddress,
        value: web3.utils.toWei(amountToSend, 'ether'),
        gas: 21000
      });
      
      console.log('✅ Alternative method successful!');
      console.log(`Transaction hash: ${tx.transactionHash}`);
      
      // Check new balance
      const newBalance = await web3.eth.getBalance(faucetAddress);
      console.log(`New faucet balance: ${web3.utils.fromWei(newBalance, 'ether')} ETH`);
      
    } catch (altError) {
      console.log('❌ Alternative method also failed:');
      console.error(altError.message);
      console.log('\nPlease try the following manual steps:');
      console.log('1. Connect to the Ethereum node: docker exec -it ethereum-node geth attach http://localhost:8545');
      console.log('2. Send ETH to the faucet account:');
      console.log(`   eth.sendTransaction({from: eth.accounts[0], to: "${faucetAddress}", value: web3.toWei(1000, "ether")})`);
    }
  }
}

// Run the initialization
initFaucet().catch(console.error); 