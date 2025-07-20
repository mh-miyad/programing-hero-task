"use client";
import { ProfileData } from "@/Type/type";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useProfile = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (status !== "authenticated" || !session?.user?.email) {
        setError("Please sign in to view your profile");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/profile?userId=${session.user.email}`
        );
        const profileData = await response.json();
        if (!response.ok) {
          throw new Error(profileData.message || "Error fetching profile");
        }
        setData(profileData);
        setError("");
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, status]);

  return { data, loading, error };
};
