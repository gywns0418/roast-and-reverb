import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, initialTheme, saveTheme } from "../../utils/theme.js";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => (typeof document === "undefined" ? "light" : document.documentElement.dataset.theme || initialTheme()));
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={next === "dark" ? "다크 모드로 전환" : "라이트 모드로 전환"}
      onClick={() => {
        setTheme(applyTheme(next));
        saveTheme(next);
      }}
    >
      {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}
