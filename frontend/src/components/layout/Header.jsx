import { Link } from "react-router-dom";
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
      <Link to="/">처음 이용하시나요?</Link>
    </header>
  );
}
