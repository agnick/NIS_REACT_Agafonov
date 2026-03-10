export type ContractAddressMap = Record<string, Record<string, string[]>>;

export enum RaffleState {
  OPEN = 0,
  CALCULATING = 1,
}

export interface RaffleData {
  entranceFee: bigint;
  numberOfPlayers: bigint;
  recentWinner: string;
  raffleState: RaffleState;
  lastTimeStamp: bigint;
  interval: bigint;
  balance: bigint;
}

export interface RaffleEvent {
  id: string;
  type: "enter" | "winner" | "requested";
  address: string;
  blockNumber: number;
  logIndex: number;
  transactionHash: string;
  timestamp: number;
}
