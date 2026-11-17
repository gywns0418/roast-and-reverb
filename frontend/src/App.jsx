import PrivacyControls from "./components/common/PrivacyControls.jsx";
import { HashRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AppErrorBoundary from "./components/common/AppErrorBoundary.jsx";
import AppRouter from "./router/AppRouter.jsx";
import {LoadingHost} from './components/common/Loading.jsx';

function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AppErrorBoundary><HashRouter>
      <ScrollReset />
      <AppRouter />
      <PrivacyControls />
      <LoadingHost />
    </HashRouter></AppErrorBoundary>
  );
}

// Shared styles first, then the page styles, then the device files last:
// pc.css (min-width 761px) and mobile.css (max-width 760px). Sizes there are in px.
import "./styles/base.css";
import "./styles/resonance.css";
import "./styles/bean-illustrations.css";
import "./styles/verdict.css";
import "./styles/monthly-filters.css";
import "./styles/monthly-taste.css";
import "./styles/monthly-library.css";
import "./styles/monthly-polish.css";
import "./styles/taste-journey.css";
import "./styles/sound-studio.css";
import "./styles/pc.css";
import "./styles/mobile.css";
