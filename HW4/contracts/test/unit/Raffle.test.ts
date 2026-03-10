import { expect } from "chai";
import { ethers, network } from "hardhat";
import { Raffle, VRFCoordinatorV2_5Mock } from "../../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const ENTRANCE_FEE = ethers.parseEther("0.01");
const INTERVAL = 30;
const GAS_LANE = "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae";
const CALLBACK_GAS_LIMIT = 500000;

describe("Raffle", function () {
  let raffle: Raffle;
  let vrfCoordinator: VRFCoordinatorV2_5Mock;
  let deployer: HardhatEthersSigner;
  let player: HardhatEthersSigner;
  let subscriptionId: bigint;

  beforeEach(async function () {
    [deployer, player] = await ethers.getSigners();

    const VRFFactory = await ethers.getContractFactory("VRFCoordinatorV2_5Mock");
    vrfCoordinator = await VRFFactory.deploy(
      "1000000000000000",
      "1000000000",
      "4000000000000000"
    );
    await vrfCoordinator.waitForDeployment();

    const txResponse = await vrfCoordinator.createSubscription();
    const txReceipt = await txResponse.wait(1);
    const event = vrfCoordinator.interface.parseLog({
      topics: txReceipt!.logs[0].topics as string[],
      data: txReceipt!.logs[0].data,
    });
    subscriptionId = event?.args[0] ?? BigInt(1);

    await vrfCoordinator.fundSubscription(subscriptionId, ethers.parseEther("10"));

    const vrfAddress = await vrfCoordinator.getAddress();
    const RaffleFactory = await ethers.getContractFactory("Raffle");
    raffle = await RaffleFactory.deploy(
      vrfAddress,
      ENTRANCE_FEE,
      INTERVAL,
      GAS_LANE,
      subscriptionId,
      CALLBACK_GAS_LIMIT
    );
    await raffle.waitForDeployment();

    const raffleAddress = await raffle.getAddress();
    await vrfCoordinator.addConsumer(subscriptionId, raffleAddress);
  });

  describe("constructor", function () {
    it("initializes raffle state to OPEN", async function () {
      const state = await raffle.getRaffleState();
      expect(state).to.equal(0n);
    });

    it("sets entrance fee correctly", async function () {
      const fee = await raffle.getEntranceFee();
      expect(fee).to.equal(ENTRANCE_FEE);
    });

    it("sets interval correctly", async function () {
      const interval = await raffle.getInterval();
      expect(interval).to.equal(BigInt(INTERVAL));
    });
  });

  describe("enterRaffle", function () {
    it("reverts if not enough ETH", async function () {
      await expect(raffle.enterRaffle()).to.be.revertedWithCustomError(raffle, "Raffle__NotEnoughETH");
    });

    it("records player when they enter", async function () {
      await raffle.connect(player).enterRaffle({ value: ENTRANCE_FEE });
      const recorded = await raffle.getPlayer(0);
      expect(recorded).to.equal(player.address);
    });

    it("emits RaffleEnter event", async function () {
      await expect(raffle.connect(player).enterRaffle({ value: ENTRANCE_FEE }))
        .to.emit(raffle, "RaffleEnter")
        .withArgs(player.address);
    });

    it("does not allow entry when raffle is CALCULATING", async function () {
      await raffle.connect(player).enterRaffle({ value: ENTRANCE_FEE });
      await network.provider.send("evm_increaseTime", [INTERVAL + 1]);
      await network.provider.send("evm_mine");
      await raffle.performUpkeep("0x");
      await expect(
        raffle.connect(player).enterRaffle({ value: ENTRANCE_FEE })
      ).to.be.revertedWithCustomError(raffle, "Raffle__NotOpen");
    });
  });

  describe("checkUpkeep", function () {
    it("returns false if no players", async function () {
      await network.provider.send("evm_increaseTime", [INTERVAL + 1]);
      await network.provider.send("evm_mine");
      const [upkeepNeeded] = await raffle.checkUpkeep("0x");
      expect(upkeepNeeded).to.be.false;
    });

    it("returns false if not enough time passed", async function () {
      await raffle.connect(player).enterRaffle({ value: ENTRANCE_FEE });
      const [upkeepNeeded] = await raffle.checkUpkeep("0x");
      expect(upkeepNeeded).to.be.false;
    });

    it("returns true when conditions are met", async function () {
      await raffle.connect(player).enterRaffle({ value: ENTRANCE_FEE });
      await network.provider.send("evm_increaseTime", [INTERVAL + 1]);
      await network.provider.send("evm_mine");
      const [upkeepNeeded] = await raffle.checkUpkeep("0x");
      expect(upkeepNeeded).to.be.true;
    });
  });

  describe("performUpkeep", function () {
    it("reverts if upkeep not needed", async function () {
      await expect(raffle.performUpkeep("0x")).to.be.revertedWithCustomError(
        raffle,
        "Raffle__UpkeepNotNeeded"
      );
    });

    it("changes state to CALCULATING", async function () {
      await raffle.connect(player).enterRaffle({ value: ENTRANCE_FEE });
      await network.provider.send("evm_increaseTime", [INTERVAL + 1]);
      await network.provider.send("evm_mine");
      await raffle.performUpkeep("0x");
      const state = await raffle.getRaffleState();
      expect(state).to.equal(1n);
    });

    it("emits RequestedRaffleWinner event", async function () {
      await raffle.connect(player).enterRaffle({ value: ENTRANCE_FEE });
      await network.provider.send("evm_increaseTime", [INTERVAL + 1]);
      await network.provider.send("evm_mine");
      await expect(raffle.performUpkeep("0x")).to.emit(raffle, "RequestedRaffleWinner");
    });
  });

  describe("fulfillRandomWords", function () {
    it("picks a winner, resets, and sends money", async function () {
      const accounts = await ethers.getSigners();
      const additionalPlayers = 3;

      for (let i = 1; i <= additionalPlayers; i++) {
        await raffle.connect(accounts[i]).enterRaffle({ value: ENTRANCE_FEE });
      }

      await network.provider.send("evm_increaseTime", [INTERVAL + 1]);
      await network.provider.send("evm_mine");

      const tx = await raffle.performUpkeep("0x");
      const receipt = await tx.wait(1);

      let requestId: bigint | undefined;
      for (const log of receipt!.logs) {
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

      const raffleAddress = await raffle.getAddress();

      await expect(
        vrfCoordinator.fulfillRandomWords(requestId!, raffleAddress)
      ).to.emit(raffle, "WinnerPicked");

      const winner = await raffle.getRecentWinner();
      const state = await raffle.getRaffleState();
      const players = await raffle.getNumberOfPlayers();

      expect(state).to.equal(0n);
      expect(players).to.equal(0n);
      expect(winner).to.not.equal(ethers.ZeroAddress);
    });
  });
});
