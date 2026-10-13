import { Link } from "react-router-dom";
export default function TrialNotice() {
  if (import.meta.env.VITE_USE_REAL_API === "true") return null;
  return <div className="trial-auth-notice"><p>지금은 브라우저 체험 모드입니다. 계정 가입과 로그인은 실제 서버 배포 후 이용할 수 있어요.</p><Link className="primary-button" to="/dashboard">내 체험 기록장 열기 ↗</Link></div>;
}
