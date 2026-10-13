export default function Button({ children, variant = "primary", loading = false, ...props }) {
  const base = variant === "primary" ? "primary-button" : "ghost-button";
  return (
    <button className={loading ? `${base} is-loading` : base} {...props}>
      {loading && <span className="btn-pulse" aria-hidden="true" />}
      {children}
    </button>
  );
}
