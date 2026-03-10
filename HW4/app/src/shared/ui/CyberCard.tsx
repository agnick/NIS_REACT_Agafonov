import { ReactNode } from "react";

interface CyberCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "blue" | "pink" | "purple" | "green";
}

const glowStyles = {
  blue: "border-neon-blue/20 hover:border-neon-blue/40 hover:shadow-neon-blue",
  pink: "border-neon-pink/20 hover:border-neon-pink/40 hover:shadow-neon-pink",
  purple: "border-neon-purple/20 hover:border-neon-purple/40 hover:shadow-neon-purple",
  green: "border-neon-green/20 hover:border-neon-green/40 hover:shadow-neon-green",
};

export function CyberCard({ children, className = "", glowColor = "blue" }: CyberCardProps) {
  return (
    <div
      className={`bg-cyber-card rounded-lg p-6 border transition-all duration-300 ${glowStyles[glowColor]} ${className}`}
    >
      {children}
    </div>
  );
}
