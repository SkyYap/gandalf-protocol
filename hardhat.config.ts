import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import { HardhatUserConfig } from "hardhat/types";

// import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
// import "@nomiclabs/hardhat-etherscan";
import "hardhat-deploy";
import "solidity-coverage";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        viaIR: true,
        },
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.HARDHAT_MAINNET_FORKING_URL || "",
        blockNumber: 20477013,
      },
    }
  },
  namedAccounts: {
    deployer: {
      default: 0
    },
    owner: {
      default: 1
    },
  }
};

export default config;
