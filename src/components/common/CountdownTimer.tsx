"use client";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export const CountdownTimer = ({ endTime }: { endTime: string }) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeRemaining("Debate Ended");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setIsUrgent(diff < 60 * 60 * 1000); // Less than 1 hour
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span className={`font-medium ${isUrgent ? "text-red-500" : ""}`}>
        {timeRemaining}
      </span>
    </div>
  );
};
