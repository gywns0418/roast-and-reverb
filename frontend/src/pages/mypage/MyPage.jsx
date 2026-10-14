import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Tag from "../../components/common/Tag.jsx";
import { authStore } from "../../store/authStore.js";
import { coffeeApi } from "../../api/coffeeApi.js";
import { musicApi } from "../../api/musicApi.js";
import { pairingApi } from "../../api/pairingApi.js";
import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { adaptCoffeeLog, adaptMusicLog, adaptPairing } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export default function MyPage() {
  const navigate = useNavigate();
  const local = import.meta.env.VITE_USE_REAL_API !== "true";
  const user = authStore.user || {};
  const { data: coffees } = useApiResource(() => listDiaryRecords(coffeeApi.list).then(items => items.map(adaptCoffeeLog)), [], []);
  const { data: music } = useApiResource(() => listDiaryRecords(musicApi.list).then(items => items.map(adaptMusicLog)), [], []);
  const { data: pairs } = useApiResource(() => listDiaryRecords(pairingApi.list).then(items => items.map(adaptPairing)), [], []);
  const days = new Set([...coffees, ...music].map(item => item.date?.replaceAll(".", "-")).filter(Boolean)).size;
  const counts = new Map();
  pairs.forEach(item => (item.tags || []).forEach(tag => counts.set(tag, (counts.get(tag) || 0) + 1)));
  const frequentMood = [...counts].sort((a,b) => b[1]-a[1])[0]?.[0];
  const report = { frequentMood, stats: [
    {label: "기록한 날", value: `${days}일`}, {label: "커피 기록", value: `${coffees.length}잔`},
    {label: "음악 기록", value: `${music.length}곡`}, {label: "연결한 페어링", value: `${pairs.length}개`}
  ] };

  function handleLogout() {
    authStore.clear();
    navigate("/auth/login");
  }

  return (
    <PageShell title="마이페이지" eyebrow="Profile" subtitle="나의 기록 수와 자주 등장한 취향 키워드를 확인합니다.">
      <section className="panel profile-panel">
        <div className="profile-avatar">RR</div>
        <div>
          <h3>{local ? "이 브라우저의 기록장" : user.nickname || user.email || "나의 기록장"}</h3>
          <p>{local ? "체험 기록은 이 기기에 저장됩니다. 계정 동기화는 제공하지 않습니다." : user.email}</p>
          <div className="tag-row">
            {report.frequentMood && report.frequentMood !== "기록 없음" && <Tag variant="cool">{report.frequentMood}</Tag>}
          </div>
          <div className="action-row">
            <Link className="ghost-button" to="/backup">나의 자료 백업·복구</Link>
            <Link className="ghost-button" to="/connections">자동 연결 상태 확인</Link>
            {user.role === "ADMIN" && <Link to="/admin" className="ghost-button">관리자 화면</Link>}
            {local ? <Link className="ghost-button" to="/">서비스 소개</Link> : <Button onClick={handleLogout}>로그아웃</Button>}
          </div>
        </div>
      </section>
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
