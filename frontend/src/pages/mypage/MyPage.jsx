import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import GoogleSignIn from "../../components/auth/GoogleSignIn.jsx";
import { authStore } from "../../store/authStore.js";
import { authApi } from "../../api/authApi.js";
export default function MyPage() {
  const local = import.meta.env.VITE_USE_REAL_API !== "true",
    navigate = useNavigate();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [linked, setLinked] = useState(false);
  const user = authStore.user || {};
  async function logout() {
    if (busy) return;
    setBusy(true);
    try {
      await authApi.logout();
      authStore.clear();
      navigate("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <PageShell
      title="설정"
      subtitle="기록을 보관하고, 필요한 기능만 꺼내 쓰세요."
    >
      <section className="quiet-section">
        <h2>
          {local
            ? "이 브라우저의 기록장"
            : user.nickname || user.email || "내 기록장"}
        </h2>
        <p>
          {local
            ? "기기 기록은 이 브라우저에 저장됩니다. 다른 기기로 자동 동기화되지 않아요."
            : "커피 일지는 로그인한 계정에, 원두 파일과 보조 도구 자료는 이 기기에 저장됩니다."}
        </p>
        <Link className="primary-button" to="/backup">
          내 자료 백업·복구
        </Link>
        {local && <p>GitHub Pages로 운영합니다. 회원 서버와 기기 간 자동 동기화 없이 기록·원두·월픽·추천·통계·연주를 이 기기에서 사용합니다. AI 정리와 대화는 설명 가능한 규칙 도우미로 제공됩니다.</p>}
      </section>
      <nav className="quiet-link-list" aria-label="기록장 설정">
        <Link to="/music">
          함께 남긴 음악<span>→</span>
        </Link>
        <Link to="/beans">
          내 원두 관리<span>→</span>
        </Link>
        <Link to="/archive">
          모든 기록 기능과 도구<span>→</span>
        </Link>
        <Link to="/help">
          이용 방법<span>→</span>
        </Link>
        <a href={import.meta.env.BASE_URL + "privacy.html"}>
          개인정보처리방침<span>→</span>
        </a>
      </nav>
      <details className="quiet-details">
        <summary>기존 자료와 보조 도구</summary>
        <p>앞서 사용하던 기능은 자료와 함께 보관했습니다.</p>
        <Link to="/archive">보관함 열기 →</Link>
      </details>
      {!local && (
        <section className="quiet-section">
          <h2>계정</h2>
          {linked ? (
            <p role="status">Google 계정을 연결했어요.</p>
          ) : (
            <GoogleSignIn
              link
              onSuccess={(u) => {
                authStore.setUser(u);
                setLinked(true);
              }}
            />
          )}
          <button className="ghost-button" disabled={busy} onClick={logout}>
            로그아웃
          </button>
        </section>
      )}
      {user.role === "ADMIN" && <Link to="/admin">관리자 화면 →</Link>}
      {error && <p role="alert">{error}</p>}
    </PageShell>
  );
}
