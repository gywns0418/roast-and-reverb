import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import { musicLogs } from "../../data/sampleData.js";

export default function MusicLogPage() {
  return (
    <PageShell title="음악 로그" eyebrow="Side B" subtitle="곡, 아티스트, 앨범, 장르와 감상 태그를 기록합니다.">
      <div className="ledger">
        <div className="ledger-head">
          <span className="book smcp">Music Log</span>
          <span className="vol oldnum">{musicLogs.length} entries</span>
        </div>
        {musicLogs.map((item, i) => (
          <Link to={`/music/${item.id}`} className="ledger-line fresh" key={item.id}>
            <time className="oldnum">{item.date.slice(5)}.</time>
            <span className="entry">
              <span className="type-dot music" />
              <strong>{item.artist} — {item.track}</strong> — {item.album} · {item.genre}
            </span>
            <span className="no oldnum">no. {String(musicLogs.length - i).padStart(3, "0")}</span>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
