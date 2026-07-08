import { NavLink } from "react-router-dom";
import { BarChart3, Coffee, Disc3, Headphones, Home, Library, Sparkles, UserRound } from "lucide-react";

const links = [
  ["/dashboard", Home, "대시보드"],
  ["/coffee", Coffee, "커피 로그"],
  ["/music", Headphones, "음악 로그"],
  ["/pairing", Sparkles, "AI 페어링"],
  ["/report/monthly", BarChart3, "취향 리포트"],
  ["/recommend", Disc3, "추천"],
  ["/collection", Library, "컬렉션"],
  ["/mypage", UserRound, "마이페이지"]
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink className="brand" to="/dashboard">Roast & Reverb</NavLink>
      <nav>
        {links.map(([to, Icon, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
