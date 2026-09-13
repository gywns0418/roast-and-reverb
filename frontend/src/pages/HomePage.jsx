import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/auth/AuthModal.jsx";

export default function HomePage() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(null);

  return (
    <div className="home-page">
      <div className="home-hero">
        <svg className="illus" viewBox="0 0 600 220" fill="none" aria-hidden="true">
          <g stroke="#2c2a1e" strokeWidth="1.3" strokeLinecap="round">
            <path d="M40 200 C70 160 60 120 95 95 C120 77 110 50 130 25" />
            <path d="M95 95 C75 80 55 82 35 70" />
            <path d="M110 130 C90 122 70 128 52 118" />
            <path d="M120 60 C104 50 100 34 108 18" />
            <circle cx="33" cy="69" r="4.5" fill="#2c2a1e" />
            <circle cx="52" cy="118" r="5.5" fill="#2c2a1e" />
            <path d="M60 86 C66 78 78 78 84 86 C78 94 66 94 60 86 Z" />
            <path d="M78 132 C84 124 96 124 102 132 C96 140 84 140 78 132 Z" />
          </g>
          <g stroke="#2c2a1e" strokeWidth="1.1" fill="none">
            <path d="M130 25 C 200 45, 230 5, 300 30 S 400 55, 470 20" />
            <path d="M130 46 C 200 66, 235 30, 300 52 S 400 78, 480 46" opacity="0.75" />
            <path d="M132 68 C 205 86, 240 56, 305 76 S 405 100, 490 72" opacity="0.5" />
          </g>
        </svg>

        <p className="kicker smcp">Coffee × Music Field Ledger</p>
        <h1>Roast &amp; Reverb</h1>
        <p className="lead">오늘 마신 커피와 들은 음악을 하나의 조용한 일장에 적어둡니다.</p>

        <div className="home-actions">
          <button type="button" className="primary-button" onClick={() => setAuthMode("join")}>노트 시작하기</button>
          <button type="button" className="ghost-button" onClick={() => setAuthMode("login")}>로그인</button>
        </div>

        <p className="home-foot oldnum">Vol. II · 2026</p>
      </div>
      {authMode && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setAuthMode(null)}
          onAuthenticated={() => navigate("/dashboard")}
        />
      )}
    </div>
  );
}
