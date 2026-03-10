import { ConnectWalletButton } from "@/features/ConnectWallet";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cyber-darker/80 backdrop-blur-md border-b border-cyber-border">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-neon-blue/50 flex items-center justify-center">
            <span className="neon-text-blue font-display text-sm font-bold">DL</span>
          </div>
          <h1 className="font-display text-lg md:text-xl font-bold tracking-wider">
            <span className="neon-text-blue">DROP</span>{" "}
            <span className="text-gray-300">LOTTERY</span>
          </h1>
        </div>
        <ConnectWalletButton />
      </div>
    </header>
  );
}
