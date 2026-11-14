import { Link, useLocation } from "react-router-dom";

// Sheet index shown above each page title, like the header row of a cupping form.
const sheets = { dashboard: "01", coffee: "02", taste: "03", "monthly-pick": "04", mypage: "05" };
const today = () => {
  const d = new Date();
  const day = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][d.getDay()];
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${day}`;
};

export default function PageShell({ title, subtitle, children }) {
  const { pathname } = useLocation();
  const section = pathname.split("/")[1];
  return (
    <section className={"page page-" + section}>
      <header className="page-heading">
        <p className="page-heading-index" aria-hidden="true">
          <span>
            <b>No.{sheets[section] || "—"}</b> ROAST &amp; REVERB CUPPING SHEET
          </span>
          <span>{today()}</span>
        </p>
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
