import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { logout } from "@/api/auth";
import { useSnackbarStore } from "@/store/snackbarStore";

export const useLogout = () => {
  const { showSnackbar } = useSnackbarStore();

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
