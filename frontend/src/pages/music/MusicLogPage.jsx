import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Loading from "../../components/common/Loading.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { musicApi } from "../../api/musicApi.js";
import { adaptCoffeeLog, adaptMusicLog } from "../../api/adapters.js";
import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { soundtrackRecords } from "../../utils/coffeeSoundtrack.js";
import { useApiResource } from "../../hooks/useApiResource.js";
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
  const rows = [...soundtrackRecords(cups), ...songs].sort((x, y) =>
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
        <div className="simple-records">
          {rows.map((row) => (
            <Link key={row.id} to={row.path || "/music/" + row.id}>
              <small>{row.date}</small>
              <h2>{row.track}</h2>
              <p>{row.artist}</p>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
          {!rows.length && (
            <div className="quiet-section">
              <h2>아직 남긴 음악이 없어요.</h2>
              <p>
                한 잔의 기록을 확인할 때 음악을 선택해 함께 보관할 수 있어요.
              </p>
              <Link to="/dashboard">한 잔 남기기 →</Link>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
