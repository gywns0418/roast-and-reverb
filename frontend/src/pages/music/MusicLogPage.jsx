import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import RecordLibrary from "../../components/common/RecordLibrary.jsx";
import { musicApi } from "../../api/musicApi.js";
import {coffeeApi} from "../../api/coffeeApi.js";
import {soundtrackRecords} from "../../utils/coffeeSoundtrack.js";
import { adaptCoffeeLog, adaptMusicLog } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export default function MusicLogPage() {
  const { data: logs } = useApiResource(
    () => listDiaryRecords(musicApi.list).then((items) => items.map(adaptMusicLog)),
    [],
    []
  );

  const {data:coffees}=useApiResource(()=>listDiaryRecords(coffeeApi.list).then(rows=>rows.map(adaptCoffeeLog)),[],[]);
  const attached=soundtrackRecords(coffees);
  return (
    <PageShell title="음악 보관함" eyebrow="Side B" subtitle="커피에 매칭한 음악과 만든 연주를 다시 만나보세요. 감상은 커피와 함께 남깁니다.">
      <div className="action-row">
        <Link to="/coffee/write" className="primary-button">커피에 음악 받기</Link>
        <Link to="/recommend" className="ghost-button">다른 음악 찾아보기</Link>
      </div>
      <RecordLibrary items={[...attached,...logs]} kind="music" />
    </PageShell>
  );
}




