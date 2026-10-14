import { useEffect } from "react";
import { watchBeanFile } from "../../store/beanFileStore.js";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authStore } from "../../store/authStore.js";
import ResourceBoundary from "../common/ResourceBoundary.jsx";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
  const location = useLocation();
  useEffect(()=>watchBeanFile(),[]);
  const local = import.meta.env.VITE_USE_REAL_API !== "true";
  if (!local && !authStore.token) return <Navigate to="/auth/login" replace />;
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
            체험 모드 · 기록은 이 브라우저에 저장됩니다. 원두·음악 추천은 기기에서 분석합니다. MusicBrainz 검색과 YouTube 곡 링크를 연결할 수 있습니다.
          </div>
        )}
        <ResourceBoundary key={location.pathname}>
          <Outlet />
        </ResourceBoundary>
      </main>
    </div>
  );
}
