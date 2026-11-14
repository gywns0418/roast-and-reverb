import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
export default function Header() {
  return (
    <header className="topbar simple-topbar">
      <span>
        {new Date().toLocaleDateString("ko-KR", {
          month: "long",
          day: "numeric",
          weekday: "long",
        })}
      </span>
      <span className="topbar-actions">
        <Link to="/">처음 이용하시나요?</Link>
        <ThemeToggle />
      </span>
    </header>
  );
}
