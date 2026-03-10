import { useEnterRaffle } from "../model/useEnterRaffle";
import { useRaffleStore } from "@/entities/raffle";
import { formatEth } from "@/shared/lib";
import { Skeleton } from "@/shared/ui";

export function EnterRaffleButton() {
  const { enterRaffle, status, canEnter } = useEnterRaffle();
  const entranceFee = useRaffleStore((s) => s.data.entranceFee);
  const isLoading = useRaffleStore((s) => s.isLoading);

  const buttonText = (() => {
    switch (status) {
      case "loading":
        return "Обработка...";
      case "success":
        return "Успешно!";
      case "error":
        return "Ошибка";
      default:
        return "Войти в розыгрыш";
    }
  })();

  const buttonClass = (() => {
    switch (status) {
      case "success":
        return "border-neon-green text-neon-green shadow-neon-green";
      case "error":
        return "border-neon-pink text-neon-pink shadow-neon-pink";
      default:
        return "";
    }
  })();

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={enterRaffle}
        disabled={!canEnter || status === "loading"}
        className={`btn-neon-pink w-full max-w-xs py-4 text-base ${buttonClass}`}
      >
        {status === "loading" ? (
          <span className="animate-pulse">{buttonText}</span>
        ) : (
          buttonText
        )}
      </button>
      <div className="text-center">
        {isLoading ? (
          <Skeleton className="h-4 w-32 mx-auto" />
        ) : (
          <p className="text-gray-400 text-sm">
            Стоимость входа:{" "}
            <span className="neon-text-blue font-bold">
              {formatEth(entranceFee)} ETH
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
