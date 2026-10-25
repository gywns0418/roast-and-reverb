import Loading from "../common/Loading.jsx";
import { Suspense,useEffect,useState } from "react";
import { watchBeanFile } from "../../store/beanFileStore.js";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authStore } from "../../store/authStore.js";
import ResourceBoundary from "../common/ResourceBoundary.jsx";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
  const location = useLocation();
  const [,refreshAuth]=useState(0);
  useEffect(()=>{const refresh=()=>refreshAuth(n=>n+1);window.addEventListener('rr-auth-changed',refresh);return()=>window.removeEventListener('rr-auth-changed',refresh);},[]);
  useEffect(()=>watchBeanFile(),[]);
  const local = import.meta.env.VITE_USE_REAL_API !== "true";
  if (!local && !authStore.token) return <Navigate to="/auth/login" replace state={{from:location.pathname+location.search}} />;
  if (
    location.pathname.startsWith("/admin") &&
    authStore.user?.role !== "ADMIN"
  )
    return <Navigate to="/dashboard" replace />;
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById("main-content")?.focus(); }}>본문으로 이동</a>
      <Sidebar />
      <main className="main" id="main-content" tabIndex={-1}>
        <Header />
        {local && (
          <div className="demo-notice" role="status">
            체험 기록은 이 브라우저에 저장돼요. 기기를 바꾸기 전 설정에서 백업해 주세요.
          </div>
        )}
        <ResourceBoundary key={location.pathname}>
          <Suspense fallback={<div className="page"><Loading /></div>}><Outlet /></Suspense>
        </ResourceBoundary>
      </main>
    </div>
  );
}
