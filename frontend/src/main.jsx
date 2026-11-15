import { applyTheme, initialTheme } from "./utils/theme.js";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

applyTheme(initialTheme());
createRoot(document.getElementById("root")).render(<App />);
