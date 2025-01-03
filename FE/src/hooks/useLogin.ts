import { useMutation } from "@tanstack/react-query";
import { login } from "@/api";
import { useSnackbar } from "./useSnackbar";
import { AxiosError } from "axios";

export const useLogin = () => {
  const { showSnackbar } = useSnackbar();

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
