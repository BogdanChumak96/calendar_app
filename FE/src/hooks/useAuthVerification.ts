import { useQuery } from "@tanstack/react-query";
import { verifyToken } from "@/api";

export const useVerifyToken = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["verify-token"],
    queryFn: verifyToken,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  return {
    isAuthenticated: Boolean(data),
    isLoading,
    error,
  };
};
