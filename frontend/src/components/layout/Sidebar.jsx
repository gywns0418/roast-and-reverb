import { Link, NavLink } from "react-router-dom";
import { BarChart3, Coffee, Disc3, Headphones, Home, Library, ShoppingBasket, Sparkles, UserRound } from "lucide-react";
import { authStore } from "../../store/authStore.js";

const links = [
  ["/ritual", Disc3, "나의 청음실", "blend"],
  ["/studio", Headphones, "한 잔의 사운드", "music"],
  ["/memories", Library, "감각의 기억", "neutral"],
  ["/dashboard", Home, "대시보드", "neutral"],
  ["/beans", ShoppingBasket, "내 원두", "coffee"],
  ["/coffee", Coffee, "커피 로그", "coffee"],
  ["/music", Headphones, "음악 로그", "music"],
  ["/pairing", Sparkles, "AI 페어링", "blend"],
  ["/report/monthly", BarChart3, "취향 리포트", "neutral"],
  ["/recommend", Disc3, "추천", "blend"],
  ["/monthly-pick", ShoppingBasket, "이달의 픽", "blend"],
  ["/collection", Library, "컬렉션", "blend"],
  ["/mypage", UserRound, "마이페이지", "neutral"],
  ["/connections", Sparkles, "자료 연결 상태", "neutral"]
];

export default function Sidebar() {
  const isDemo = authStore.user?.demo;

  return (
    <aside className="sidebar">
      <NavLink className="brand" to="/ritual">
        <span>Roast &amp; Reverb</span>
        <small>coffee × music log</small>
        {isDemo && <em className="demo-badge smcp" title="체험 기록은 이 브라우저에 저장됩니다.">Demo</em>}
      </NavLink>
      <nav>
        <p className="nav-caption">MY DAILY RITUAL</p>
        {links.map(([to, Icon, label, tone]) => (
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? `nav-link ${tone} active` : `nav-link ${tone}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-session"><div className="mini-vinyl" aria-hidden="true"><i>r&amp;r</i></div><p>좋은 커피와<br/>오래 듣는 음악.</p><Link to="/ritual">나의 시간 시작하기 ↗</Link></div>
      <div className="sidebar-foot">BREW. LISTEN. REMEMBER.</div>
    </aside>
  );
}
