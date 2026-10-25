import { HashRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AppErrorBoundary from "./components/common/AppErrorBoundary.jsx";
import AppRouter from "./router/AppRouter.jsx";
import {LoadingHost} from './components/common/Loading.jsx';
import "./styles/main.css";
import "./styles/studio.css";
import "./styles/interior.css";
import "./styles/discovery.css";
import "./styles/usability.css";
import "./styles/editorial.css";
import "./styles/discovery-flow.css";
import "./styles/listening-room.css";
import "./styles/journey.css";
import "./styles/rhythm.css";
import "./styles/loading.css";
import "./styles/mobile.css";
import "./styles/first-cup.css";

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
      <LoadingHost />
    </HashRouter></AppErrorBoundary>
  );
}

import './styles/simple-flow.css';

import './styles/complete-flow.css';
