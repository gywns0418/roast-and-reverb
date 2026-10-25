import { useState } from "react";
import { Link } from "react-router-dom";
import FirstCup from "../../components/coffee/FirstCup.jsx";

import Loading from "../../components/common/Loading.jsx";
import PageShell from "../../components/common/PageShell.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { adaptCoffeeLog } from "../../api/adapters.js";
import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { useApiResource } from "../../hooks/useApiResource.js";
export default function DashboardPage() {
  const [added, setAdded] = useState([]);
  const { data: stored, loading } = useApiResource(
    () =>
      listDiaryRecords(coffeeApi.list).then((rows) => rows.map(adaptCoffeeLog)),
    [],
    [],
  );
  const records = [
    ...added,
    ...stored.filter(
      (row) => !added.some((x) => String(x.id) === String(row.id)),
    ),
  ].sort((a, b) => b.date.localeCompare(a.date) || Number(b.id) - Number(a.id));
  if (loading)
    return (
      <PageShell title="오늘의 한 잔">
        <Loading
          title="나의 기록을 펼치고 있어요."
          detail="저장한 한 잔을 확인합니다."
        />
      </PageShell>
    );
  return (
    <PageShell
      title="오늘의 한 잔"
      subtitle="커피를 마셨다면, 기억하고 싶은 느낌만 남겨주세요."
    >
      <ol className="simple-steps" aria-label="한 잔을 남기는 순서">
        <li>1. 느낌을 적어요</li>
        <li>2. 원하면 음악을 골라요</li>
        <li>3. 내 기록에 보관해요</li>
      </ol>
      <FirstCup
        onSaved={(row) =>
          setAdded((previous) => [adaptCoffeeLog(row), ...previous])
        }
      />
      {records.length > 0 && (
        <section className="simple-recent">
          <div className="simple-section-title">
            <h2>지난 한 잔</h2>
            <Link to="/coffee">모든 기록 보기 →</Link>
          </div>
          <div className="simple-records">
            {records.slice(0, 3).map((row) => (
              <Link key={row.id} to={`/coffee/${row.id}`}>
                <small>{row.date}</small>
                <h3>{row.bean}</h3>
                <p>{row.memo || "이날의 한 잔 다시 보기"}</p>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
