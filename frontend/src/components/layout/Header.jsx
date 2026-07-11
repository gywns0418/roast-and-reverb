import { Link } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="topbar">
      <div>
        <strong>2026 · 07 · 10</strong>
        <span>오늘의 커피와 음악을 기록하는 시간</span>
      </div>
      <label className="topbar-search">
        <Search size={16} />
        <input placeholder="로그, 원두, 아티스트 검색" />
      </label>
      <Link className="primary-button" to="/coffee/write">
        <Sparkles size={17} />
        <span>오늘의 로그</span>
      </Link>
    </header>
  );
}
