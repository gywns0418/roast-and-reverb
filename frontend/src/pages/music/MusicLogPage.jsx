import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { musicLogs } from "../../data/sampleData.js";
import { musicApi } from "../../api/musicApi.js";
import { adaptMusicLog } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export default function MusicLogPage() {
  const fallback = musicLogs.map(adaptMusicLog);
  const { data: logs } = useApiResource(
    () => musicApi.list().then((items) => items.map(adaptMusicLog)),
    fallback,
    []
  );

  return (
    <PageShell title="음악 로그" eyebrow="Side B" subtitle="곡, 아티스트, 앨범, 장르와 감상 태그를 기록합니다.">
      <div className="action-row">
        <Link to="/music/search" className="primary-button">음악 검색</Link>
        <Link to="/music/write" className="ghost-button">음악 로그 작성</Link>
      </div>
      <div className="ledger">
        <div className="ledger-head">
          <span className="book smcp">Music Log</span>
          <span className="vol oldnum">{logs.length} entries</span>
        </div>
        {logs.length === 0
          ? <EmptyState icon="wave">아직 채워지지 않은 첫 장이에요.</EmptyState>
          : logs.map((item, i) => (
            <Link to={`/music/${item.id}`} className="ledger-line fresh" key={item.id}>
              <time className="oldnum">{item.date.slice(5)}.</time>
              <span className="entry">
                <span className="type-dot music" />
                <strong>{item.artist} — {item.track}</strong> — {item.album} · {item.genre}
              </span>
              <span className="no oldnum">no. {String(logs.length - i).padStart(3, "0")}</span>
            </Link>
          ))}
      </div>
    </PageShell>
  );
}
