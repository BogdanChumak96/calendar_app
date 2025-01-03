import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

type ThemeMode = "light" | "dark";

interface ThemeContextProps {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeModeContext = createContext<ThemeContextProps | undefined>(
  undefined
);

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeProvider");
  }
  return context;
};

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem("theme") as ThemeMode) || "light";
  });

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(mode === "light" ? "dark" : "light");
    root.classList.add(mode);

    localStorage.setItem("theme", mode);
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
    },
  });

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
