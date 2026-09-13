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
    nickname: form.nickname || "slow brew",
    role: "ADMIN",
    demo: true
  };
}

export default function JoinPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nickname: "slow brew", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function handleJoin() {
    setLoading(true);
    setError("");
    try {
      let user = null;
      try {
        user = await authApi.join(form);
      } catch (err) {
        if (err.status) throw err;
        user = devUser(form);
      }
      authStore.setUser(user || devUser(form));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "계정 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page cover-page">
      <div className="cover-card">
        <div className="cover-brand smcp">Roast &amp; Reverb</div>
        <p className="cover-vol oldnum">Vol. I · 2026</p>
        <h1>노트 시작하기</h1>
        <p className="subtitle">나만의 커피와 음악 페어링 기록장을 만듭니다.</p>
        <div className="cover-form">
          <Input placeholder="닉네임" value={form.nickname} onChange={update("nickname")} />
          <Input type="email" placeholder="이메일" value={form.email} onChange={update("email")} />
          <Input type="password" placeholder="비밀번호" value={form.password} onChange={update("password")} />
          <Button onClick={handleJoin} disabled={loading} loading={loading}>{loading ? "생성 중" : "계정 만들기"}</Button>
          {error && <p className="muted">{error}</p>}
        </div>
        <Link to="/auth/login" className="cover-switch">이미 계정이 있다면 — 로그인</Link>
      </div>
    </section>
  );
}
