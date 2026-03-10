import { ethers, network } from "hardhat";
import { developmentChains } from "../helper-hardhat-config";
import fs from "fs";
import path from "path";

const BASE_FEE = "1000000000000000";
const GAS_PRICE_LINK = "1000000000";
const WEI_PER_UNIT_LINK = "4000000000000000";

async function main() {
  if (!developmentChains.includes(network.name)) {
    console.log("Not a development chain, skipping mock deployment");
    return;
  }

  console.log("Deploying mocks to local network...");
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const VRFCoordinatorV2_5Mock = await ethers.getContractFactory("VRFCoordinatorV2_5Mock");
  const vrfCoordinator = await VRFCoordinatorV2_5Mock.deploy(BASE_FEE, GAS_PRICE_LINK, WEI_PER_UNIT_LINK);
  await vrfCoordinator.waitForDeployment();

  const vrfAddress = await vrfCoordinator.getAddress();
  console.log("VRFCoordinatorV2_5Mock deployed to:", vrfAddress);

  const txResponse = await vrfCoordinator.createSubscription();
  const txReceipt = await txResponse.wait(1);

  let subscriptionId: bigint;
  if (txReceipt && txReceipt.logs) {
    const event = vrfCoordinator.interface.parseLog({
      topics: txReceipt.logs[0].topics as string[],
      data: txReceipt.logs[0].data,
    });
    subscriptionId = event?.args[0] ?? BigInt(1);
  } else {
    subscriptionId = BigInt(1);
  }

  console.log("Subscription created with ID:", subscriptionId.toString());

  await vrfCoordinator.fundSubscription(subscriptionId, ethers.parseEther("10"));
  console.log("Subscription funded");

  const deploymentPath = path.resolve(__dirname, "../deployments");
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath, { recursive: true });
  }

  fs.writeFileSync(
    path.resolve(deploymentPath, "localhost-mocks.json"),
    JSON.stringify(
      {
        VRFCoordinatorV2_5Mock: vrfAddress,
        subscriptionId: subscriptionId.toString(),
      },
      null,
      2
    )
  );

  console.log("Mock deployment info saved");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Mock deployment failed");
  process.exitCode = 1;
});
