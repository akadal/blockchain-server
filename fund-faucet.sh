#!/bin/bash

echo "Funding faucet account directly from Ethereum node..."

# Faucet address
FAUCET_ADDRESS="0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"

# Connect to Ethereum node and execute commands
docker exec ethereum-node geth --exec "eth.sendTransaction({from: eth.accounts[0], to: \"$FAUCET_ADDRESS\", value: web3.toWei(10000000000, \"ether\")})" attach http://localhost:8545

echo "Done! Check faucet balance at http://localhost:3000" 