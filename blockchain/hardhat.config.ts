import { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";

// This imports the 'dotenv' package to load your .env file
import "dotenv/config";

// Get the environment variables we need
const AMOY_RPC_URL = process.env.AMOY_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.20", // This must match your contract's pragma
  plugins: [hardhatToolboxMochaEthers],
  networks: {
    // This is the new network configuration for Amoy
    amoy: {
      type: "http" as const,
      url: AMOY_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;