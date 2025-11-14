import { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import "dotenv/config";

// Get the new Sepolia RPC URL from .env
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  plugins: [hardhatToolboxMochaEthers], 
  networks: {
    amoy: { // We can leave Amoy in, it doesn't hurt
      type: "http" as const,
      url: process.env.AMOY_RPC_URL || "",
      accounts: [PRIVATE_KEY],
    },
    // --- THIS IS THE NEW SEPOLIA NETWORK ---
    sepolia: {
      type: "http" as const,
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;