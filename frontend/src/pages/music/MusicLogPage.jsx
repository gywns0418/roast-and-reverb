import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import RecordLibrary from "../../components/common/RecordLibrary.jsx";
import { musicApi } from "../../api/musicApi.js";
import { adaptMusicLog } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export default function MusicLogPage() {
  const { data: logs } = useApiResource(
    () => listDiaryRecords(musicApi.list).then((items) => items.map(adaptMusicLog)),
    [],
    []
  );

  return (
    <PageShell title="음악 로그" eyebrow="Side B" subtitle="곡, 아티스트, 앨범, 장르와 감상 태그를 기록합니다.">
      <div className="action-row">
        <Link to="/music/search" className="primary-button">음악 검색</Link>
        <Link to="/music/write" className="ghost-button">음악 로그 작성</Link>
      </div>
      <RecordLibrary items={logs} kind="music" />
    </PageShell>
  );
}




