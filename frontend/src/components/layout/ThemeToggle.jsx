import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, initialTheme, saveTheme } from "../../utils/theme.js";

export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(() => (typeof document === "undefined" ? "light" : document.documentElement.dataset.theme || initialTheme()));
  // Stay in sync when the theme changes elsewhere (settings page, another toggle).
  useEffect(() => {
    const sync = () => setTheme(document.documentElement.dataset.theme || "light");
    window.addEventListener("rr-theme-changed", sync);
    return () => window.removeEventListener("rr-theme-changed", sync);
  }, []);
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className={"theme-toggle " + className}
      aria-label={next === "dark" ? "다크 모드로 전환" : "라이트 모드로 전환"}
      onClick={() => {
        saveTheme(next);
        setTheme(applyTheme(next));
      }}
    >
      {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}
