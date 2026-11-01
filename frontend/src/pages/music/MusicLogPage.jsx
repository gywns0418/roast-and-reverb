import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Loading from "../../components/common/Loading.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { musicApi } from "../../api/musicApi.js";
import { adaptCoffeeLog, adaptMusicLog } from "../../api/adapters.js";
import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { soundtrackRecords } from "../../utils/coffeeSoundtrack.js";
import { useApiResource } from "../../hooks/useApiResource.js";
import JournalNextSteps from "../../components/common/JournalNextSteps.jsx";
export default function MusicLogPage() {
  const { data: songs, loading: a } = useApiResource(
    () =>
      listDiaryRecords(musicApi.list).then((rows) => rows.map(adaptMusicLog)),
    [],
    [],
  );
  const { data: cups, loading: b } = useApiResource(
    () =>
      listDiaryRecords(coffeeApi.list).then((rows) => rows.map(adaptCoffeeLog)),
    [],
    [],
  );
  const connected = soundtrackRecords(cups);
  const rows = [...connected, ...songs].sort((x, y) =>
    y.date.localeCompare(x.date),
  );
  return (
    <PageShell
      title="함께 남긴 음악"
      subtitle="커피와 함께 고른 곡을 다시 꺼내보세요."
    >
      {a || b ? (
        <Loading title="남긴 음악을 확인하고 있어요." />
      ) : (
        <>
        <div className="journal-overview" aria-label="음악 기록 요약">
          <div><span>함께 남긴 음악</span><strong>{rows.length}<small>곡</small></strong></div>
          <div><span>커피와 연결한 음악</span><strong>{connected.length}<small>곡</small></strong></div>
          <div><span>가장 최근 기록</span><strong className="journal-last-date">{rows[0]?.date || "첫 음악을 기다려요"}</strong></div>
        </div>
        <div className="simple-section-title"><h2 className="journal-list-title">나의 음악 일지</h2><Link className="ghost-button" to="/music/write">음악 직접 남기기</Link></div>
        <div className="simple-records">
          {rows.map((row) => (
            <Link key={row.id} to={row.path || "/music/" + row.id}>
              <img className="record-cup-art" src={import.meta.env.BASE_URL + "images/guide-music.webp"} alt="" aria-hidden="true" width="64" height="64" />
              <small>{row.date}</small>
              <h2>{row.track}</h2>
              <p>{row.artist}</p>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
          {!rows.length && (
            <div className="quiet-section journal-desktop-empty">
              <img src={import.meta.env.BASE_URL + "images/guide-music.webp"} alt="" aria-hidden="true" width="120" height="120" />
              <h2>아직 남긴 음악이 없어요.</h2>
              <p>
                한 잔의 기록을 확인할 때 음악을 선택해 함께 보관할 수 있어요.
              </p>
              <Link className="primary-button" to="/dashboard">한 잔과 음악 남기기 →</Link>
            </div>
          )}
        </div>
        <JournalNextSteps omit="/dashboard" />
        </>
      )}
    </PageShell>
  );
}
