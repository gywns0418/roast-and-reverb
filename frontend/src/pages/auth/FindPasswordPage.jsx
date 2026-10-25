import { Link } from "react-router-dom";
import TrialNotice from "../../components/auth/TrialNotice.jsx";
export default function FindPasswordPage() {
  return (
    <section className="page cover-page">
      <div className="cover-card">
        <h1>비밀번호 복구 안내</h1>
        <p>
          현재 비밀번호 재설정 메일 기능은 제공하지 않습니다. 이메일을 입력해도
          발송되지 않으므로 입력란을 표시하지 않아요.
        </p>
        <TrialNotice />
        <Link className="primary-button" to="/auth/login">
          로그인으로 돌아가기
        </Link>
        <p>
          <Link to="/">서비스 소개 →</Link>
        </p>
      </div>
    </section>
  );
}
