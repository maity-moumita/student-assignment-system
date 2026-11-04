
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    const initialTheme: Theme =
      savedTheme === "dark" ? "dark" : "light";

    setTheme(initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );

    document.documentElement.style.colorScheme = theme;

    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  function toggleTheme() {
    setTheme((previousTheme) =>
      previousTheme === "light" ? "dark" : "light"
    );
  }

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}
