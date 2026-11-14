import { Link, useLocation } from "react-router-dom";

// English display word for each destination; the Korean title stays the real heading.
const kickers = { dashboard: "Today", coffee: "Journal", "monthly-pick": "Discover", taste: "Taste", mypage: "Me", backup: "Me", help: "Me", music: "Journal", beans: "Me", archive: "Me" };

export default function PageShell({ title, subtitle, children }) {
  const { pathname } = useLocation();
  const section = pathname.split("/")[1];
  return (
    <section className={"page page-" + section}>
      <header className="page-heading">
        <p className="page-heading-index" aria-hidden="true">{kickers[section] || "Roast & Reverb"}</p>
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
