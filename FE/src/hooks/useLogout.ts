import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "./useSnackbar";
import apiClient from "@/api/client";
import { AxiosError } from "axios";

export const useLogout = () => {
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/auth/logout", {}, { withCredentials: true });
    },
    onSuccess: () => {
      showSnackbar("Logout successful!", "success");
    },
    onError: (error: AxiosError) => {
      showSnackbar("Logout failed: " + error.message, "error");
    },
  });
};
