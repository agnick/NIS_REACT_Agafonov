import {Toaster} from "react-hot-toast";
import {Web3Provider} from "./providers/Web3Provider";
import {Router} from "./Router";
import {ErrorBoundary} from "@/shared/ui";

export function App() {
    return (
        <ErrorBoundary>
            <Web3Provider>
                <Router/>
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: "#12121a",
                            color: "#e2e8f0",
                            border: "1px solid rgba(0, 240, 255, 0.2)",
                            fontFamily: '"Share Tech Mono", monospace',
                            fontSize: "14px",
                        },
                        success: {
                            iconTheme: {primary: "#39ff14", secondary: "#0a0a0f"},
                        },
                        error: {
                            iconTheme: {primary: "#ff2d75", secondary: "#0a0a0f"},
                        },
                    }}
                />
            </Web3Provider>
        </ErrorBoundary>
    );
}
