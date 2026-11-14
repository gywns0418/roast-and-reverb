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
import { verdictOf } from "../../utils/tasteProfile.js";
import { backupDue, lastBackupAt } from "../../utils/backupReminder.js";
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
  const now = new Date();
  const monthKey = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthCups = records.filter((row) => String(row.date || "").replace(/\D/g, "").startsWith(monthKey)).length;
  const waiting = records.filter((row) => !verdictOf(row)).length;
  const due = backupDue({ total: records.length, last: lastBackupAt(globalThis.localStorage) });
  const heading = records.length ? `${now.getMonth() + 1}월의 ${monthCups + 1}번째 한 잔` : "첫 한 잔을 남겨 볼까요";
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
        <div><h2>{heading}</h2><p>커피를 마셨다면, 기억하고 싶은 느낌만 남겨주세요. 한 줄이면 충분해요.</p></div>
        <img src={import.meta.env.BASE_URL + "images/journal-entry.webp"} width="640" height="427" alt="" aria-hidden="true" />
      </div>
      <ol className="simple-steps" aria-label="한 잔을 남기는 순서">
        <li>1. 느낌을 적어요</li>
        <li>2. 원하면 음악을 골라요</li>
        <li>3. 다시 마실지 고르면 취향이 쌓여요</li>
      </ol>
      <FirstCup
        onSaved={(row) =>
          setAdded((previous) => [adaptCoffeeLog(row), ...previous])
        }
      />
      </div>
        <section className="simple-recent">
          {records.length > 0 && (
            <div className="desk-month" aria-label="이번 달 기록">
              <p>{now.getMonth() + 1}월의 커피 노트</p>
              <dl>
                <div><dt>이번 달 남긴 잔</dt><dd>{monthCups}</dd></div>
                <div><dt>판단을 기다리는 잔</dt><dd>{waiting}</dd></div>
              </dl>
              {waiting > 0 && <Link to="/taste">다시 마실지 답하러 가기 →</Link>}
              {due && <Link className="desk-backup-due" to="/taste">기록이 이 브라우저에만 있어요 · 백업하기 →</Link>}
            </div>
          )}
          <div className="simple-section-title">
            <h2>지난 한 잔</h2>
            <Link to="/coffee">모든 기록 보기 →</Link>
          </div>
          <div className="simple-records">
            {!records.length && <div className="desk-empty"><h3>아직 남긴 한 잔이 없어요.</h3><p>오늘의 느낌을 적으면 이곳에서 다시 만날 수 있어요.</p><button type="button" className="ghost-button" onClick={() => document.querySelector("#today-note textarea")?.focus()}>첫 한 잔 남기기 →</button></div>}
            {records.slice(0, 3).map((row) => (
              <Link key={row.id} to={`/coffee/${row.id}`}>
                <img className="recent-cup-art" src={import.meta.env.BASE_URL + "images/coffee-editorial.webp"} alt="" aria-hidden="true" width="52" height="64" />
                <div className="recent-cup-copy">
                <small>{row.date}</small>
                <h3>{row.bean}</h3>
                <p>{row.memo || "이날의 한 잔 다시 보기"}</p>
                </div>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
          <div className="desk-storage-note"><strong>다음에 어떤 커피를 마실지 고민될 때</strong><p>"다시 마시고 싶어요"를 남긴 잔이 모이면, 좋았던 맛과 이번 달 월픽에서 닮은 원두를 나의 취향에서 보여 드려요.</p><Link to="/taste">나의 취향 보기 →</Link></div>
        </section>
      </div>
      <JournalNextSteps omit="/dashboard" />
    </PageShell>
  );
}
