import { Header } from "@/widgets/Header";
import { Footer } from "@/widgets/Footer";
import { RaffleInfo } from "@/widgets/RaffleInfo";
import { EventLog } from "@/widgets/EventLog";
import { EnterRaffleButton } from "@/features/EnterRaffle";
import { useRaffleData } from "@/entities/raffle";
import { useEventListener } from "@/entities/event";
import { useWeb3 } from "@/app/providers/Web3Provider";

export function HomePage() {
  useRaffleData();
  useEventListener();
  const { isConnected } = useWeb3();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-8">
        <section className="text-center py-8 md:py-12 animate-fade-in">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            <span className="neon-text-pink">Децентрализованная</span>
            <br />
            <span className="text-gray-200">лотерея на</span>{" "}
            <span className="neon-text-blue">Ethereum</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Честный розыгрыш с использованием Chainlink VRF.
            Полностью прозрачный и автоматический.
          </p>
        </section>

        {isConnected && (
          <section className="flex justify-center animate-slide-up">
            <EnterRaffleButton />
          </section>
        )}

        <section className="animate-slide-up">
          <RaffleInfo />
        </section>

        {isConnected && (
          <section className="animate-slide-up">
            <EventLog />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
