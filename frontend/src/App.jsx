import { HashRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AppRouter from "./router/AppRouter.jsx";
import "./styles/main.css";
import "./styles/studio.css";
import "./styles/interior.css";
import "./styles/discovery.css";
import "./styles/usability.css";
import "./styles/editorial.css";

function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollReset />
      <AppRouter />
    </HashRouter>
  );
}
