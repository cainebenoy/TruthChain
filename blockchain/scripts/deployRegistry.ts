import hre from "hardhat";

async function main() {
  console.log("Deploying TruthRegistry contract...");
  
  // For Hardhat 3 with the plugin system, you must:
  // 1. Register the plugin in hardhat.config.ts (plugins: [hardhatToolboxMochaEthers])
  // 2. Call hre.network.connect() to get the ethers object
  const connection = await hre.network.connect();
  const { ethers } = connection;
  
  const RegistryFactory = await ethers.getContractFactory("TruthRegistry");

  console.log("Deploying... (waiting for transaction)");
  const registry = await RegistryFactory.deploy();

  // Wait for the deployment to be confirmed on the network
  await registry.waitForDeployment();

  // Get the deployed address
  const registryAddress = await registry.getAddress();

  console.log(`TruthRegistry deployed successfully to: ${registryAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});