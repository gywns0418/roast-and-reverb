import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";

export default function FindIdPage() {
  const [email, setEmail] = useState("");

  return (
    <section className="page cover-page">
      <div className="cover-card">
        <div className="cover-brand smcp">Roast &amp; Reverb</div>
        <p className="cover-vol oldnum">Vol. II · 2026</p>
        <h1>아이디 찾기</h1>
        <p className="subtitle">가입할 때 쓴 이메일로 계정 정보를 보내드립니다.</p>
        <div className="cover-form">
          <Input type="email" placeholder="이메일" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Button>계정 정보 받기</Button>
        </div>
        <Link to="/auth/login" className="cover-switch">기억이 났다면 — 로그인으로</Link>
      </div>
    </section>
  );
}
