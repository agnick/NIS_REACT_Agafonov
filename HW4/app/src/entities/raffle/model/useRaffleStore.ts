import { create } from "zustand";
import { RaffleData, RaffleState } from "@/shared/types";

interface RaffleStore {
  data: RaffleData;
  isLoading: boolean;
  error: string | null;
  setData: (data: Partial<RaffleData>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialData: RaffleData = {
  entranceFee: 0n,
  numberOfPlayers: 0n,
  recentWinner: "",
  raffleState: RaffleState.OPEN,
  lastTimeStamp: 0n,
  interval: 0n,
  balance: 0n,
};

export const useRaffleStore = create<RaffleStore>((set) => ({
  data: initialData,
  isLoading: true,
  error: null,
  setData: (newData) =>
    set((state) => ({ data: { ...state.data, ...newData } })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ data: initialData, isLoading: true, error: null }),
}));
