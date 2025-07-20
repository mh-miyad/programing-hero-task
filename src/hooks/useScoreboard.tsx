"use client";
import { Debate, LeaderboardEntry } from "@/Type/type";
import { useEffect, useState } from "react";

interface ScoreboardData {
  leaderboard: LeaderboardEntry[];
  winners: Debate[];
}

export const useScoreboard = (
  timeFilter: "weekly" | "monthly" | "all-time"
) => {
  const [data, setData] = useState<ScoreboardData>({
    leaderboard: [],
    winners: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchScoreboard = async () => {
      setLoading(true);
      try {
        // Fetch leaderboard data
        const leaderboardResponse = await fetch(
          `/api/leaderboard?time=${timeFilter}`
        );
        const leaderboardData = await leaderboardResponse.json();
        if (!leaderboardResponse.ok) {
          throw new Error(
            leaderboardData.message || "Error fetching leaderboard"
          );
        }

        // Fetch winners data
        const winnersResponse = await fetch(`/api/winners?time=${timeFilter}`);
        const winnersData = await winnersResponse.json();
        if (!winnersResponse.ok) {
          throw new Error(winnersData.message || "Error fetching winners");
        }

        setData({ leaderboard: leaderboardData, winners: winnersData });
        setError("");
      } catch (err) {
        console.error("Scoreboard fetch error:", err);
        setError("Failed to load scoreboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchScoreboard();
  }, [timeFilter]);

  return { data, loading, error };
};
