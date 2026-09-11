/* eslint-disable react/prop-types */
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/theme-provider";

function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground ${className}`}
    >
      <Sun
        className={`absolute h-[18px] w-[18px] transition-all ${
          isDark ? "scale-0 opacity-0 rotate-90" : "scale-100 opacity-100 rotate-0"
        }`}
      />
      <Moon
        className={`absolute h-[18px] w-[18px] transition-all ${
          isDark ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-90"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export default ThemeToggle;
