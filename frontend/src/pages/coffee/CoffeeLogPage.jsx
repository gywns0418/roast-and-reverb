import { useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Loading from "../../components/common/Loading.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { adaptCoffeeLog } from "../../api/adapters.js";
import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { useApiResource } from "../../hooks/useApiResource.js";
export default function CoffeeLogPage() {
  const [query, setQuery] = useState("");
  const { data: logs, loading } = useApiResource(
    () =>
      listDiaryRecords(coffeeApi.list).then((rows) => rows.map(adaptCoffeeLog)),
    [],
    [],
  );
  const visible = logs
    .filter((row) =>
      [row.bean, row.roastery, row.memo, row.date]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .sort(
      (a, b) => b.date.localeCompare(a.date) || Number(b.id) - Number(a.id),
    );
  return (
    <PageShell
      title="내 기록"
      subtitle="짧게 남긴 한 줄에서, 그날의 한 잔을 다시 떠올려요."
    >
      {loading ? (
        <Loading title="나의 기록을 펼치고 있어요." />
      ) : (
        <>
          <div className="simple-section-title">
            <p>{logs.length}개의 한 잔</p>
            <Link className="primary-button" to="/dashboard">
              새 한 잔 남기기
            </Link>
          </div>
          {logs.length > 0 && (
            <label className="simple-record-search">
              기록 찾기
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="원두 이름이나 남긴 느낌"
                type="search"
              />
            </label>
          )}
          <div className="simple-records">
            {visible.map((row) => (
              <Link key={row.id} to={"/coffee/" + row.id}>
                <small>{row.date}</small>
                <h2>{row.bean}</h2>
                <p>{row.memo || "이날의 한 잔 다시 보기"}</p>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
          {!visible.length && (
            <p className="simple-empty">
              {query
                ? "찾는 기록이 없어요. 다른 말로 찾아보세요."
                : "아직 남긴 한 잔이 없어요. 기억나는 느낌부터 적어볼까요?"}
            </p>
          )}
        </>
      )}
    </PageShell>
  );
}
