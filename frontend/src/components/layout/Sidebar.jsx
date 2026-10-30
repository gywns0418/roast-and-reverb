import { NavLink } from "react-router-dom";
import { Coffee, BookOpen, Settings, ShoppingBasket } from "lucide-react";
const links = [
  ["/dashboard", Coffee, "오늘의 한 잔"],
  ["/coffee", BookOpen, "내 기록"],
  ["/monthly-pick", ShoppingBasket, "원두 둘러보기"],
];
export default function Sidebar() {
  const item = ([to, Icon, label]) => (
    <NavLink
      key={to}
      to={to}
      end={false}
      className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
  return (
    <>
      <aside className="sidebar">
        <NavLink className="brand" to="/" aria-label="Roast & Reverb 소개">
          <span>Roast &amp; Reverb</span>
          <small>커피 한 잔, 음악 한 곡</small>
        </NavLink>
        <nav aria-label="주요 메뉴">
          {links.map(item)}
          <div className="nav-support">
            {item(["/mypage", Settings, "설정"])}
          </div>
        </nav>
        <div className="sidebar-foot">하루 한 줄이면 충분해요.</div>
      </aside>
      <nav className="mobile-tabbar" aria-label="모바일 빠른 메뉴">
        {[
          ["/coffee", BookOpen, "기록"],
          ["/monthly-pick", ShoppingBasket, "원두"],
          ["/mypage", Settings, "설정"],
        ].map(item)}
      </nav>
    </>
  );
}
