export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
  isConnecting: boolean;
  error: string | null;
}

export type WalletAction =
  | { type: "CONNECT_START" }
  | { type: "CONNECT_SUCCESS"; payload: { address: string; chainId: number } }
  | { type: "CONNECT_ERROR"; payload: string }
  | { type: "DISCONNECT" }
  | { type: "CHAIN_CHANGED"; payload: number }
  | { type: "ACCOUNT_CHANGED"; payload: string | null };
