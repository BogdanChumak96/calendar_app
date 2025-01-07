import { ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useSnackbarStore } from "@/store/snackbarStore";

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const { open, message, severity, handleClose } = useSnackbarStore();

  return (
    <>
      {children}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity={severity} onClose={handleClose}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};
