import { Link, useLocation } from "react-router-dom";
export default function PageShell({ title, subtitle, children }) {
  const { pathname } = useLocation();
  const section = pathname.split("/")[1];
  return (
    <section className={"page page-" + section}>
      <header className="page-heading">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
      </header>
      <div className="page-content">
        <div className="workspace-content">{children}</div>
      </div>
      <footer className="page-footer">
        <span>ROAST &amp; REVERB</span>
        <Link to="/">서비스 소개</Link>
        <a href={import.meta.env.BASE_URL + "privacy.html"}>개인정보처리방침</a>
      </footer>
    </section>
  );
}
