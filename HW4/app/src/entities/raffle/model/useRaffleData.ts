import {useEffect, useCallback} from "react";
import {useRaffleStore} from "./useRaffleStore";
import {useRaffleContract} from "./useRaffleContract";
import {useWeb3} from "@/app/providers/Web3Provider";
import {RaffleState} from "@/shared/types";

export function useRaffleData() {
    const {provider} = useWeb3();
    const {readContract, contractAddress, isReady} = useRaffleContract();
    const {setData, setLoading, setError} = useRaffleStore();
    const data = useRaffleStore((s) => s.data);
    const isLoading = useRaffleStore((s) => s.isLoading);
    const error = useRaffleStore((s) => s.error);

    const fetchData = useCallback(async () => {
        if (!readContract || !provider || !contractAddress) return;

        try {
            setLoading(true);
            setError(null);

            const [
                entranceFee,
                numberOfPlayers,
                recentWinner,
                raffleState,
                lastTimeStamp,
                interval,
                balance,
            ] = await Promise.all([
                readContract.getEntranceFee() as Promise<bigint>,
                readContract.getNumberOfPlayers() as Promise<bigint>,
                readContract.getRecentWinner() as Promise<string>,
                readContract.getRaffleState() as Promise<bigint>,
                readContract.getLastTimeStamp() as Promise<bigint>,
                readContract.getInterval() as Promise<bigint>,
                provider.getBalance(contractAddress),
            ]);

            setData({
                entranceFee,
                numberOfPlayers,
                recentWinner,
                raffleState: Number(raffleState) as RaffleState,
                lastTimeStamp,
                interval,
                balance,
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Ошибка загрузки данных";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [readContract, provider, contractAddress, setData, setLoading, setError]);

    useEffect(() => {
        if (!isReady) return;
        fetchData();
    }, [isReady, fetchData]);

    useEffect(() => {
        if (!readContract || !isReady) return;

        const handleRaffleEnter = () => {
            fetchData();
        };

        const handleWinnerPicked = () => {
            fetchData();
        };

        const handleRequested = () => {
            setData({raffleState: RaffleState.CALCULATING});
        };

        readContract.on("RaffleEnter", handleRaffleEnter);
        readContract.on("WinnerPicked", handleWinnerPicked);
        readContract.on("RequestedRaffleWinner", handleRequested);

        return () => {
            readContract.off("RaffleEnter", handleRaffleEnter);
            readContract.off("WinnerPicked", handleWinnerPicked);
            readContract.off("RequestedRaffleWinner", handleRequested);
        };
    }, [readContract, isReady, fetchData, setData]);

    return {data, isLoading, error, refetch: fetchData};
}
