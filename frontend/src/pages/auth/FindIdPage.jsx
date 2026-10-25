import { Link } from "react-router-dom";
import TrialNotice from "../../components/auth/TrialNotice.jsx";
export default function FindIdPage() {
  return (
    <section className="page cover-page">
      <div className="cover-card">
        <h1>로그인 이메일이 기억나지 않나요?</h1>
        <p>
          아이디는 가입할 때 사용한 이메일입니다. 현재 이메일을 찾아 보내주는
          기능은 제공하지 않아요.
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
