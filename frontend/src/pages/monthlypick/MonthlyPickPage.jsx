import { useEffect, useRef, useState } from "react";
import PageShell from "../../components/common/PageShell.jsx";
import Loading from "../../components/common/Loading.jsx";
import BeanArtwork from "../../components/beans/BeanArtwork.jsx";
import { monthlyCatalog } from "../../api/monthlyCatalog.js";
const labels = { regular: "월픽", global: "글로벌", small: "스몰" };
const status = {
  available: "구매 가능",
  "sold-out": "품절",
  upcoming: "판매 예정",
  ended: "판매 종료",
  unknown: "재고 미확인",
};
const price = (bean) =>
  bean.prices?.length
    ? bean.prices
        .map(
          (p) => p.label + " " + Number(p.price).toLocaleString("ko-KR") + "원",
        )
        .join(" · ")
    : "가격은 판매처에서 확인";
export default function MonthlyPickPage() {
  const [catalog, setCatalog] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [series, setSeries] = useState(""),
    [query, setQuery] = useState(""),
    [available, setAvailable] = useState(false),
    [active, setActive] = useState(null);
  const dialog = useRef(null),
    opener = useRef(null);
  useEffect(() => {
    let live = true;
    monthlyCatalog()
      .then((rows) => {
        if (live) {
          setCatalog(rows);
          setSeries(
            rows.find((x) => x.edition === "regular")?.sourceUrl ||
              rows[0]?.sourceUrl ||
              "",
          );
        }
      })
      .catch((e) => {
        if (live) setError(e.message);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);
  const product = catalog.find((p) => p.sourceUrl === series);
  const beans = (product?.items || []).filter(
    (b) =>
      (!available || b.availability === "available") &&
      [b.name, b.roastery, b.origin, b.process, ...(b.flavors || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  function open(bean, event) {
    opener.current = event.currentTarget;
    setActive(bean);
    dialog.current?.showModal();
  }
  return (
    <PageShell
      title="원두 둘러보기"
      subtitle="다음에 마실 한 잔을 천천히 골라보세요."
    >
      {loading ? (
        <Loading title="이번 달 원두를 살펴보고 있어요." />
      ) : error ? (
        <p role="alert" className="resource-error">
          {error}
        </p>
      ) : (
        <>
          <div className="quiet-catalog-controls">
            <label>
              어떤 월픽을 볼까요?
              <select
                value={series}
                onChange={(e) => {
                  setSeries(e.target.value);
                  setQuery("");
                }}
              >
                {catalog.map((p) => (
                  <option key={p.sourceUrl} value={p.sourceUrl}>
                    {labels[p.edition] || "월픽"} · {p.roastery}
                  </option>
                ))}
              </select>
            </label>
            <label>
              원두 찾기
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="이름, 산지 또는 맛"
              />
            </label>
            <label className="quiet-check">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
              />
              구매 가능한 원두만
            </label>
          </div>
          {product && (
            <div className="quiet-source">
              <p>
                {product.month} · {product.roastery} · {beans.length}종
              </p>
              <a href={product.sourceUrl} target="_blank" rel="noreferrer">
                판매처 원문 ↗
              </a>
              <small>
                판매 상태는 확인 이후 달라질 수 있어요.{" "}
                {product.sourceCheckedAt
                  ? "확인 " +
                    new Date(product.sourceCheckedAt).toLocaleDateString(
                      "ko-KR",
                    )
                  : ""}
              </small>
            </div>
          )}
          <div className="quiet-bean-grid">
            {beans.map((bean) => (
              <button
                type="button"
                className="quiet-bean"
                key={bean.id}
                onClick={(event) => open(bean, event)}
              >
                <BeanArtwork item={bean} />
                <div>
                  <small>{status[bean.availability] || status.unknown}</small>
                  <h2>{bean.name}</h2>
                  <p>
                    {bean.flavors?.join(" · ") || "컵노트는 판매처에서 확인"}
                  </p>
                  <span>{price(bean)}</span>
                  <b>원두 자세히 보기 →</b>
                </div>
              </button>
            ))}
          </div>
          {!beans.length && (
            <p className="simple-empty">
              조건에 맞는 원두가 없어요. 다른 검색어로 찾아보세요.
            </p>
          )}
        </>
      )}
      <dialog
        ref={dialog}
        className="quiet-bean-dialog"
        aria-labelledby="quiet-bean-title"
        onClose={() => opener.current?.focus()}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current.close();
        }}
      >
        <button
          type="button"
          className="quiet-close"
          onClick={() => dialog.current.close()}
        >
          닫기 ✕
        </button>
        {active && (
          <>
            <p className="quiet-muted">
              {product?.roastery} ·{" "}
              {status[active.availability] || status.unknown}
            </p>
            <h2 id="quiet-bean-title">{active.name}</h2>
            <p className="quiet-note-copy">
              {active.flavors?.join(" · ") ||
                "판매처에 컵노트가 기재되지 않았어요."}
            </p>
            <p>{price(active)}</p>
            <details className="quiet-details">
              <summary>산지와 가공 정보</summary>
              <dl className="quiet-facts">
                {active.specs?.map((s, i) => (
                  <div key={i}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </details>
            <a
              className="primary-button"
              href={product?.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              판매처에서 확인 ↗
            </a>
            <p className="quiet-muted">
              판매처의 설명이며, 내가 느낀 맛이나 소비 기록으로 저장하지 않아요.
            </p>
          </>
        )}
      </dialog>
    </PageShell>
  );
}
