import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Search, Sparkles } from "lucide-react";
import AuthModal from "../auth/AuthModal.jsx";
import { authStore } from "../../store/authStore.js";
import {authApi} from '../../api/authApi.js';

export default function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [mobileSearchOpen,setMobileSearchOpen]=useState(false);
  const local = import.meta.env.VITE_USE_REAL_API !== "true";
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(() => authStore.user);

  async function handleLogout() {
    try{await authApi.logout();}catch{ /* Clear this device even when offline. */ }
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
          className={`topbar-search${mobileSearchOpen?' mobile-search-open':''}`}
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
          <button className="mobile-search-toggle ghost-button" type="button" aria-label={mobileSearchOpen?'음악 검색 닫기':'음악 검색 열기'} aria-expanded={mobileSearchOpen} onClick={()=>setMobileSearchOpen(value=>!value)}><Search size={19}/></button>
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
