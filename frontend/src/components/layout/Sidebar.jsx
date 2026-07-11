import { NavLink } from "react-router-dom";
import { BarChart3, Coffee, Disc3, Headphones, Home, Library, PenLine, Sparkles, UserRound } from "lucide-react";

const links = [
  ["/dashboard", Home, "대시보드", "neutral"],
  ["/coffee/write", PenLine, "오늘의 로그", "coffee"],
  ["/coffee", Coffee, "커피 로그", "coffee"],
  ["/music", Headphones, "음악 로그", "music"],
  ["/pairing", Sparkles, "AI 페어링", "blend"],
  ["/report/monthly", BarChart3, "취향 리포트", "neutral"],
  ["/recommend", Disc3, "추천", "blend"],
  ["/collection", Library, "컬렉션", "blend"],
  ["/mypage", UserRound, "마이페이지", "neutral"]
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink className="brand" to="/dashboard">
        <span>Roast &amp; Reverb</span>
        <small>coffee × music log</small>
      </NavLink>
      <nav>
        {links.map(([to, Icon, label, tone]) => (
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? `nav-link shelf-link ${tone} active` : `nav-link shelf-link ${tone}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
