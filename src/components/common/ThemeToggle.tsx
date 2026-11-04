
"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    const isDark = savedTheme === "dark";

    setDark(isDark);

    document.documentElement.classList.toggle(
      "dark",
      isDark
    );

    setMounted(true);
  }, []);

  function toggleTheme() {
    const newTheme = !dark;

    setDark(newTheme);

    document.documentElement.classList.toggle(
      "dark",
      newTheme
    );

    localStorage.setItem(
      "theme",
      newTheme ? "dark" : "light"
    );
  }

  if (!mounted) {
    return (
      <div className="glass w-11 h-11 rounded-xl" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        dark ? "Switch to light theme" : "Switch to dark theme"
      }
      className="glass rounded-xl p-3 transition hover:scale-105"
    >
      {dark ? (
        <Sun
          size={20}
          className="text-[var(--pink)]"
        />
      ) : (
        <Moon
          size={20}
          className="text-[var(--teal)]"
        />
      )}
    </button>
  );
}
