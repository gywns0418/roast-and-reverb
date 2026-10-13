import { HashRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter.jsx";
import "./styles/main.css";
import "./styles/studio.css";

export default function App() {
  return (
    <HashRouter>
      <AppRouter />
    </HashRouter>
  );
}
