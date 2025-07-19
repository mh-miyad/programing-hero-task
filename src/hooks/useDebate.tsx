/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/hooks/useDebate.ts
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
        if (response.ok) {
          setDebate(data);
        } else {
          setError(data.message || "Error fetching debate");
        }
      } catch (err) {
        setError("Error fetching debate");
      } finally {
        setLoading(false);
      }
    };
    fetchDebate();
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
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/debates/${debateId}/join`, {
        method: "POST",
        body: JSON.stringify({ userId: session.user.email, side }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setDebate(data);
        setReplyTimer(5 * 60); // 5 minutes
      } else {
        setError(data.message || "Error joining debate");
      }
    } catch (err) {
      setError("Error joining debate");
    } finally {
      setLoading(false);
    }
    return { error };
  };

  const addArgument = async (content: string) => {
    if (!session?.user?.email || !debate) return;
    const participant = debate.participants.find(
      (p) => p.userId === session?.user?.email
    );
    if (!participant) return;

    // Client-side moderation
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
      if (response.ok) {
        setDebate(data);
        setReplyTimer(null);
      } else {
        setError(data.message || "Error adding argument");
      }
    } catch (err) {
      setError("Error adding argument");
    } finally {
      setLoading(false);
    }
  };

  const voteOnArgument = async (argumentId: string) => {
    if (!session?.user?.email || !debate) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/debates/${debateId}/vote`, {
        method: "POST",
        body: JSON.stringify({ argumentId, userId: session.user.email }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setDebate(data);
      } else {
        setError(data.message || "Error voting on argument");
      }
    } catch (err) {
      setError("Error voting on argument");
    } finally {
      setLoading(false);
    }
  };

  const updateArgument = async (argumentId: string, content: string) => {
    if (!session?.user?.email) return;

    // Client-side moderation
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
      if (response.ok) {
        setDebate(data);
      } else {
        setError(data.message || "Error editing argument");
      }
    } catch (err) {
      setError("Error editing argument");
    } finally {
      setLoading(false);
    }
  };

  const deleteArgument = async (argumentId: string) => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/debates/${debateId}/arguments`, {
        method: "DELETE",
        body: JSON.stringify({ argumentId }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setDebate(data);
      } else {
        setError(data.message || "Error deleting argument");
      }
    } catch (err) {
      setError("Error deleting argument");
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
