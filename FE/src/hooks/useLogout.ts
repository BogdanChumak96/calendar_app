import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "./useSnackbar";
import { AxiosError } from "axios";
import { logout } from "@/api/auth";

export const useLogout = () => {
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      showSnackbar("Logout successful!", "success");
    },
    onError: (error: AxiosError) => {
      showSnackbar("Logout failed: " + error.message, "error");
    },
  });
};
