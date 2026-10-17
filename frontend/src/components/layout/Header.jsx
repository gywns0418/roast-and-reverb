import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Search, Sparkles } from "lucide-react";
import AuthModal from "../auth/AuthModal.jsx";
import { authStore } from "../../store/authStore.js";

export default function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const local = import.meta.env.VITE_USE_REAL_API !== "true";
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(() => authStore.user);

  function handleLogout() {
    authStore.clear();
    setUser(null);
    navigate("/");
  }

  return (
    <>
      <header className="topbar">
        <div>
          <strong>{new Date().toLocaleDateString("ko-KR")}</strong>
          <span>오늘의 커피와 음악을 기록하는 시간</span>
        </div>
        <form
          className="topbar-search"
          onSubmit={(event) => {
            event.preventDefault();
            navigate(`/music?q=${encodeURIComponent(query)}`);
          }}
        >
          <Search size={16} />
          <input
            aria-label="음악 보관함 검색"
            placeholder="보관한 곡, 아티스트 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>
        <div className="topbar-actions">
          <Link className="primary-button" to="/coffee/write">
            <Sparkles size={17} />
            <span>커피 기록</span>
          </Link>
          {local ? (
            <Link className="ghost-button" to="/">
              서비스 소개
            </Link>
          ) : user ? (
            <button
              className="ghost-button"
              type="button"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          ) : (
            <button
              className="ghost-button"
              type="button"
              onClick={() => setAuthOpen(true)}
            >
              <LogIn size={16} />
              <span>로그인</span>
            </button>
          )}
        </div>
      </header>
      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onAuthenticated={setUser}
        />
      )}
    </>
  );
}
