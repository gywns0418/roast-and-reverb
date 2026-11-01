import { Link } from "react-router-dom";
export default function TrialNotice() {
  if (import.meta.env.VITE_USE_REAL_API === "true") return null;
  return <div className="trial-auth-notice"><p>GitHub 기록장은 가입 없이 모든 기기 내 기능을 사용합니다. 기록은 이 브라우저에만 보관되며, 기기 이동은 백업 파일로 할 수 있어요.</p><Link className="primary-button" to="/dashboard">내 기기 기록장 열기 ↗</Link></div>;
}
