import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    ReactNode,
    useMemo,
    useRef,
} from "react";
import {ethers} from "ethers";
import {SUPPORTED_CHAIN_IDS} from "@/shared/constants";

interface Web3ContextValue {
    provider: ethers.BrowserProvider | null;
    signer: ethers.JsonRpcSigner | null;
    address: string | null;
    chainId: number | null;
    isConnected: boolean;
    isCorrectNetwork: boolean;
    isConnecting: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const Web3Context = createContext<Web3ContextValue | null>(null);

export function useWeb3(): Web3ContextValue {
    const context = useContext(Web3Context);
    if (!context) {
        throw new Error("useWeb3 must be used within Web3Provider");
    }
    return context;
}

interface Web3ProviderProps {
    children: ReactNode;
}

export function Web3Provider({children}: Web3ProviderProps) {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const providerRef = useRef<ethers.BrowserProvider | null>(null);

    const isConnected = address !== null;
    const isCorrectNetwork = chainId !== null && SUPPORTED_CHAIN_IDS.includes(chainId);

    const setupProvider = useCallback(async (browserProvider: ethers.BrowserProvider) => {
        const network = await browserProvider.getNetwork();
        const currentChainId = Number(network.chainId);
        const currentSigner = await browserProvider.getSigner();
        const currentAddress = await currentSigner.getAddress();

        providerRef.current = browserProvider;
        setProvider(browserProvider);
        setSigner(currentSigner);
        setAddress(currentAddress);
        setChainId(currentChainId);
    }, []);

    const connect = useCallback(async () => {
        if (!window.ethereum) return;

        try {
            setIsConnecting(true);
            await window.ethereum.request({method: "eth_requestAccounts"});
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            await setupProvider(browserProvider);
        } catch {
            setProvider(null);
            setSigner(null);
            setAddress(null);
            setChainId(null);
        } finally {
            setIsConnecting(false);
        }
    }, [setupProvider]);

    const disconnect = useCallback(() => {
        providerRef.current = null;
        setProvider(null);
        setSigner(null);
        setAddress(null);
        setChainId(null);
        localStorage.removeItem("wallet_connected");
    }, []);

    useEffect(() => {
        if (!window.ethereum) return;

        const handleAccountsChanged = async (...args: unknown[]) => {
            const accounts = args[0] as string[];
            if (accounts.length === 0) {
                disconnect();
            } else if (providerRef.current) {
                const newSigner = await providerRef.current.getSigner();
                const newAddress = await newSigner.getAddress();
                setSigner(newSigner);
                setAddress(newAddress);
            }
        };

        const handleChainChanged = () => {
            window.location.reload();
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);

        return () => {
            window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
            window.ethereum?.removeListener("chainChanged", handleChainChanged);
        };
    }, [disconnect]);

    useEffect(() => {
        const wasConnected = localStorage.getItem("wallet_connected");
        if (wasConnected === "true" && window.ethereum) {
            connect();
        }
    }, [connect]);

    useEffect(() => {
        if (isConnected) {
            localStorage.setItem("wallet_connected", "true");
        }
    }, [isConnected]);

    const value = useMemo<Web3ContextValue>(
        () => ({
            provider,
            signer,
            address,
            chainId,
            isConnected,
            isCorrectNetwork,
            isConnecting,
            connect,
            disconnect,
        }),
        [provider, signer, address, chainId, isConnected, isCorrectNetwork, isConnecting, connect, disconnect]
    );

    return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}
