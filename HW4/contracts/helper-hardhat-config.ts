interface NetworkConfig {
  name: string;
  vrfCoordinatorV2_5?: string;
  entranceFee: string;
  gasLane: string;
  subscriptionId: string;
  callbackGasLimit: number;
  interval: number;
}

type NetworkConfigMap = Record<number, NetworkConfig>;

const networkConfig: NetworkConfigMap = {
  11155111: {
    name: "sepolia",
    vrfCoordinatorV2_5: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
    entranceFee: "10000000000000000",
    gasLane: "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
    subscriptionId: process.env.VRF_SUBSCRIPTION_ID || "0",
    callbackGasLimit: 500000,
    interval: 30,
  },
  31337: {
    name: "localhost",
    entranceFee: "10000000000000000",
    gasLane: "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
    subscriptionId: "1",
    callbackGasLimit: 500000,
    interval: 30,
  },
};

const developmentChains = ["hardhat", "localhost"];

export { networkConfig, developmentChains, NetworkConfig };
