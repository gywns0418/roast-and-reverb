import GoogleSignIn from "../../components/auth/GoogleSignIn.jsx";
import {safeReturnPath} from '../../utils/returnPath.js';
import TrialNotice from "../../components/auth/TrialNotice.jsx";
import { useState } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { authApi } from "../../api/authApi.js";
import { authStore } from "../../store/authStore.js";


export default function LoginPage() {
  const navigate = useNavigate();
  const location=useLocation();
  const [form, setForm] = useState({ email: authStore.user?.email||"", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function handleLogin() {
    if(loading)return;
    setLoading(true);
    setError("");
    try {
      let user = null;
      try {
        user = await authApi.login(form);
      } catch (err) {
        throw err;
      }
      authStore.setUser(user);
      navigate(safeReturnPath(location.state?.from),{replace:true});
    } catch (err) {
      setError(err.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page cover-page">
      <div className="cover-card">
        <TrialNotice />
        <div className="cover-brand smcp">Roast &amp; Reverb</div>
        <p className="cover-vol oldnum">Coffee × Music</p>
        <h1>다시 펼치기</h1>
        <p className="subtitle">커피와 음악 취향 데이터를 이어서 기록합니다.</p>
        <form className="cover-form" onSubmit={e=>{e.preventDefault();handleLogin();}}>
          <Input required autoComplete="email" type="email" placeholder="이메일" value={form.email} onChange={update("email")} />
          <Input required autoComplete="current-password" type="password" placeholder="비밀번호" value={form.password} onChange={update("password")} />
          <Button type="submit" disabled={loading || import.meta.env.VITE_USE_REAL_API !== "true"} loading={loading}>{loading ? "로그인 중" : "로그인"}</Button>
          {error && <p role="alert" className="muted">{error}</p>}
        </form>
        <GoogleSignIn onSuccess={user => { authStore.setUser(user); navigate(safeReturnPath(location.state?.from), { replace: true }); }} />
        <div className="cover-links">
          <Link to="/auth/find-id">아이디를 잊었나요?</Link>
          <Link to="/auth/find-password">비밀번호를 잊었나요?</Link>
        </div>
        <Link to="/auth/join" className="cover-switch">아직 계정이 없다면 — 새 노트 만들기</Link>
      </div>
    </section>
  );
}
