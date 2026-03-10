import { ethers, network } from "hardhat";
import { developmentChains } from "../helper-hardhat-config";
import fs from "fs";
import path from "path";

async function main() {
  if (!developmentChains.includes(network.name)) {
    console.log("This script is for local development only");
    return;
  }

  const mocksPath = path.resolve(__dirname, "../deployments/localhost-mocks.json");
  const rafflePath = path.resolve(__dirname, "../deployments/localhost-raffle.json");

  if (!fs.existsSync(mocksPath) || !fs.existsSync(rafflePath)) {
    throw new Error("Deployments not found. Deploy mocks and raffle first.");
  }

  const mocks = JSON.parse(fs.readFileSync(mocksPath, "utf8"));
  const raffleDeployment = JSON.parse(fs.readFileSync(rafflePath, "utf8"));

  const raffle = await ethers.getContractAt("Raffle", raffleDeployment.address);
  const vrfCoordinator = await ethers.getContractAt("VRFCoordinatorV2_5Mock", mocks.VRFCoordinatorV2_5Mock);

  const [upkeepNeeded] = await raffle.checkUpkeep("0x");
  console.log("Upkeep needed:", upkeepNeeded);

  if (!upkeepNeeded) {
    console.log("Upkeep not needed yet.");

    const state = await raffle.getRaffleState();
    const players = await raffle.getNumberOfPlayers();
    const balance = await ethers.provider.getBalance(raffleDeployment.address);
    const lastTimestamp = await raffle.getLastTimeStamp();
    const interval = await raffle.getInterval();
    const currentBlock = await ethers.provider.getBlock("latest");
    const currentTimestamp = BigInt(currentBlock!.timestamp);
    const timePassed = currentTimestamp - lastTimestamp;

    console.log("State:", state.toString());
    console.log("Players:", players.toString());
    console.log("Balance:", ethers.formatEther(balance), "ETH");
    console.log("Time passed:", timePassed.toString(), "/", interval.toString(), "seconds");

    if (timePassed < interval) {
      console.log(`\nWait ${(interval - timePassed).toString()} more seconds, or mine blocks:`);
      console.log(`  npx hardhat console --network localhost`);
      console.log(`  > await network.provider.send("evm_increaseTime", [${(interval - timePassed).toString()}])`);
      console.log(`  > await network.provider.send("evm_mine")`);
    }
    return;
  }

  console.log("Performing upkeep...");
  const upkeepTx = await raffle.performUpkeep("0x");
  const upkeepReceipt = await upkeepTx.wait(1);

  if (!upkeepReceipt) {
    throw new Error("performUpkeep transaction failed");
  }

  let requestId: bigint | undefined;
  for (const log of upkeepReceipt.logs) {
    try {
      const parsed = raffle.interface.parseLog({
        topics: log.topics as string[],
        data: log.data,
      });
      if (parsed?.name === "RequestedRaffleWinner") {
        requestId = parsed.args[0];
      }
    } catch {
    }
  }

  if (!requestId) {
    throw new Error("Could not find RequestedRaffleWinner event");
  }

  console.log("Request ID:", requestId.toString());
  console.log("Fulfilling random words...");

  const fulfillTx = await vrfCoordinator.fulfillRandomWords(requestId, raffleDeployment.address);
  await fulfillTx.wait(1);

  const winner = await raffle.getRecentWinner();
  console.log("Winner:", winner);
  console.log("Raffle round complete!");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Upkeep script failed");
  process.exitCode = 1;
});
