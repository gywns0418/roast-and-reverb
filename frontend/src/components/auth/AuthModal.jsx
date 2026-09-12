import { useState } from "react";
import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";
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

export default function AuthModal({ initialMode = "login", onClose, onAuthenticated }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ nickname: "slow brew", email: "demo@roastreverb.local", password: "demo" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));
  const isJoin = mode === "join";
  const isFindId = mode === "find-id";
  const isFindPassword = mode === "find-password";

  async function handleSubmit() {
    setLoading(true);
    setMessage("");
    try {
      if (isFindId || isFindPassword) {
        setMessage("입력한 이메일로 안내를 보냈습니다.");
        return;
      }

      let user = null;
      try {
        user = isJoin ? await authApi.join(form) : await authApi.login(form);
      } catch (err) {
        if (err.status) {
          setMessage(err.message || "요청에 실패했습니다.");
          return;
        }
        user = devUser(form);
      }

      const resolvedUser = user || devUser(form);
      authStore.setUser(resolvedUser);
      onAuthenticated?.(resolvedUser);
      onClose?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="cover-card auth-modal" role="dialog" aria-modal="true" aria-label="인증" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="닫기">×</button>
        <div className="cover-brand smcp">Roast &amp; Reverb</div>
        <p className="cover-vol oldnum">{isJoin ? "Vol. I · 2026" : "Vol. II · 2026"}</p>
        <h1>{isJoin ? "노트 시작하기" : isFindId ? "아이디 찾기" : isFindPassword ? "비밀번호 찾기" : "다시 펼치기"}</h1>
        <p className="subtitle">
          {isJoin
            ? "나만의 커피와 음악 페어링 기록장을 만듭니다."
            : isFindId || isFindPassword
              ? "가입한 이메일로 계정 안내를 보냅니다."
              : "커피와 음악 취향 데이터를 이어서 기록합니다."}
        </p>

        <div className="cover-form">
          {isJoin && <Input placeholder="닉네임" value={form.nickname} onChange={update("nickname")} />}
          <Input type="email" placeholder="이메일" value={form.email} onChange={update("email")} />
          {!isFindId && !isFindPassword && <Input type="password" placeholder="비밀번호" value={form.password} onChange={update("password")} />}
          <Button onClick={handleSubmit} disabled={loading} loading={loading}>
            {loading ? "처리 중" : isJoin ? "계정 만들기" : isFindId ? "계정 정보 받기" : isFindPassword ? "재설정 링크 받기" : "로그인"}
          </Button>
          {message && <p className="muted">{message}</p>}
        </div>

        {!isJoin && !isFindId && !isFindPassword && (
          <div className="cover-links">
            <button type="button" onClick={() => setMode("find-id")}>아이디를 잊었나요?</button>
            <button type="button" onClick={() => setMode("find-password")}>비밀번호를 잊었나요?</button>
          </div>
        )}
        <button className="cover-switch" type="button" onClick={() => setMode(isJoin ? "login" : "join")}>
          {isJoin ? "이미 계정이 있다면 — 로그인" : "아직 계정이 없다면 — 새 노트 만들기"}
        </button>
      </section>
    </div>
  );
}
