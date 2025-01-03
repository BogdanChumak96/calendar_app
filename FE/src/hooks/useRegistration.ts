import { useMutation } from "@tanstack/react-query";
import { register } from "@/api";
import { useSnackbar } from "./useSnackbar";
import { AxiosError } from "axios";

export const useRegistration = () => {
  const { showSnackbar } = useSnackbar();

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
