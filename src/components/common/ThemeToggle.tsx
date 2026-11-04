
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
      title={isDark ? "Light mode" : "Dark mode"}
      className="w-8 h-8 rounded-lg flex items-center justify-center text- transition-all duration-200"
    >
      {isDark ? (
        <Sun className="text-[#DC143C]" size={18} />
      ) : (
        <Moon className="text-[#DC143C]" size={18} />
      )}
    </button>
  );
}
