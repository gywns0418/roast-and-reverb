import GoogleSignIn from "../../components/auth/GoogleSignIn.jsx";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Tag from "../../components/common/Tag.jsx";
import { authStore } from "../../store/authStore.js";
import { authApi } from "../../api/authApi.js";
import { coffeeApi } from "../../api/coffeeApi.js";
import { musicApi } from "../../api/musicApi.js";
import { pairingApi } from "../../api/pairingApi.js";
import { listDiaryRecords } from "../../utils/diaryRecords.js";
import {
  adaptCoffeeLog,
  adaptMusicLog,
  adaptPairing,
} from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export default function MyPage() {
  const [googleLinked, setGoogleLinked] = useState(false);
  const navigate = useNavigate();
  const local = import.meta.env.VITE_USE_REAL_API !== "true";
  const user = authStore.user || {};
  const { data: coffees } = useApiResource(
    () =>
      listDiaryRecords(coffeeApi.list).then((items) =>
        items.map(adaptCoffeeLog),
      ),
    [],
    [],
  );
  const { data: music } = useApiResource(
    () =>
      listDiaryRecords(musicApi.list).then((items) => items.map(adaptMusicLog)),
    [],
    [],
  );
  const { data: pairs } = useApiResource(
    () =>
      listDiaryRecords(pairingApi.list).then((items) =>
        items.map(adaptPairing),
      ),
    [],
    [],
  );
  const days = new Set(
    [...coffees, ...music]
      .map((item) => item.date?.replaceAll(".", "-"))
      .filter(Boolean),
  ).size;
  const counts = new Map();
  pairs.forEach((item) =>
    (item.tags || []).forEach((tag) =>
      counts.set(tag, (counts.get(tag) || 0) + 1),
    ),
  );
  const frequentMood = [...counts].sort((a, b) => b[1] - a[1])[0]?.[0];
  const report = {
    frequentMood,
    stats: [
      { label: "기록한 날", value: `${days}일` },
      { label: "커피 기록", value: `${coffees.length}잔` },
      { label: "음악 기록", value: `${music.length}곡` },
      { label: "연결한 페어링", value: `${pairs.length}개` },
    ],
  };

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      /* Offline local logout remains available. */
    }
    authStore.clear();
    navigate("/auth/login");
  }

  return (
    <PageShell
      title="설정"
      subtitle="기록을 안전하게 보관하고, 필요한 도구만 꺼내 쓰세요."
    >
      <section className="panel profile-panel">
        <div className="profile-avatar">RR</div>
        <div>
          <h3>
            {local
              ? "이 브라우저의 기록장"
              : user.nickname || user.email || "나의 기록장"}
          </h3>
          <p>
            {local
              ? "체험 기록은 이 기기에 저장됩니다. 계정 동기화는 제공하지 않습니다."
              : user.email}
          </p>
          <div className="tag-row">
            {report.frequentMood && report.frequentMood !== "기록 없음" && (
              <Tag variant="cool">{report.frequentMood}</Tag>
            )}
          </div>
          <div className="action-row">
            <Link className="ghost-button" to="/help">
              이용 도움말
            </Link>
            <Link className="ghost-button" to="/backup">
              나의 자료 백업·복구
            </Link>

            {user.role === "ADMIN" && (
              <Link to="/admin" className="ghost-button">
                관리자 화면
              </Link>
            )}
            {local ? (
              <Link className="ghost-button" to="/">
                서비스 소개
              </Link>
            ) : (
              <Button onClick={handleLogout}>로그아웃</Button>
            )}
          </div>
        </div>
      </section>
      {!local && (
        <>
          {googleLinked ? (
            <p role="status">
              Google 계정을 연결했어요. 다음부터 Google로 같은 기록장을 열 수
              있습니다.
            </p>
          ) : (
            <GoogleSignIn
              link
              onSuccess={(user) => {
                authStore.setUser(user);
                setGoogleLinked(true);
              }}
            />
          )}
        </>
      )}
      <details className="simple-tools">
        <summary>이전 도구 열기</summary>
        <p>기존에 쓰던 기능과 자료는 여기에 그대로 보관되어 있어요.</p>
        <nav aria-label="이전 도구">
          {[
            ["/coffee/write", "추출 조건 자세히 기록"],
            ["/coffee/import", "기존 기록 가져오기"],
            ["/music", "음악 보관함"],
            ["/beans", "내 원두 관리"],
            ["/journey", "감상 가이드"],
            ["/ritual", "청음실"],
            ["/studio", "음악 제작"],
            ["/memories", "감각의 기억"],
            ["/recommend", "추천"],
            ["/pairing", "페어링"],
            ["/report/monthly", "취향 리포트"],
            ["/collection", "음반 컬렉션"],
            ["/connections", "자료 연결 상태"],
          ].map(([to, label]) => (
            <Link key={to} to={to}>
              {label} →
            </Link>
          ))}
        </nav>
      </details>
      <div className="stat-grid">
        {report.stats.map((stat) => (
          <div className="stat-tile" key={stat.label}>
            <span>{stat.label}</span>
            <strong className="oldnum">{stat.value}</strong>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
