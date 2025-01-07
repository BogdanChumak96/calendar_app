import { create } from "zustand";

type ThemeMode = "light" | "dark";

interface ThemeStore {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: (localStorage.getItem("theme") as ThemeMode) || "light",
  toggleTheme: () =>
    set((state) => {
      const newMode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", newMode);
      return { mode: newMode };
    }),
  setMode: (mode: ThemeMode) => {
    localStorage.setItem("theme", mode);
    set({ mode });
  },
}));
