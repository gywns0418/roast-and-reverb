import { useEffect, useState } from "react";
import PageShell from "../../components/common/PageShell.jsx";
import { monthlyPickApi } from "../../api/monthlyPickApi.js";

// 실제 컵노트가 없어서, 공정(process)을 기준으로 월픽 패키지 같은 색 그라데이션을 근사한다.
function flavorColors(option) {
  const p = (option.process || "").toLowerCase();
  if (p.includes("honey")) return ["#f2b632", "#f6d976"];
  if (p.includes("anaerobic") || p.includes("cold") || p.includes("ferment")) return ["#c084fc", "#f472b6"];
  if (p.includes("natural")) return ["#ff8a5c", "#ffcf7a"];
  if (p.includes("washed")) return ["#5eead4", "#a7f3d0"];
  return ["#d8c6b4", "#eee3d7"];
}

function ScorePill({ score }) {
  if (score === null || score === undefined) return null;
  return <span className="score-pill">{score}/10</span>;
}

function OptionCard({ option }) {
  const meta = [option.origin, option.producer, option.variety, option.process].filter(Boolean);
  const [c1, c2] = flavorColors(option);
  return (
    <article className="pick-card">
      <div className="pick-card-accent" style={{ background: `linear-gradient(180deg, ${c1}, ${c2})` }} />
      <div className="pick-card-main">
        <div className="pick-card-head">
          <h3 title={option.raw_text}>{option.raw_text}</h3>
          <ScorePill score={option.score} />
        </div>
        {(meta.length > 0 || option.score_reason) && (
          <div className="pick-card-meta">
            {meta.map((m) => <span className="tag" key={m}>{m}</span>)}
            {option.score_reason && <span className="pick-card-reason" title={option.score_reason}>{option.score_reason}</span>}
          </div>
        )}
      </div>
    </article>
  );
}

function OptionRow({ options }) {
  return (
    <div className="mp-option-list">
      {options.map((o) => <OptionCard option={o} key={o.option_id} />)}
    </div>
  );
}

export default function MonthlyPickPage() {
  const [picks, setPicks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ month: "", roastery: "", sourceUrl: "", rawOptionsText: "" });
  const [submitting, setSubmitting] = useState(false);

  function loadList() {
    monthlyPickApi.list()
      .then((list) => {
        setPicks(list || []);
        if ((list || []).length > 0 && selectedId === null) {
          setSelectedId(list[0].monthly_pick_id);
        }
      })
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadList();
  }, []);

  useEffect(() => {
    if (selectedId === null) return;
    setLoading(true);
    monthlyPickApi.detail(selectedId)
      .then((data) => setDetail(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const created = await monthlyPickApi.create(form);
      setForm({ month: "", roastery: "", sourceUrl: "", rawOptionsText: "" });
      loadList();
      setSelectedId(created.monthly_pick_id);
      setDetail(created);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const options = detail?.options || [];
  const excluded = options.filter((o) => o.dark_roast || o.decaf);
  const alreadyPurchased = options.filter((o) => !o.dark_roast && !o.decaf && o.already_purchased);
  const soldOut = options.filter((o) => !o.dark_roast && !o.decaf && !o.already_purchased && o.sold_out);
  const ranked = options
    .filter((o) => !o.dark_roast && !o.decaf && !o.already_purchased && !o.sold_out)
    .slice()
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return (
    <PageShell
      title="이달의 픽 추천"
      eyebrow="Monthly Pick"
      subtitle="월픽 원두 목록을 붙여넣으면 내 취향 기준으로 순위를 매겨 드립니다."
    >
      <section className="panel">
        <h3>새 월픽 등록</h3>
        <form onSubmit={handleSubmit}>
          <div className="panel-grid">
            <input
              className="input"
              placeholder="월 (예: 2026-10)"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="로스터리 (예: 해월커피)"
              value={form.roastery}
              onChange={(e) => setForm({ ...form, roastery: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="상품 페이지 URL (선택)"
              value={form.sourceUrl}
              onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
            />
          </div>
          <p className="subtitle">원두 옵션명을 한 줄에 하나씩 붙여넣으세요.</p>
          <textarea
            className="input"
            rows={8}
            placeholder={"#37 볼리비아 핀카 이사벨 로사리오 게이샤 워시드\n#6 에티오피아 부르사 시다마 아르베고나 물루게타 문타샤 74158 워시드\n..."}
            value={form.rawOptionsText}
            onChange={(e) => setForm({ ...form, rawOptionsText: e.target.value })}
            required
          />
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "분석 중..." : "분석하기"}
          </button>
        </form>
      </section>

      {error && <p>{error}</p>}

      {picks.length > 0 && (
        <section className="panel">
          <h3>지난 월픽</h3>
          <div className="tag-row">
            {picks.map((pick) => (
              <button
                key={pick.monthly_pick_id}
                type="button"
                className={pick.monthly_pick_id === selectedId ? "primary-button" : "ghost-button"}
                onClick={() => setSelectedId(pick.monthly_pick_id)}
              >
                {pick.pick_month} · {pick.roastery}
              </button>
            ))}
          </div>
        </section>
      )}

      {loading && <p className="subtitle">불러오는 중...</p>}

      {!loading && detail && (
        <>
          <h2>추천 순위 ({ranked.length}개)</h2>
          <OptionRow options={ranked} />

          {alreadyPurchased.length > 0 && (
            <>
              <h2>이미 구매/체험한 옵션</h2>
              <OptionRow options={alreadyPurchased} />
            </>
          )}

          {soldOut.length > 0 && (
            <>
              <h2>품절</h2>
              <OptionRow options={soldOut} />
            </>
          )}

          {excluded.length > 0 && (
            <>
              <h2>제외됨 (다크로스트 / 디카페인)</h2>
              <OptionRow options={excluded} />
            </>
          )}
        </>
      )}
    </PageShell>
  );
}
