import { ethers, network } from "hardhat";
import fs from "fs";
import path from "path";

const FRONTEND_CONSTANTS_DIR = path.resolve(__dirname, "../../app/src/shared/constants");

async function main() {
  const chainId = network.config.chainId!;
  console.log(`Updating frontend for chainId: ${chainId}`);

  if (!fs.existsSync(FRONTEND_CONSTANTS_DIR)) {
    fs.mkdirSync(FRONTEND_CONSTANTS_DIR, { recursive: true });
  }

  await updateContractAddresses(chainId);
  await updateAbi();

  console.log("Frontend constants updated!");
}

async function updateContractAddresses(chainId: number) {
  const addressesPath = path.resolve(FRONTEND_CONSTANTS_DIR, "contractAddresses.ts");

  let addresses: Record<string, Record<string, string[]>> = {};

  if (fs.existsSync(addressesPath)) {
    const content = fs.readFileSync(addressesPath, "utf8");
    const match = content.match(/ContractAddresses\s*=\s*(\{[\s\S]*?\}) as const/);
    if (match) {
      try {
        addresses = JSON.parse(match[1].replace(/'/g, '"'));
      } catch {
        addresses = {};
      }
    }
  }

  const networkName = chainId === 31337 ? "localhost" : "sepolia";
  const deploymentFile = path.resolve(__dirname, `../deployments/${networkName}-raffle.json`);

  if (!fs.existsSync(deploymentFile)) {
    console.log(`No deployment found for ${networkName}`);
    return;
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));

  if (!addresses[String(chainId)]) {
    addresses[String(chainId)] = {};
  }
  addresses[String(chainId)]["Raffle"] = [deployment.address];

  const fileContent = `import { ContractAddressMap } from "../types/contracts";

export const contractAddresses: ContractAddressMap = ${JSON.stringify(addresses, null, 2)} as const;
`;

  fs.writeFileSync(addressesPath, fileContent);
  console.log(`Contract addresses updated for chainId ${chainId}`);
}

async function updateAbi() {
  const artifactPath = path.resolve(__dirname, "../artifacts/contracts/Raffle.sol/Raffle.json");

  if (!fs.existsSync(artifactPath)) {
    console.log("Raffle artifact not found. Compile contracts first.");
    return;
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const fileContent = `export const raffleAbi = ${JSON.stringify(artifact.abi, null, 2)} as const;
`;

  fs.writeFileSync(path.resolve(FRONTEND_CONSTANTS_DIR, "abi.ts"), fileContent);
  console.log("ABI updated");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Frontend update failed");
  process.exitCode = 1;
});
