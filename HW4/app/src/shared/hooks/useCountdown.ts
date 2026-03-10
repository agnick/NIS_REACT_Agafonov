import { useState, useEffect, useCallback } from "react";

interface CountdownResult {
  timeLeft: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
}

export function useCountdown(lastTimeStamp: bigint, interval: bigint): CountdownResult {
  const calculateTimeLeft = useCallback((): number => {
    if (lastTimeStamp === 0n || interval === 0n) return 0;
    const nextDraw = Number(lastTimeStamp) + Number(interval);
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, nextDraw - now);
  }, [lastTimeStamp, interval]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    timeLeft,
    minutes,
    seconds,
    isExpired: timeLeft === 0,
    formatted,
  };
}
