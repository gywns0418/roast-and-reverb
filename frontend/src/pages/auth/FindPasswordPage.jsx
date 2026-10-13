import TrialNotice from "../../components/auth/TrialNotice.jsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";

export default function FindPasswordPage() {
  const [email, setEmail] = useState("");

  return (
    <section className="page cover-page">
      <div className="cover-card">
        <TrialNotice />
        <div className="cover-brand smcp">Roast &amp; Reverb</div>
        <p className="cover-vol oldnum">Coffee × Music</p>
        <h1>비밀번호 찾기</h1>
        <p className="subtitle">계정 복구 기능은 아직 제공하지 않습니다. 가입한 이메일로 로그인해 주세요.</p>
        <div className="cover-form">
          <Input type="email" placeholder="이메일" value={email} onChange={(event) => setEmail(event.target.value)} />

        </div>
        <Link to="/auth/login" className="cover-switch">기억이 났다면 — 로그인으로</Link>
      </div>
    </section>
  );
}
