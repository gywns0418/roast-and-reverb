import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { authApi } from "../../api/authApi.js";
import { authStore } from "../../store/authStore.js";

function devUser(form) {
  return {
    memberId: 1,
    email: form.email || "demo@roastreverb.local",
    nickname: "slow brew",
    role: "ADMIN",
    demo: true
  };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "demo@roastreverb.local", password: "demo" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function handleLogin() {
    setLoading(true);
    setError("");
    try {
      let user = null;
      try {
        user = await authApi.login(form);
      } catch (err) {
        if (err.status) throw err;
        user = devUser(form);
      }
      authStore.setUser(user || devUser(form));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page cover-page">
      <div className="cover-card">
        <div className="cover-brand smcp">Roast &amp; Reverb</div>
        <p className="cover-vol oldnum">Vol. II · 2026</p>
        <h1>다시 펼치기</h1>
        <p className="subtitle">커피와 음악 취향 데이터를 이어서 기록합니다.</p>
        <div className="cover-form">
          <Input type="email" placeholder="이메일" value={form.email} onChange={update("email")} />
          <Input type="password" placeholder="비밀번호" value={form.password} onChange={update("password")} />
          <Button onClick={handleLogin} disabled={loading} loading={loading}>{loading ? "로그인 중" : "로그인"}</Button>
          {error && <p className="muted">{error}</p>}
        </div>
        <div className="cover-links">
          <Link to="/auth/find-id">아이디를 잊었나요?</Link>
          <Link to="/auth/find-password">비밀번호를 잊었나요?</Link>
        </div>
        <Link to="/auth/join" className="cover-switch">아직 계정이 없다면 — 새 노트 만들기</Link>
      </div>
    </section>
  );
}
