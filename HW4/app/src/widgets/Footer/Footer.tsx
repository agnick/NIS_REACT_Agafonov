export function Footer() {
  return (
    <footer className="border-t border-cyber-border py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-gray-600 text-xs font-mono">
          DROP LOTTERY &copy; {new Date().getFullYear()} &mdash; Децентрализованная лотерея на Ethereum
        </p>
        <p className="text-gray-700 text-xs mt-1">
          Работает на Chainlink VRF v2.5 + Automation
        </p>
      </div>
    </footer>
  );
}
