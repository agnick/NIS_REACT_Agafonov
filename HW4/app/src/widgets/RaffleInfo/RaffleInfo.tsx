import { useRaffleStore } from "@/entities/raffle";
import { useCountdown } from "@/shared/hooks";
import { formatEth, formatAddress } from "@/shared/lib";
import { StatusBadge, CyberCard, Skeleton } from "@/shared/ui";
import { useWeb3 } from "@/app/providers/Web3Provider";
import { getExplorerAddressUrl, SUPPORTED_CHAINS } from "@/shared/constants";
import { useRaffleContract } from "@/entities/raffle";

export function RaffleInfo() {
  const { chainId, isConnected } = useWeb3();
  const { contractAddress } = useRaffleContract();
  const data = useRaffleStore((s) => s.data);
  const isLoading = useRaffleStore((s) => s.isLoading);
  const error = useRaffleStore((s) => s.error);
  const countdown = useCountdown(data.lastTimeStamp, data.interval);
  const isLocalhost = chainId === SUPPORTED_CHAINS.localhost.chainId;
  const showLocalAutomationHint = isLocalhost && !isLoading && data.numberOfPlayers > 0n;

  if (!isConnected) {
    return (
      <CyberCard className="text-center py-12">
        <p className="text-gray-400 font-display text-lg">
          Подключите кошелёк для просмотра данных лотереи
        </p>
      </CyberCard>
    );
  }

  if (error) {
    return (
      <CyberCard glowColor="pink" className="text-center py-8">
        <p className="text-neon-pink font-display mb-2">Ошибка загрузки</p>
        <p className="text-gray-400 text-sm">{error}</p>
      </CyberCard>
    );
  }

  const explorerUrl =
    contractAddress && chainId
      ? getExplorerAddressUrl(chainId, contractAddress)
      : "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <CyberCard glowColor="blue">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-xs font-display uppercase tracking-wider">
            Статус
          </span>
          {isLoading ? (
            <Skeleton className="h-6 w-20" />
          ) : (
            <StatusBadge state={data.raffleState} />
          )}
        </div>
        <div className="mt-4">
          <span className="text-gray-400 text-xs font-display uppercase tracking-wider">
            До розыгрыша
          </span>
          {isLoading ? (
            <Skeleton className="h-10 w-28 mt-2" />
          ) : (
            <p className="text-3xl font-display font-bold neon-text-blue mt-1">
              {countdown.formatted}
            </p>
          )}
          {showLocalAutomationHint && (
            <p className="text-gray-500 text-xs mt-3 leading-relaxed">
              На Hardhat Local Chainlink Automation не запускается автоматически.
              {countdown.isExpired
                ? " После истечения таймера выполните `npm run upkeep` в папке contracts."
                : " После окончания таймера розыгрыш нужно запустить вручную через `npm run upkeep`."}
            </p>
          )}
        </div>
      </CyberCard>

      <CyberCard glowColor="pink">
        <span className="text-gray-400 text-xs font-display uppercase tracking-wider">
          Призовой фонд
        </span>
        {isLoading ? (
          <Skeleton className="h-10 w-32 mt-2" />
        ) : (
          <p className="text-3xl font-display font-bold neon-text-pink mt-1">
            {formatEth(data.balance)} ETH
          </p>
        )}
        <div className="mt-4">
          <span className="text-gray-400 text-xs font-display uppercase tracking-wider">
            Участников
          </span>
          {isLoading ? (
            <Skeleton className="h-6 w-12 mt-1" />
          ) : (
            <p className="text-xl font-display font-bold text-white mt-1">
              {data.numberOfPlayers.toString()}
            </p>
          )}
        </div>
      </CyberCard>

      <CyberCard glowColor="purple" className="md:col-span-2 lg:col-span-1">
        <span className="text-gray-400 text-xs font-display uppercase tracking-wider">
          Последний победитель
        </span>
        {isLoading ? (
          <Skeleton className="h-6 w-36 mt-2" />
        ) : (
          <p className="neon-text-purple font-mono text-sm mt-2 break-all">
            {data.recentWinner && data.recentWinner !== "0x0000000000000000000000000000000000000000"
              ? formatAddress(data.recentWinner)
              : "Ещё нет"}
          </p>
        )}

        <div className="mt-4">
          <span className="text-gray-400 text-xs font-display uppercase tracking-wider">
            Стоимость входа
          </span>
          {isLoading ? (
            <Skeleton className="h-6 w-24 mt-1" />
          ) : (
            <p className="text-white font-mono text-sm mt-1">
              {formatEth(data.entranceFee)} ETH
            </p>
          )}
        </div>

        {contractAddress && (
          <div className="mt-4">
            <span className="text-gray-400 text-xs font-display uppercase tracking-wider">
              Контракт
            </span>
            {explorerUrl ? (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-neon-blue/70 hover:text-neon-blue text-xs font-mono mt-1 transition-colors break-all"
              >
                {formatAddress(contractAddress)}
              </a>
            ) : (
              <p className="text-gray-500 text-xs font-mono mt-1 break-all">
                {formatAddress(contractAddress)}
              </p>
            )}
          </div>
        )}
      </CyberCard>
    </div>
  );
}
