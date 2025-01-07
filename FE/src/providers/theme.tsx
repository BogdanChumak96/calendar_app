import { ReactNode, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useThemeStore } from "@/store/themeStore";

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const { mode } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(mode === "light" ? "dark" : "light");
    root.classList.add(mode);
  }, [mode]);

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#3f51b5" : "#90caf9",
      },
      secondary: {
        main: mode === "light" ? "#f50057" : "#f48fb1",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {},
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          input: {
            color: "var(--foreground) !important",
          },
        },
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
