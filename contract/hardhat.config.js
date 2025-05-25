require("@nomicfoundation/hardhat-toolbox");

const INFURA_API_KEY = vars.get("INFURA_API_KEY");
const ACCOUNT_PRIVATE_KEY = vars.get("ACCOUNT_PRIVATE_KEY");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  defaultNetwork: "localhost",
  networks: {
    hoodi: {
      url: `https://hoodi.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [ACCOUNT_PRIVATE_KEY],
    },
  },
};
