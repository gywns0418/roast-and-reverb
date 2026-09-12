import { NavLink } from "react-router-dom";
import { BarChart3, Coffee, Disc3, Headphones, Home, Library, Sparkles, UserRound } from "lucide-react";
import { authStore } from "../../store/authStore.js";

const links = [
  ["/dashboard", Home, "대시보드", "neutral"],
  ["/coffee", Coffee, "커피 로그", "coffee"],
  ["/music", Headphones, "음악 로그", "music"],
  ["/pairing", Sparkles, "AI 페어링", "blend"],
  ["/report/monthly", BarChart3, "취향 리포트", "neutral"],
  ["/recommend", Disc3, "추천", "blend"],
  ["/collection", Library, "컬렉션", "blend"],
  ["/mypage", UserRound, "마이페이지", "neutral"]
];

export default function Sidebar() {
  const isDemo = authStore.user?.demo;

  return (
    <aside className="sidebar">
      <NavLink className="brand" to="/dashboard">
        <span>Roast &amp; Reverb</span>
        <small>coffee × music log</small>
        {isDemo && <em className="demo-badge smcp" title="로그인 서버에 연결하지 못해 임시 데모 계정으로 안내하고 있어요.">Demo</em>}
      </NavLink>
      <nav>
        {links.map(([to, Icon, label, tone]) => (
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? `nav-link ${tone} active` : `nav-link ${tone}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
