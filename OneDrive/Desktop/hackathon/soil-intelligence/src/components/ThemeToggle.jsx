import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="p-2 rounded-2xl border border-emerald-100 hover:border-emerald-200 flex items-center justify-center transition-colors bg-white/70"
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 text-emerald-900" />
      ) : (
        <Sun className="w-4 h-4 text-amber-300" />
      )}
    </button>
  );
}

