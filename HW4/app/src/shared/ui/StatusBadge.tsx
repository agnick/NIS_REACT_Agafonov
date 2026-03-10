import { RaffleState } from "../types/contracts";

interface StatusBadgeProps {
  state: RaffleState;
}

export function StatusBadge({ state }: StatusBadgeProps) {
  const isOpen = state === RaffleState.OPEN;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-display uppercase tracking-wider ${
        isOpen
          ? "bg-neon-green/10 text-neon-green border border-neon-green/30"
          : "bg-neon-pink/10 text-neon-pink border border-neon-pink/30"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isOpen ? "bg-neon-green animate-pulse-neon" : "bg-neon-pink animate-pulse-neon"
        }`}
      />
      {isOpen ? "Открыта" : "Розыгрыш..."}
    </span>
  );
}
