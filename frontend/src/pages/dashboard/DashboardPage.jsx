import { useState } from "react";
import { Link } from "react-router-dom";
import FirstCup from "../../components/coffee/FirstCup.jsx";
import JournalNextSteps from "../../components/common/JournalNextSteps.jsx";

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
      <div className="writing-desk">
      <div className="writing-desk-compose" id="today-note">
      <div className="writing-desk-intro">
        <div><h2>오늘의 한 잔</h2><p>커피를 마셨다면, 기억하고 싶은 느낌만 남겨주세요.</p></div>
        <img src={import.meta.env.BASE_URL + "images/beans/light-roast.webp"} width="100" height="132" alt="" aria-hidden="true" />
      </div>
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
      </div>
        <section className="simple-recent">
          <div className="simple-section-title">
            <h2>지난 한 잔</h2>
            <Link to="/coffee">모든 기록 보기 →</Link>
          </div>
          <div className="simple-records">
            {!records.length && <div className="desk-empty"><h3>아직 남긴 한 잔이 없어요.</h3><p>오늘의 느낌을 적으면 이곳에서 다시 만날 수 있어요.</p><button type="button" className="ghost-button" onClick={() => document.querySelector("#today-note textarea")?.focus()}>첫 한 잔 남기기 →</button></div>}
            {records.slice(0, 3).map((row) => (
              <Link key={row.id} to={`/coffee/${row.id}`}>
                <img className="recent-cup-art" src={import.meta.env.BASE_URL + "images/guide-cup.webp"} alt="" aria-hidden="true" width="52" height="64" />
                <div className="recent-cup-copy">
                <small>{row.date}</small>
                <h3>{row.bean}</h3>
                <p>{row.memo || "이날의 한 잔 다시 보기"}</p>
                </div>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
          <div className="desk-storage-note"><strong>한 줄씩 쌓이는 나의 취향</strong><p>잘 쓴 문장보다 오늘 느낀 그대로를 남겨보세요. 음악은 원할 때만 더해도 좋아요.</p></div>
        </section>
      </div>
      <JournalNextSteps omit="/dashboard" />
    </PageShell>
  );
}
