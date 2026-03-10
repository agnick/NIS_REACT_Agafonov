import {useMemo} from "react";
import {ethers} from "ethers";
import {useWeb3} from "@/app/providers/Web3Provider";
import {contractAddresses, raffleAbi, SUPPORTED_CHAIN_IDS} from "@/shared/constants";

type RaffleContract = ethers.Contract & {
    getEntranceFee: () => Promise<bigint>;
    getNumberOfPlayers: () => Promise<bigint>;
    getRecentWinner: () => Promise<string>;
    getRaffleState: () => Promise<bigint>;
    getLastTimeStamp: () => Promise<bigint>;
    getInterval: () => Promise<bigint>;
    enterRaffle: (overrides: { value: bigint }) => Promise<ethers.ContractTransactionResponse>;
    filters: ethers.Contract["filters"] & {
        RaffleEnter: () => ethers.DeferredTopicFilter;
        RequestedRaffleWinner: () => ethers.DeferredTopicFilter;
        WinnerPicked: () => ethers.DeferredTopicFilter;
    };
};

export function useRaffleContract() {
    const {provider, signer, chainId, isConnected} = useWeb3();

    const contractAddress = useMemo(() => {
        if (!chainId) return null;
        const chainAddresses = contractAddresses[String(chainId)];
        const addresses = chainAddresses?.["Raffle"];
        if (!addresses || addresses.length === 0) return null;
        const addr = addresses[0];
        if (!addr || addr === "0x0000000000000000000000000000000000000000") return null;
        return addr;
    }, [chainId]);

    const readContract = useMemo(() => {
        if (!provider || !contractAddress) return null;
        return new ethers.Contract(contractAddress, raffleAbi, provider) as RaffleContract;
    }, [provider, contractAddress]);

    const writeContract = useMemo(() => {
        if (!signer || !contractAddress) return null;
        return new ethers.Contract(contractAddress, raffleAbi, signer) as RaffleContract;
    }, [signer, contractAddress]);

    const isSupported = chainId !== null && SUPPORTED_CHAIN_IDS.includes(chainId);

    return {
        readContract,
        writeContract,
        contractAddress,
        isSupported,
        isReady: isConnected && isSupported && contractAddress !== null,
    };
}
