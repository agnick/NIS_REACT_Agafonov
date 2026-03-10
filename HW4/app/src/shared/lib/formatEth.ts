import { ethers } from "ethers";

export function formatEth(value: bigint, decimals: number = 4): string {
  const formatted = ethers.formatEther(value);
  const parts = formatted.split(".");
  if (parts.length === 1) return formatted;
  const intPart = parts[0] ?? "0";
  const decPart = (parts[1] ?? "").slice(0, decimals);
  if (Number(decPart) === 0) return intPart;
  return `${intPart}.${decPart}`;
}
