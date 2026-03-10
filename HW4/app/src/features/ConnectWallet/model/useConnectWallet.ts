import { useCallback } from "react";
import { useWeb3 } from "@/app/providers/Web3Provider";
import { SUPPORTED_CHAINS } from "@/shared/constants";

export function useConnectWallet() {
  const { connect, disconnect, isConnected, isConnecting, address, chainId, isCorrectNetwork } = useWeb3();

  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) return;
    const sepoliaChainId = `0x${SUPPORTED_CHAINS.sepolia.chainId.toString(16)}`;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: sepoliaChainId }],
      });
    } catch (err) {
      const switchError = err as { code: number };
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: sepoliaChainId,
              chainName: "Sepolia Testnet",
              nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
              rpcUrls: [SUPPORTED_CHAINS.sepolia.rpcUrl],
              blockExplorerUrls: [SUPPORTED_CHAINS.sepolia.blockExplorer],
            },
          ],
        });
      }
    }
  }, []);

  return {
    connect,
    disconnect,
    switchToSepolia,
    isConnected,
    isConnecting,
    address,
    chainId,
    isCorrectNetwork,
    hasMetaMask: typeof window !== "undefined" && Boolean(window.ethereum),
  };
}
