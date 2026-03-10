export const SUPPORTED_CHAINS = {
  sepolia: {
    chainId: 11155111,
    name: "Sepolia",
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/demo",
    blockExplorer: "https://sepolia.etherscan.io",
    currency: "ETH",
  },
  localhost: {
    chainId: 31337,
    name: "Localhost",
    rpcUrl: "http://127.0.0.1:8545",
    blockExplorer: "",
    currency: "ETH",
  },
} as const;

export type SupportedChainId = 11155111 | 31337;

export const SUPPORTED_CHAIN_IDS: readonly number[] = [
  SUPPORTED_CHAINS.sepolia.chainId,
  SUPPORTED_CHAINS.localhost.chainId,
];

export function getChainConfig(chainId: number) {
  if (chainId === SUPPORTED_CHAINS.sepolia.chainId) return SUPPORTED_CHAINS.sepolia;
  if (chainId === SUPPORTED_CHAINS.localhost.chainId) return SUPPORTED_CHAINS.localhost;
  return null;
}

export function getBlockExplorerUrl(chainId: number): string {
  const config = getChainConfig(chainId);
  return config?.blockExplorer ?? "";
}

export function getExplorerTxUrl(chainId: number, txHash: string): string {
  const explorer = getBlockExplorerUrl(chainId);
  if (!explorer) return "";
  return `${explorer}/tx/${txHash}`;
}

export function getExplorerAddressUrl(chainId: number, address: string): string {
  const explorer = getBlockExplorerUrl(chainId);
  if (!explorer) return "";
  return `${explorer}/address/${address}`;
}
