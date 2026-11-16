import { applyTheme, initialTheme } from "./utils/theme.js";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { installDragScroll } from "./utils/dragScroll.js";

applyTheme(initialTheme());
installDragScroll();
createRoot(document.getElementById("root")).render(<App />);
