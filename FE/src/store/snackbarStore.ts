import { create } from "zustand";

interface SnackbarStore {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  showSnackbar: (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => void;
  handleClose: () => void;
}

export const useSnackbarStore = create<SnackbarStore>((set) => ({
  open: false,
  message: "",
  severity: "success",
  showSnackbar: (message, severity) => set({ message, severity, open: true }),
  handleClose: () => set({ open: false }),
}));
