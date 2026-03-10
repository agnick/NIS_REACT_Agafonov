import { useConnectWallet } from "../model/useConnectWallet";
import { formatAddress } from "@/shared/lib";
import { getChainConfig } from "@/shared/constants";

export function ConnectWalletButton() {
  const {
    connect,
    disconnect,
    switchToSepolia,
    isConnected,
    isConnecting,
    address,
    chainId,
    isCorrectNetwork,
    hasMetaMask,
  } = useConnectWallet();

  if (!hasMetaMask) {
    return (
      <a
        href="https://metamask.io/download/"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-neon text-xs"
      >
        Установить MetaMask
      </a>
    );
  }

  if (isConnected && address) {
    const chainConfig = chainId ? getChainConfig(chainId) : null;

    return (
      <div className="flex items-center gap-3">
        {!isCorrectNetwork && (
          <button onClick={switchToSepolia} className="btn-neon-pink text-xs py-1 px-3">
            Переключить сеть
          </button>
        )}
        <div className="flex items-center gap-2 text-xs">
          {chainConfig && (
            <span className="text-neon-blue opacity-70">{chainConfig.name}</span>
          )}
          <span className="neon-text-green font-mono">{formatAddress(address)}</span>
        </div>
        <button
          onClick={disconnect}
          className="text-gray-500 hover:text-neon-pink text-xs transition-colors"
        >
          Выход
        </button>
      </div>
    );
  }

  return (
    <button onClick={connect} disabled={isConnecting} className="btn-neon text-xs">
      {isConnecting ? "Подключение..." : "Подключить кошелёк"}
    </button>
  );
}
