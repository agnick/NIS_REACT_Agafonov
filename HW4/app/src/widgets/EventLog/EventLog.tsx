import { useEventStore } from "@/entities/event";
import { formatAddress } from "@/shared/lib";
import { useWeb3 } from "@/app/providers/Web3Provider";
import { getExplorerTxUrl } from "@/shared/constants";
import { RaffleEvent } from "@/shared/types";
import { CyberCard } from "@/shared/ui";

function getEventLabel(type: RaffleEvent["type"]): string {
  switch (type) {
    case "enter":
      return "ВХОД";
    case "winner":
      return "ПОБЕДИТЕЛЬ";
    case "requested":
      return "ЗАПРОС VRF";
  }
}

function getEventColor(type: RaffleEvent["type"]): string {
  switch (type) {
    case "enter":
      return "text-neon-blue";
    case "winner":
      return "text-neon-green";
    case "requested":
      return "text-neon-purple";
  }
}

interface EventRowProps {
  event: RaffleEvent;
  chainId: number | null;
}

function EventRow({ event, chainId }: EventRowProps) {
  const txUrl = chainId ? getExplorerTxUrl(chainId, event.transactionHash) : "";
  const time = new Date(event.timestamp).toLocaleTimeString("ru-RU");

  return (
    <div className="flex items-start gap-3 py-2 border-b border-cyber-border/50 last:border-0 animate-fade-in">
      <span className="text-gray-600 text-xs font-mono shrink-0 mt-0.5">
        {time}
      </span>
      <span
        className={`text-xs font-display font-bold uppercase tracking-wider shrink-0 w-24 ${getEventColor(event.type)}`}
      >
        {getEventLabel(event.type)}
      </span>
      <span className="text-gray-300 text-xs font-mono truncate flex-1">
        {event.address ? formatAddress(event.address) : "—"}
      </span>
      {txUrl && (
        <a
          href={txUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-neon-blue text-xs transition-colors shrink-0"
        >
          TX
        </a>
      )}
    </div>
  );
}

export function EventLog() {
  const { chainId } = useWeb3();
  const events = useEventStore((s) => s.events);

  return (
    <CyberCard className="scanline-overlay">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-gray-300">
          Лог событий
        </h3>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-sm font-mono">
            Ожидание событий...
          </p>
          <p className="text-gray-700 text-xs mt-1">
            События появятся в реальном времени
          </p>
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto space-y-0">
          {events.map((event) => (
            <EventRow key={event.id} event={event} chainId={chainId} />
          ))}
        </div>
      )}
    </CyberCard>
  );
}
