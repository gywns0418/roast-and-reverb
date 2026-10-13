import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import RecordLibrary from "../../components/common/RecordLibrary.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { adaptCoffeeLog } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export default function CoffeeLogPage() {
  const { data: logs } = useApiResource(
    () => listDiaryRecords(coffeeApi.list).then((items) => items.map(adaptCoffeeLog)),
    [],
    []
  );

  return (
    <PageShell title="커피 로그" eyebrow="Side A" subtitle="원두, 추출 방식, 맛 평가와 그날의 감각을 기록합니다.">
      <div className="action-row">
        <Link to="/coffee/write" className="primary-button">커피 로그 작성</Link>
        <Link to="/coffee/import" className="ghost-button">Markdown 기록 가져오기</Link>
      </div>
      <RecordLibrary items={logs} kind="coffee" />
    </PageShell>
  );
}




