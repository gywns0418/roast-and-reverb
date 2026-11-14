import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import GoogleSignIn from "../../components/auth/GoogleSignIn.jsx";
import { authStore } from "../../store/authStore.js";
import { authApi } from "../../api/authApi.js";
import { ArrowRight, Music2, Coffee, Grid2X2, BookOpen, ShieldCheck, FolderDown } from "lucide-react";
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
      <section className="quiet-section settings-storage">
        <FolderDown size={26} aria-hidden="true" />
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
        {local && <div className="settings-storage-facts"><span>이 브라우저에 보관</span><span>백업 파일로 다른 기기에 이동</span><span>복원 전 바뀔 자료 확인</span></div>}
      </section>
      <nav className="quiet-link-list" aria-label="기록장 설정과 도움말">
        {[{to:"/music",Icon:Music2,title:"함께 남긴 음악",text:"커피와 함께 듣고 기록한 곡을 살펴봐요."},{to:"/beans",Icon:Coffee,title:"내 원두 관리",text:"가진 원두와 남은 상태를 한곳에서 관리해요."},{to:"/archive",Icon:Grid2X2,title:"기록과 발견 도구",text:"취향, 추천, 청음실과 모든 기록 기능을 열어요."},{to:"/help",Icon:BookOpen,title:"기록장 이용 방법",text:"느낌 한 줄부터 음악 선택, 저장까지."}].map(({to,Icon,title,text})=><Link key={to} to={to}><Icon size={21} aria-hidden="true"/><div><strong>{title}</strong><small>{text}</small></div><ArrowRight size={17} aria-hidden="true"/></Link>)}
        <a href={import.meta.env.BASE_URL + "privacy.html"}><ShieldCheck size={21} aria-hidden="true"/><div><strong>개인정보와 내 자료</strong><small>어떤 정보가 저장되는지 확인해요.</small></div><ArrowRight size={17} aria-hidden="true"/></a>
      </nav>
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
