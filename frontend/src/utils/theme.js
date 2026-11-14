// Light / dark theme. The choice is a per-viewer convenience kept in this
// browser; without one the system preference decides.
export const THEME_KEY = "rr-theme-v1";
const valid = (value) => (value === "light" || value === "dark" ? value : null);

export function storedTheme(storage = globalThis.localStorage) {
  try {
    return valid(storage?.getItem(THEME_KEY));
  } catch {
    return null;
  }
}
export function systemTheme(win = globalThis.window) {
  try {
    return win?.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}
export const initialTheme = () => storedTheme() || systemTheme();
export function applyTheme(theme, root = globalThis.document?.documentElement) {
  const value = valid(theme) || "light";
  if (root) {
    root.dataset.theme = value;
    root.style.colorScheme = value;
  }
  return value;
}
export function saveTheme(theme, storage = globalThis.localStorage) {
  try {
    storage?.setItem(THEME_KEY, theme);
  } catch {
    /* storage blocked: the theme still applies for this visit */
  }
}
