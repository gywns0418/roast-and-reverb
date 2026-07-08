export default function PageShell({ eyebrow, title, subtitle, children }) {
  return (
    <section className="page">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="subtitle">{subtitle}</p>
      {children}
    </section>
  );
}
