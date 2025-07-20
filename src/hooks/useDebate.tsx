"use client";
import { Debate } from "@/Type/type";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useDebate = (debateId: string) => {
  const { data: session } = useSession();
  const [debate, setDebate] = useState<Debate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [replyTimer, setReplyTimer] = useState<number | null>(null);
  const [moderationWarning, setModerationWarning] = useState("");

  const bannedWords = ["stupid", "idiot", "dumb", "hate", "kill", "die"];

  // Fetch debate
  useEffect(() => {
    const fetchDebate = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/debates/${debateId}`);
        const data = await response.json();
        console.log("Fetched debate:", data); // Debug log
        if (response.ok) {
          setDebate(data);
          setError("");
        } else {
          setDebate(null);
          setError(data.message || "Error fetching debate");
        }
      } catch (err) {
        console.error("Fetch debate error:", err);
        setDebate(null);
        setError("Failed to connect to the server");
      } finally {
        setLoading(false);
      }
    };
    if (debateId) {
      fetchDebate();
    } else {
      setError("Invalid debate ID");
      setLoading(false);
    }
  }, [debateId]);

  // Reply timer logic
  useEffect(() => {
    if (replyTimer !== null && replyTimer > 0) {
      const interval = setInterval(() => {
        setReplyTimer((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [replyTimer]);

  // Auto-close debate
  useEffect(() => {
    if (debate && debate.isActive && new Date(debate.endTime) <= new Date()) {
      const closeDebate = async () => {
        try {
          const response = await fetch(`/api/debates/${debateId}/close`, {
            method: "POST",
          });
          const data = await response.json();
          console.log("Close debate response:", data); // Debug log
          if (response.ok) {
            setDebate(data);
          }
        } catch (err) {
          console.error("Error closing debate:", err);
        }
      };
      closeDebate();
    }
  }, [debate, debateId]);

  const joinDebate = async (side: "support" | "oppose") => {
    if (!session?.user?.email) {
      setError("User not authenticated");
      return { error: "User not authenticated" };
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/debates/${debateId}/join`, {
        method: "POST",
        body: JSON.stringify({ userId: session.user.email, side }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("Join debate response:", data); // Debug log
      if (response.ok) {
        setDebate(data);
        setReplyTimer(5 * 60); // 5 minutes
        setError("");
      } else {
        setError(data.message || "Error joining debate");
      }
    } catch (err) {
      console.error("Join debate error:", err);
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
    return { error };
  };

  const addArgument = async (content: string) => {
    if (!session?.user?.email || !debate) {
      setError("User not authenticated or debate not loaded");
      return;
    }
    const participant = debate.participants.find(
      (p) => p.userId === session?.user?.email
    );
    if (!participant) {
      setError("User not joined the debate");
      return;
    }

    const lowerContent = content.toLowerCase();
    const foundBannedWord = bannedWords.find((word) =>
      lowerContent.includes(word)
    );
    if (foundBannedWord) {
      setModerationWarning(
        `Inappropriate content detected: "${foundBannedWord}"`
      );
      return;
    }
    setModerationWarning("");

    setLoading(true);
    try {
      const response = await fetch(`/api/debates/${debateId}/arguments`, {
        method: "POST",
        body: JSON.stringify({
          authorId: session.user.email,
          authorName: session.user.name || "Anonymous",
          side: participant.side,
          content,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("Add argument response:", data); // Debug log
      if (response.ok) {
        setDebate(data);
        setReplyTimer(null);
        setError("");
      } else {
        setError(data.message || "Error adding argument");
      }
    } catch (err) {
      console.error("Add argument error:", err);
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const voteOnArgument = async (argumentId: string) => {
    if (!session?.user?.email || !debate) {
      setError("User not authenticated or debate not loaded");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/debates/${debateId}/vote`, {
        method: "POST",
        body: JSON.stringify({ argumentId, userId: session.user.email }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("Vote argument response:", data); // Debug log
      if (response.ok) {
        setDebate(data);
        setError("");
      } else {
        setError(data.message || "Error voting on argument");
      }
    } catch (err) {
      console.error("Vote argument error:", err);
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const updateArgument = async (argumentId: string, content: string) => {
    if (!session?.user?.email) {
      setError("User not authenticated");
      return;
    }

    const lowerContent = content.toLowerCase();
    const foundBannedWord = bannedWords.find((word) =>
      lowerContent.includes(word)
    );
    if (foundBannedWord) {
      setModerationWarning(
        `Inappropriate content detected: "${foundBannedWord}"`
      );
      return;
    }
    setModerationWarning("");

    setLoading(true);
    try {
      const response = await fetch(`/api/debates/${debateId}/arguments`, {
        method: "PUT",
        body: JSON.stringify({ argumentId, content }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("Update argument response:", data); // Debug log
      if (response.ok) {
        setDebate(data);
        setError("");
      } else {
        setError(data.message || "Error editing argument");
      }
    } catch (err) {
      console.error("Update argument error:", err);
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const deleteArgument = async (argumentId: string) => {
    if (!session?.user?.email) {
      setError("User not authenticated");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/debates/${debateId}/arguments`, {
        method: "DELETE",
        body: JSON.stringify({ argumentId }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("Delete argument response:", data); // Debug log
      if (response.ok) {
        setDebate(data);
        setError("");
      } else {
        setError(data.message || "Error deleting argument");
      }
    } catch (err) {
      console.error("Delete argument error:", err);
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return {
    debate,
    loading,
    error,
    replyTimer,
    moderationWarning,
    joinDebate,
    addArgument,
    voteOnArgument,
    updateArgument,
    deleteArgument,
  };
};
