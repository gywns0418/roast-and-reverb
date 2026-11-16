import Loading from "../common/Loading.jsx";
import { Suspense, useEffect, useState } from "react";
import { watchBeanFile } from "../../store/beanFileStore.js";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { authStore } from "../../store/authStore.js";
import ResourceBoundary from "../common/ResourceBoundary.jsx";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Layout() {
  const location = useLocation();
  const [, refreshAuth] = useState(0);
  useEffect(() => {
    const refresh = () => refreshAuth((n) => n + 1);
    window.addEventListener("rr-auth-changed", refresh);
    return () => window.removeEventListener("rr-auth-changed", refresh);
  }, []);
  useEffect(() => watchBeanFile(), []);
  const local = import.meta.env.VITE_USE_REAL_API !== "true";
  if (!local && !authStore.token)
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  if (
    location.pathname.startsWith("/admin") &&
    authStore.user?.role !== "ADMIN"
  )
    return <Navigate to="/dashboard" replace />;
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        본문으로 이동
      </a>
      <Sidebar />
      <main className="main" id="main-content" tabIndex={-1}>
        <header className="mobile-appbar">
          <NavLink className="mobile-brand" to="/dashboard" aria-label="Roast & Reverb 홈">
            <i className="brand-orb" aria-hidden="true" />
            <span>R&amp;R</span>
          </NavLink>
          <ThemeToggle />
        </header>
        <Header />
        {local && (
          <div className="demo-notice" role="status">
            <span className="notice-desktop">
              기기 기록은 이 브라우저에 저장돼요. 기기를 바꾸기 전에 백업해 주세요.
            </span>
            <span className="notice-mobile">이 브라우저에 저장돼요</span>
            <NavLink className="notice-backup" to="/mypage">백업하기 →</NavLink>
          </div>
        )}
        <ResourceBoundary key={location.pathname}>
          <Suspense
            fallback={
              <div className="page">
                <Loading />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </ResourceBoundary>
      </main>
    </div>
  );
}
