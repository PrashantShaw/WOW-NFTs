Compile your contracts:
`npx hardhat compile`

Start a local node
`npx hardhat node`

Open a new terminal and deploy the Hardhat Ignition module in the localhost network
`npx hardhat ignition deploy ./ignition/modules/NFTMarketplace.js --network localhost`

As general rule, you can target any network from your Hardhat config using:
`npx hardhat ignition deploy ./ignition/modules/NFTMarketplace.js --network <your-network>`

If no network is specified, Hardhat Ignition will run against an in-memory instance of Hardhat Network.
