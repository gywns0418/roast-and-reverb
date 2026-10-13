export default function Input({ label, placeholder, bare = false, ...props }) {
  const field = <input className="input" placeholder={placeholder} {...props} />;
  return !bare && (label || placeholder) ? <label className="input-field"><span>{label || placeholder}</span>{field}</label> : field;
}
