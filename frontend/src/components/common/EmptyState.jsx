import Motif from "./Motif.jsx";

export default function EmptyState({ icon = "blend", children }) {
  return (
    <div className="empty-state">
      <Motif variant={icon} />
      <p>{children}</p>
    </div>
  );
}
