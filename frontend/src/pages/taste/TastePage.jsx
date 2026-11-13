import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Loading from "../../components/common/Loading.jsx";
import VerdictPicker from "../../components/coffee/VerdictPicker.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { adaptCoffeeLog } from "../../api/adapters.js";
import { saveCoffeeVerdict } from "../../api/verdictApi.js";
import { monthlyCatalog } from "../../api/monthlyCatalog.js";
import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { currentMonthlyCatalog } from "../../utils/currentMonthlyCatalog.js";
import { buildTasteProfile, roasteryTried, tasteCardText, tasteMatch, verdictOf } from "../../utils/tasteProfile.js";
import "../../styles/taste-journey.css";

const editionLabel = { regular: "월픽", global: "글로벌 월픽", small: "스몰 월픽" };

export default function TastePage() {
  const [records, setRecords] = useState([]),
    [catalog, setCatalog] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(""),
    [notice, setNotice] = useState(""),
    [shareNotice, setShareNotice] = useState("");
  useEffect(() => {
    let live = true;
    Promise.allSettled([
      listDiaryRecords(coffeeApi.list).then((rows) => rows.map(adaptCoffeeLog)),
      monthlyCatalog(),
    ]).then(([mine, monthly]) => {
      if (!live) return;
      if (mine.status === "fulfilled") setRecords(mine.value);
      else setError(mine.reason?.message || "기록을 불러오지 못했어요.");
      if (monthly.status === "fulfilled") setCatalog(currentMonthlyCatalog(monthly.value));
      setLoading(false);
    });
    return () => {
      live = false;
    };
  }, []);

  if (loading)
    return (
      <PageShell title="나의 취향">
        <Loading title="내 기록에서 취향을 모으고 있어요." />
      </PageShell>
    );

  const profile = buildTasteProfile(records);
  const sorted = [...profile.unjudged].sort((a, b) => b.date.localeCompare(a.date));
  const matches = catalog
    .flatMap((owner) => owner.items.map((bean) => ({ bean, owner, match: tasteMatch(bean, profile) })))
    .filter((row) => row.match)
    .sort((a, b) => b.match.shared.length - a.match.shared.length)
    .slice(0, 4);

  async function judge(record, verdict) {
    setSaving(String(record.id));
    setNotice("");
    try {
      const updated = await saveCoffeeVerdict(record.id, verdict);
      setRecords((rows) => rows.map((row) => (String(row.id) === String(record.id) ? { ...row, brewDetails: updated.brewDetails } : row)));
      setNotice(`"${record.bean === "원두 미기록" ? "이날의 한 잔" : record.bean}" 판단을 저장했어요. 위 취향에 바로 반영됐어요.`);
    } catch (e) {
      setNotice(e.message || "판단을 저장하지 못했어요. 기록은 그대로예요.");
    } finally {
      setSaving("");
    }
  }
  async function share() {
    const text = tasteCardText(profile);
    try {
      if (navigator.share) await navigator.share({ title: "나의 커피 취향", text });
      else {
        await navigator.clipboard.writeText(text);
        setShareNotice("취향 카드 문장을 복사했어요. 커피 모임이나 SNS에 붙여 넣어 보세요.");
      }
    } catch (e) {
      if (e?.name !== "AbortError") setShareNotice("공유하지 못했어요. 위 문장을 직접 복사해 주세요.");
    }
  }

  return (
    <PageShell title="나의 취향" subtitle="다시 마시고 싶었던 잔들이 모여, 나만의 커피가 보여요.">
      {error && <p role="alert" className="resource-error">{error}</p>}
      <section className="taste-summary" aria-label="취향 요약">
        <div><strong>{profile.total}</strong><span>남긴 한 잔</span></div>
        <div><strong>{profile.judged}</strong><span>판단한 한 잔</span></div>
        <div><strong>{profile.againCount}</strong><span>다시 마시고 싶은 잔</span></div>
        <div><strong>{profile.roasteries.length}</strong><span>만나 본 로스터리</span></div>
      </section>

      {profile.judged === 0 ? (
        <section className="taste-empty">
          <h2>아직 판단을 남긴 잔이 없어요</h2>
          <p>한 잔마다 "다시 마시고 싶나요?"에 답하면, 좋았던 맛과 덜 맞았던 맛이 여기 쌓여요. 지난 기록에도 바로 답할 수 있어요.</p>
          {!profile.total && <Link className="primary-button" to="/dashboard">첫 한 잔 남기기</Link>}
        </section>
      ) : (
        <div className="taste-grid">
          <section className="taste-card">
            <h2>다시 찾게 되는 맛</h2>
            {profile.likedFamilies.length ? (
              <ul className="taste-chips">
                {profile.likedFamilies.map((f) => <li key={f.key}>{f.label} <small>{f.again}잔</small></li>)}
              </ul>
            ) : <p className="taste-muted">"다시 마시고 싶어요"를 고른 잔의 감상에서 맛 표현을 아직 찾지 못했어요. 감상에 "고소한", "꽃향" 같은 말을 남겨 보세요.</p>}
            {profile.dislikedFamilies.length > 0 && (
              <>
                <h3>나와 덜 맞았던 맛</h3>
                <ul className="taste-chips taste-chips-muted">
                  {profile.dislikedFamilies.map((f) => <li key={f.key}>{f.label} <small>{f.notMine}잔</small></li>)}
                </ul>
              </>
            )}
            {profile.favoriteMethods.length > 0 && <p className="taste-muted">좋았던 잔의 추출: {profile.favoriteMethods.map((m) => `${m.name} ${m.count}잔`).join(" · ")}</p>}
            <small className="taste-basis">내가 고른 판단과 직접 쓴 감상만 셌어요. 판매처 설명이나 추측은 넣지 않았어요.</small>
          </section>

          <section className="taste-card">
            <h2>다시 마시고 싶었던 커피</h2>
            {profile.againCups.length ? (
              <ul className="taste-list">
                {profile.againCups.slice(0, 6).map((cup) => (
                  <li key={cup.id}><Link to={`/coffee/${cup.id}`}><strong>{cup.bean === "원두 미기록" ? "이날의 한 잔" : cup.bean}</strong><span>{[cup.roastery, cup.date].filter(Boolean).join(" · ")}</span></Link></li>
                ))}
              </ul>
            ) : <p className="taste-muted">원두 이름이나 로스터리를 남긴 "다시 마실래요" 기록이 아직 없어요.</p>}
          </section>
        </div>
      )}

      <section className="taste-card taste-monthly">
        <div className="taste-card-head">
          <h2>이번 달 로스터리로 확인해 보기</h2>
          <Link to="/monthly-pick">월픽 전체 보기 →</Link>
        </div>
        {catalog.length > 0 && (
          <ul className="taste-roastery-check">
            {catalog.map((owner) => (
              <li key={owner.sourceUrl} data-tried={roasteryTried(profile, owner.roastery)}>
                <span>{editionLabel[owner.edition] || "월픽"} · <strong>{owner.roastery}</strong></span>
                <em>{roasteryTried(profile, owner.roastery) ? "✓ 기록한 로스터리" : "아직 기록 없음"}</em>
              </li>
            ))}
          </ul>
        )}
        {matches.length ? (
          <>
            <p className="taste-muted">판매처 컵노트가 내가 좋았던 맛과 겹치는 원두예요. 덜 맞았던 맛이 들어 있는 원두는 뺐어요.</p>
            <ul className="taste-matches">
              {matches.map(({ bean, owner, match }) => (
                <li key={owner.sourceUrl + bean.id}>
                  <strong>{bean.name.replace(/\s*\((?:언스페셜티 블렌드|하우스 블렌드)\)\s*$/, "")}</strong>
                  <span>{owner.roastery} · {(bean.flavors || []).slice(0, 4).join(" · ")}</span>
                  <em>겹친 맛: {match.shared.join(", ")}</em>
                </li>
              ))}
            </ul>
            <Link className="ghost-button" to="/monthly-pick?mine=1">월픽에서 내 취향과 닮은 원두만 보기</Link>
          </>
        ) : (
          <p className="taste-muted">{profile.likedFamilies.length ? "이번 달 월픽에서 좋았던 맛과 겹치는 원두를 찾지 못했어요. 새로운 맛을 시험해 볼 기회예요." : "좋았던 맛이 쌓이면 이번 달 월픽에서 닮은 원두를 골라 드려요."}</p>
        )}
      </section>

      {notice && <p role="status" className="taste-notice">{notice}</p>}
      {sorted.length > 0 && (
        <section className="taste-card">
          <div className="taste-card-head">
            <h2>아직 판단하지 않은 한 잔 {sorted.length}잔</h2>
            <small>답할수록 취향이 또렷해져요</small>
          </div>
          <ul className="taste-unjudged">
            {sorted.slice(0, 5).map((cup) => (
              <li key={cup.id}>
                <Link to={`/coffee/${cup.id}`}>
                  <strong>{cup.bean === "원두 미기록" ? "이날의 한 잔" : cup.bean}</strong>
                  <span>{cup.date}{cup.memo ? " · " + cup.memo.slice(0, 40) : ""}</span>
                </Link>
                <VerdictPicker compact legend="다시 마시고 싶나요?" value={verdictOf(cup)} disabled={saving === String(cup.id)} onChange={(v) => judge(cup, v)} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile.judged > 0 && (
        <section className="taste-card taste-share">
          <h2>내 취향 카드</h2>
          <pre>{tasteCardText(profile)}</pre>
          <button type="button" className="primary-button" onClick={share}>취향 카드 공유하기</button>
          <small>누를 때만 이 문장을 복사하거나 공유해요. 서버로 보내지 않아요.</small>
          {shareNotice && <p role="status" className="taste-notice">{shareNotice}</p>}
        </section>
      )}
    </PageShell>
  );
}
