import { useState, useCallback } from "react";
import { useRaffleContract } from "@/entities/raffle";
import { useRaffleStore } from "@/entities/raffle";
import { useWeb3 } from "@/app/providers/Web3Provider";
import toast from "react-hot-toast";
import { RaffleState } from "@/shared/types";

type EnterStatus = "idle" | "loading" | "success" | "error";

export function useEnterRaffle() {
  const [status, setStatus] = useState<EnterStatus>("idle");
  const { writeContract, isReady } = useRaffleContract();
  const { isConnected, isCorrectNetwork } = useWeb3();
  const entranceFee = useRaffleStore((s) => s.data.entranceFee);
  const raffleState = useRaffleStore((s) => s.data.raffleState);

  const canEnter =
    isConnected &&
    isCorrectNetwork &&
    isReady &&
    raffleState === RaffleState.OPEN &&
    status !== "loading";

  const enterRaffle = useCallback(async () => {
    if (!writeContract || !canEnter) return;

    try {
      setStatus("loading");
      toast.loading("Отправка транзакции...", { id: "enter-raffle" });

      const tx = await writeContract.enterRaffle({ value: entranceFee });
      toast.loading("Ожидание подтверждения...", { id: "enter-raffle" });

      await tx.wait(1);
      setStatus("success");
      toast.success("Вы вошли в розыгрыш!", { id: "enter-raffle" });

      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      const message = err instanceof Error ? err.message : "Ошибка при входе в розыгрыш";

      if (message.includes("user rejected")) {
        toast.error("Транзакция отклонена", { id: "enter-raffle" });
      } else if (message.includes("Raffle__NotEnoughETH")) {
        toast.error("Недостаточно ETH для входа", { id: "enter-raffle" });
      } else if (message.includes("Raffle__NotOpen")) {
        toast.error("Лотерея сейчас закрыта", { id: "enter-raffle" });
      } else {
        toast.error("Ошибка транзакции", { id: "enter-raffle" });
      }

      setTimeout(() => setStatus("idle"), 3000);
    }
  }, [writeContract, canEnter, entranceFee]);

  return { enterRaffle, status, canEnter };
}
