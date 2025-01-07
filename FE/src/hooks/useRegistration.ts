import { useMutation } from "@tanstack/react-query";
import { register } from "@/api";
import { AxiosError } from "axios";
import { useSnackbarStore } from "@/store/snackbarStore";

export const useRegistration = () => {
  const { showSnackbar } = useSnackbarStore();

  return useMutation({
    mutationFn: (values: {
      email: string;
      password: string;
      name: string;
      country: string;
    }) => register(values.email, values.password, values.name, values.country),
    onSuccess: () => {
      showSnackbar("Registration successful!", "success");
    },
    onError: (error: AxiosError) => {
      showSnackbar("Registration failed: " + error.message, "error");
    },
  });
};
