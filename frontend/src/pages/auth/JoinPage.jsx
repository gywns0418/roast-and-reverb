import GoogleSignIn from "../../components/auth/GoogleSignIn.jsx";
import TrialNotice from "../../components/auth/TrialNotice.jsx";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { authApi } from "../../api/authApi.js";
import { authStore } from "../../store/authStore.js";

export default function JoinPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nickname: "slow brew",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function handleJoin() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      let user = null;
      try {
        user = await authApi.join(form);
      } catch (err) {
        throw err;
      }
      authStore.setUser(user);
      navigate("/journey");
    } catch (err) {
      setError(err.message || "계정 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (import.meta.env.VITE_USE_REAL_API !== "true")
    return (
      <section className="page cover-page">
        <div className="cover-card">
          <h1>가입 없이 체험할 수 있어요</h1>
          <TrialNotice />
          <Link to="/">서비스 소개로 돌아가기 →</Link>
        </div>
      </section>
    );
  return (
    <section className="page cover-page">
      <div className="cover-card">
        <TrialNotice />
        <div className="cover-brand smcp">Roast &amp; Reverb</div>
        <p className="cover-vol oldnum">Vol. I · 2026</p>
        <h1>기록장 만들기</h1>
        <p className="subtitle">나만의 커피와 음악 페어링 기록장을 만듭니다.</p>
        <form
          className="cover-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleJoin();
          }}
        >
          <Input
            required
            maxLength={40}
            autoComplete="nickname"
            placeholder="닉네임"
            value={form.nickname}
            onChange={update("nickname")}
          />
          <Input
            required
            autoComplete="email"
            type="email"
            placeholder="이메일"
            value={form.email}
            onChange={update("email")}
          />
          <Input
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={update("password")}
          />
          <Button
            type="submit"
            disabled={loading || import.meta.env.VITE_USE_REAL_API !== "true"}
            loading={loading}
          >
            {loading ? "생성 중" : "계정 만들기"}
          </Button>
          {error && (
            <p role="alert" className="muted">
              {error}
            </p>
          )}
        </form>
        <GoogleSignIn
          onSuccess={(user) => {
            authStore.setUser(user);
            navigate("/dashboard", { replace: true });
          }}
        />
        <Link to="/auth/login" className="cover-switch">
          이미 계정이 있다면 — 로그인
        </Link>
      </div>
    </section>
  );
}
