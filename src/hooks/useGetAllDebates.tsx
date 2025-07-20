import { Debate } from "@/Type/type";
import { useEffect, useState } from "react";

const useGetAllDebates = () => {
  const [debates, setDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  useEffect(() => {
    const fetchDebates = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/debates");
        const data = await response.json();
        setDebates(data);
      } catch (error) {
        setErrors(`Error fetching debates: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchDebates();
  }, []);

  return { debates, loading, errors };
};

export default useGetAllDebates;
