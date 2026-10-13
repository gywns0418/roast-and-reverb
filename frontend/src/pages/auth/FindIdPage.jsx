import TrialNotice from "../../components/auth/TrialNotice.jsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";

export default function FindIdPage() {
  const [email, setEmail] = useState("");

  return (
    <section className="page cover-page">
      <div className="cover-card">
        <TrialNotice />
        <div className="cover-brand smcp">Roast &amp; Reverb</div>
        <p className="cover-vol oldnum">Coffee × Music</p>
        <h1>아이디 찾기</h1>
        <p className="subtitle">아이디는 가입할 때 사용한 이메일입니다.</p>
        <div className="cover-form">
          <Input type="email" placeholder="이메일" value={email} onChange={(event) => setEmail(event.target.value)} />

        </div>
        <Link to="/auth/login" className="cover-switch">기억이 났다면 — 로그인으로</Link>
      </div>
    </section>
  );
}
