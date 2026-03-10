import { ethers, network } from "hardhat";
import { networkConfig, developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";
import fs from "fs";
import path from "path";

async function main() {
  const chainId = network.config.chainId!;
  const config = networkConfig[chainId];

  if (!config) {
    throw new Error(`No config for chainId ${chainId}`);
  }

  const [deployer] = await ethers.getSigners();
  console.log("Deploying Raffle with account:", deployer.address);

  let vrfCoordinatorAddress: string;
  let subscriptionId: string;

  if (developmentChains.includes(network.name)) {
    const deploymentPath = path.resolve(__dirname, "../deployments/localhost-mocks.json");
    if (!fs.existsSync(deploymentPath)) {
      throw new Error("Mocks not deployed. Run deploy-mocks.ts first.");
    }
    const mocks = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    vrfCoordinatorAddress = mocks.VRFCoordinatorV2_5Mock;
    subscriptionId = mocks.subscriptionId;
  } else {
    vrfCoordinatorAddress = config.vrfCoordinatorV2_5!;
    subscriptionId = config.subscriptionId;
  }

  const args: [string, bigint, bigint, string, bigint, number] = [
    vrfCoordinatorAddress,
    BigInt(config.entranceFee),
    BigInt(config.interval),
    config.gasLane,
    BigInt(subscriptionId),
    config.callbackGasLimit,
  ];

  console.log("Constructor args:", args.map(String));

  const RaffleFactory = await ethers.getContractFactory("Raffle");
  const raffle = await RaffleFactory.deploy(...args);
  await raffle.waitForDeployment();

  const raffleAddress = await raffle.getAddress();
  console.log("Raffle deployed to:", raffleAddress);

  if (developmentChains.includes(network.name)) {
    const deploymentPath = path.resolve(__dirname, "../deployments/localhost-mocks.json");
    const mocks = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    const vrfCoordinator = await ethers.getContractAt("VRFCoordinatorV2_5Mock", mocks.VRFCoordinatorV2_5Mock);
    await vrfCoordinator.addConsumer(BigInt(mocks.subscriptionId), raffleAddress);
    console.log("Raffle added as VRF consumer");
  }

  const deploymentDir = path.resolve(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  fs.writeFileSync(
    path.resolve(deploymentDir, `${config.name}-raffle.json`),
    JSON.stringify(
      {
        address: raffleAddress,
        chainId,
        deployer: deployer.address,
        args: args.map(String),
      },
      null,
      2
    )
  );

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contract...");
    await verify(raffleAddress, args);
  }

  console.log("Deployment complete!");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Raffle deployment failed");
  process.exitCode = 1;
});
