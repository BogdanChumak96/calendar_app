import { useMutation } from "@tanstack/react-query";
import { login } from "@/api";
import { AxiosError } from "axios";
import { useSnackbarStore } from "@/store/snackbarStore";

export const useLogin = () => {
  const { showSnackbar } = useSnackbarStore();

  return useMutation({
    mutationFn: (values: { email: string; password: string }) =>
      login(values.email, values.password),
    onSuccess: () => {
      showSnackbar("Login successful!", "success");
    },
    onError: (error: AxiosError) => {
      showSnackbar("Login failed: " + error.message, "error");
    },
  });
};
