import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Loading from "../../components/common/Loading.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { adaptCoffeeLog } from "../../api/adapters.js";
import { monthlyCatalog } from "../../api/monthlyCatalog.js";
import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { currentMonthlyCatalog } from "../../utils/currentMonthlyCatalog.js";
import { buildTasteProfile, tasteMatch } from "../../utils/tasteProfile.js";
import { compareTaste, decodeTaste, withParticle } from "../../utils/tasteShare.js";
import { flavorBandBackground } from "../../utils/flavorBand.js";
import "../../styles/taste-journey.css";

const plainName = (name) => name.replace(/\s*\((?:언스페셜티 블렌드|하우스 블렌드)\)\s*$/, "");
const Chips = ({ list, muted }) => (
  <ul className={"taste-chips" + (muted ? " taste-chips-muted" : "")}>
    {list.map((f) => <li key={f.key}>{f.label}</li>)}
  </ul>
);

export default function TasteComparePage() {
  const [params] = useSearchParams();
  const friend = decodeTaste(params.get("t") || "");
  const [records, setRecords] = useState([]),
    [catalog, setCatalog] = useState([]),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let live = true;
    Promise.allSettled([
      listDiaryRecords(coffeeApi.list).then((rows) => rows.map(adaptCoffeeLog)),
      monthlyCatalog(),
    ]).then(([mine, monthly]) => {
      if (!live) return;
      if (mine.status === "fulfilled") setRecords(mine.value);
      if (monthly.status === "fulfilled") setCatalog(currentMonthlyCatalog(monthly.value));
      setLoading(false);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!friend)
    return (
      <PageShell title="취향 비교" subtitle="친구가 보낸 취향 링크로 서로의 커피를 견줘 봐요.">
        <section className="taste-empty">
          <h2>열 수 없는 취향 링크예요</h2>
          <p>링크가 잘렸거나 바뀌었을 수 있어요. 보낸 사람에게 "나의 취향 → 취향 비교 링크"를 다시 복사해 달라고 해 주세요.</p>
          <Link className="primary-button" to="/taste">나의 취향 보기</Link>
        </section>
      </PageShell>
    );
  if (loading)
    return (
      <PageShell title="취향 비교">
        <Loading title="두 사람의 취향을 나란히 놓고 있어요." />
      </PageShell>
    );

  const who = friend.name || "친구";
  const mine = buildTasteProfile(records);
  const hasMine = mine.likedFamilies.length + mine.dislikedFamilies.length > 0;
  const result = compareTaste(mine, friend);
  const together = catalog
    .flatMap((owner) => owner.items.map((bean) => ({ bean, owner, theirs: tasteMatch(bean, friend), ours: hasMine ? tasteMatch(bean, mine) : null })))
    .filter((row) => row.theirs && (!hasMine || row.ours))
    .slice(0, 4);

  return (
    <PageShell title={`${who}의 커피 취향`} subtitle="서로 다시 마시고 싶었던 맛을 견주고, 이번 달 함께 마셔 볼 원두를 찾아요.">
      <section className="compare-pair" aria-label="두 사람의 취향">
        <article className="compare-person">
          <p className="compare-who">{who}</p>
          <h2>다시 찾는 맛</h2>
          {friend.likedFamilies.length ? <Chips list={friend.likedFamilies} /> : <p className="taste-muted">아직 좋았던 맛이 쌓이지 않았어요.</p>}
          {friend.dislikedFamilies.length > 0 && (
            <>
              <h3>덜 맞았던 맛</h3>
              <Chips list={friend.dislikedFamilies} muted />
            </>
          )}
          <p className="compare-meta">판단한 한 잔 {friend.judged}잔 · 로스터리 {friend.roasteryCount}곳{friend.methods.length ? ` · ${friend.methods.join(", ")}` : ""}</p>
        </article>
        <article className="compare-person compare-me">
          <p className="compare-who">나</p>
          <h2>다시 찾는 맛</h2>
          {mine.likedFamilies.length ? <Chips list={mine.likedFamilies} /> : <p className="taste-muted">{mine.total ? "기록에 \"다시 마시고 싶어요\"를 남기면 여기 쌓여요." : "아직 기록이 없어요. 첫 한 잔을 남기면 바로 견줘 볼 수 있어요."}</p>}
          {mine.dislikedFamilies.length > 0 && (
            <>
              <h3>덜 맞았던 맛</h3>
              <Chips list={mine.dislikedFamilies} muted />
            </>
          )}
          <p className="compare-meta">판단한 한 잔 {mine.judged}잔 · 로스터리 {mine.roasteries.length}곳</p>
        </article>
      </section>

      {hasMine ? (
        <section className="taste-card compare-result">
          <h2>견줘 보니</h2>
          <dl>
            <div><dt>둘 다 다시 찾는 맛</dt><dd>{result.bothLiked.length ? result.bothLiked.map((f) => f.label).join(", ") : "아직 겹치는 맛이 없어요"}</dd></div>
            <div><dt>{withParticle(who, ["이", "가"])} 권할 만한 맛</dt><dd>{result.friendOnly.length ? result.friendOnly.map((f) => f.label).join(", ") : "새로 권할 맛이 없어요"}</dd></div>
            <div><dt>내가 권할 만한 맛</dt><dd>{result.mineOnly.length ? result.mineOnly.map((f) => f.label).join(", ") : "새로 권할 맛이 없어요"}</dd></div>
            {result.split.length > 0 && <div><dt>서로 갈린 맛</dt><dd>{result.split.map((f) => `${f.label}(${f.friendLikes ? who : "나"}만 좋아함)`).join(", ")}</dd></div>}
          </dl>
          <small className="taste-basis">각자 고른 판단과 직접 쓴 감상에서 찾은 맛만 견줬어요. 점수는 매기지 않아요.</small>
        </section>
      ) : (
        <section className="taste-empty">
          <h2>내 취향도 남기면 바로 견줘 볼 수 있어요</h2>
          <p>한 잔을 기록하고 "다시 마시고 싶나요?"에 답하면, {who}와 겹치는 맛과 갈리는 맛이 여기 나타나요. 기록은 이 브라우저에만 저장돼요.</p>
          <Link className="primary-button" to="/dashboard">첫 한 잔 남기기</Link>
        </section>
      )}

      <section className="taste-card taste-monthly">
        <div className="taste-card-head">
          <h2>{hasMine ? "이번 달 함께 마셔 볼 원두" : `이번 달 ${who}의 취향과 닮은 원두`}</h2>
          <Link to="/monthly-pick">월픽 전체 보기 →</Link>
        </div>
        {together.length ? (
          <ul className="taste-matches">
            {together.map(({ bean, owner, theirs, ours }) => (
              <li key={owner.sourceUrl + bean.id}>
                  <i className="taste-match-band" aria-hidden="true" style={{ background: flavorBandBackground(bean) }} />
                <strong>{plainName(bean.name)}</strong>
                <span>{owner.roastery} · {(bean.flavors || []).slice(0, 4).join(" · ")}</span>
                <em>{withParticle(who, ["과", "와"])} 겹친 맛: {theirs.shared.join(", ")}{ours ? ` · 나와 겹친 맛: ${ours.shared.join(", ")}` : ""}</em>
              </li>
            ))}
          </ul>
        ) : (
          <p className="taste-muted">이번 달 월픽에서 {hasMine ? "두 사람의 좋았던 맛과 모두 겹치는" : `${who}의 좋았던 맛과 겹치는`} 원두를 찾지 못했어요. 월픽에서 직접 둘러보세요.</p>
        )}
      </section>

      <p className="compare-privacy">이 화면은 링크에 담긴 맛 이름과 잔 수만 읽어요. 내 기록은 이 브라우저 밖으로 보내지 않아요.</p>
      <div className="action-row">
        <Link className="ghost-button" to="/taste">내 취향 링크 만들기</Link>
      </div>
    </PageShell>
  );
}
