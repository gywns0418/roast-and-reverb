export default function Button({ children, variant = "primary", ...props }) {
  return <button className={variant === "primary" ? "primary-button" : "ghost-button"} {...props}>{children}</button>;
}
