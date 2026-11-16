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

import "./styles/base.css";
import "./styles/resonance.css";
