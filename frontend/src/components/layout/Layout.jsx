import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authStore } from "../../store/authStore.js";
import ResourceBoundary from "../common/ResourceBoundary.jsx";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
  const location = useLocation();
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
            체험 모드 · 기록은 이 브라우저에 저장됩니다. R&R 페어링은 기기에서 분석하며 일부 추천은 예시입니다.
          </div>
        )}
        <ResourceBoundary key={location.pathname}>
          <Outlet />
        </ResourceBoundary>
      </main>
    </div>
  );
}
