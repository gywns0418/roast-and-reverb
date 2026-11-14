import { NavLink } from "react-router-dom";
import { House, NotebookPen, Search, Orbit, CircleUserRound } from "lucide-react";

// Five destinations: 홈 · 기록 · 발견 · 취향 · 나. The small line keeps the
// familiar page names so returning users still find their way.
const links = [
  ["/dashboard", House, "홈", "오늘의 한 잔"],
  ["/coffee", NotebookPen, "기록", "내 기록"],
  ["/monthly-pick", Search, "발견", "이달의 월픽"],
  ["/taste", Orbit, "취향", "나의 취향"],
  ["/mypage", CircleUserRound, "나", "보관·백업·설정"],
];
export default function Sidebar() {
  return (
    <>
      <aside className="sidebar">
        <NavLink className="brand" to="/" aria-label="Roast & Reverb 소개">
          <i className="brand-orb" aria-hidden="true" />
          <span>Roast &amp; Reverb</span>
          <small>커피 한 잔, 음악 한 곡</small>
        </NavLink>
        <nav aria-label="주요 메뉴">
          {links.map(([to, Icon, label, hint]) => (
            <NavLink key={to} to={to} end={false} className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
              <Icon size={20} aria-hidden="true" />
              <span className="nav-label">
                {label}
                <small>{hint}</small>
              </span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">하루 한 줄이면 충분해요.</div>
      </aside>
      <nav className="mobile-tabbar" aria-label="모바일 빠른 메뉴">
        {links.map(([to, Icon, label]) => (
          <NavLink key={to} to={to} end={false} className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
