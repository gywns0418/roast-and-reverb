import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, Search, Sparkles } from "lucide-react";
import AuthModal from "../auth/AuthModal.jsx";
import { authStore } from "../../store/authStore.js";

export default function Header() {
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(() => authStore.user);

  function handleLogout() {
    authStore.clear();
    setUser(null);
  }

  return (
    <>
      <header className="topbar">
        <div>
          <strong>2026 · 07 · 10</strong>
          <span>오늘의 커피와 음악을 기록하는 시간</span>
        </div>
        <label className="topbar-search">
          <Search size={16} />
          <input placeholder="로그, 원두, 아티스트 검색" />
        </label>
        <div className="topbar-actions">
          <Link className="primary-button" to="/coffee/write">
            <Sparkles size={17} />
            <span>오늘의 로그</span>
          </Link>
          {user ? (
            <button className="ghost-button" type="button" onClick={handleLogout}>{user.nickname || "로그아웃"}</button>
          ) : (
            <button className="ghost-button" type="button" onClick={() => setAuthOpen(true)}>
              <LogIn size={16} />
              <span>로그인</span>
            </button>
          )}
        </div>
      </header>
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onAuthenticated={setUser} />}
    </>
  );
}
