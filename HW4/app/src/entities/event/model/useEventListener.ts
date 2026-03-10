import {useEffect} from "react";
import {ethers} from "ethers";
import {useRaffleContract} from "@/entities/raffle";
import {useEventStore} from "./useEventStore";
import {RaffleEvent} from "@/shared/types";
import {useWeb3} from "@/app/providers/Web3Provider";

function isEventLog(log: ethers.Log | ethers.EventLog): log is ethers.EventLog {
    return "args" in log;
}

export function useEventListener() {
    const {readContract, isReady} = useRaffleContract();
    const {provider} = useWeb3();
    const addEvent = useEventStore((s) => s.addEvent);
    const setEvents = useEventStore((s) => s.setEvents);
    const clear = useEventStore((s) => s.clear);

    useEffect(() => {
        if (!readContract || !isReady || !provider) return;

        let isCancelled = false;
        const blockTimestampCache = new Map<number, Promise<number>>();

        const getTimestamp = async (blockNumber: number): Promise<number> => {
            const cached = blockTimestampCache.get(blockNumber);
            if (cached) return cached;

            const timestampPromise = provider.getBlock(blockNumber).then((block) => {
                if (!block) return Date.now();
                return block.timestamp * 1000;
            });

            blockTimestampCache.set(blockNumber, timestampPromise);
            return timestampPromise;
        };

        const buildEvent = async (
            type: RaffleEvent["type"],
            address: string,
            eventLog: ethers.EventLog
        ): Promise<RaffleEvent> => {
            const timestamp = await getTimestamp(eventLog.blockNumber);

            return {
                id: `${type}-${eventLog.transactionHash}-${eventLog.index}`,
                type,
                address,
                blockNumber: eventLog.blockNumber,
                logIndex: eventLog.index,
                transactionHash: eventLog.transactionHash,
                timestamp,
            };
        };

        const loadHistory = async () => {
            try {
                const [enterLogs, requestedLogs, winnerLogs] = await Promise.all([
                    readContract.queryFilter(readContract.filters.RaffleEnter()),
                    readContract.queryFilter(readContract.filters.RequestedRaffleWinner()),
                    readContract.queryFilter(readContract.filters.WinnerPicked()),
                ]);

                const historicalEvents = await Promise.all([
                    ...enterLogs
                        .filter(isEventLog)
                        .map((log) => buildEvent("enter", log.args[0] as string, log)),
                    ...requestedLogs
                        .filter(isEventLog)
                        .map((log) => buildEvent("requested", "", log)),
                    ...winnerLogs
                        .filter(isEventLog)
                        .map((log) => buildEvent("winner", log.args[0] as string, log)),
                ]);

        if (!isCancelled) {
          const liveEvents = useEventStore.getState().events;
          setEvents([...historicalEvents, ...liveEvents]);
        }
      } catch {
      }
    };

        const addLiveEvent = async (
            type: RaffleEvent["type"],
            address: string,
            eventLog: ethers.EventLog
        ) => {
      try {
        const event = await buildEvent(type, address, eventLog);
        if (!isCancelled) addEvent(event);
      } catch {
      }
    };

        const handleEnter = (...args: unknown[]) => {
            const eventLog = args[args.length - 1] as ethers.EventLog;
            const player = args[0] as string;
            void addLiveEvent("enter", player, eventLog);
        };

        const handleWinner = (...args: unknown[]) => {
            const eventLog = args[args.length - 1] as ethers.EventLog;
            const winner = args[0] as string;
            void addLiveEvent("winner", winner, eventLog);
        };

        const handleRequested = (...args: unknown[]) => {
            const eventLog = args[args.length - 1] as ethers.EventLog;
            void addLiveEvent("requested", "", eventLog);
        };

        clear();
        void loadHistory();
        readContract.on("RaffleEnter", handleEnter);
        readContract.on("RequestedRaffleWinner", handleRequested);
        readContract.on("WinnerPicked", handleWinner);

        return () => {
            isCancelled = true;
            readContract.off("RaffleEnter", handleEnter);
            readContract.off("RequestedRaffleWinner", handleRequested);
            readContract.off("WinnerPicked", handleWinner);
        };
    }, [readContract, isReady, provider, addEvent, setEvents, clear]);
}
