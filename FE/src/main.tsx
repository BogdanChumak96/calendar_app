import { createRoot } from "react-dom/client";
import { RouterApp } from "@/providers/router.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "@/components";
import { SnackbarProvider, CustomThemeProvider } from "@/providers";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <CustomThemeProvider>
      <ErrorBoundary>
        <SnackbarProvider>
          <RouterApp />
        </SnackbarProvider>
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </CustomThemeProvider>
  </QueryClientProvider>
);
