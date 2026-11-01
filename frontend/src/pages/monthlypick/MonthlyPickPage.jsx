import { Fragment } from "react";
import {monthlyGroups,colorFamilies} from "../../utils/monthlyColors.js";
import {filterMonthlyBeans,groupMonthlyBeans} from "../../utils/monthlyFilters.js";
import "../../styles/monthly-filters.css";
import "../../styles/monthly-library.css";
import "../../styles/monthly-polish.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Loading from "../../components/common/Loading.jsx";
import BeanArtwork from "../../components/beans/BeanArtwork.jsx";
import { monthlyCatalog, importMonthlyUrl } from "../../api/monthlyCatalog.js";
import { catalogAvailability } from "../../utils/catalogAvailability.js";
import { currentMonthlyCatalog } from "../../utils/currentMonthlyCatalog.js";
import {
  readMonthlyFavorites,
  saveMonthlyFavorite,
  toggleMonthlyComparison,
} from "../../utils/monthlyPreferences.js";
const editions = [
  ["regular", "월픽"],
  ["global", "글로벌 월픽"],
  ["small", "스몰 월픽"],
];
const stateLabel = {
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
          (p) => String(p.label || "용량 미확인").replace(/(\d)\s*(kg|g|ml|mL)\b/g, "$1 $2") + " · " + Number(p.price).toLocaleString("ko-KR") + "원",
        )
        .join(" · ")
    : "판매처에서 가격 확인";
const displayDate = (value) =>
  value ? new Date(value).toLocaleDateString("ko-KR") : "확인 전";
export default function MonthlyPickPage() {
  const [catalog, setCatalog] = useState([]),
    [filtersExpanded, setFiltersExpanded] = useState(false),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [series, setSeries] = useState(""),
    [query, setQuery] = useState(""),
    [available, setAvailable] = useState(false),
    [category,setCategory]=useState("all"),
    [color,setColor]=useState("all"),
    [hideDecaf,setHideDecaf]=useState(false),
    [favoritesOnly, setFavoritesOnly] = useState(false),
    [selected, setSelected] = useState([]),
    [active, setActive] = useState(null),
    [message, setMessage] = useState(""),
    [url, setUrl] = useState(""),
    [importing, setImporting] = useState(false);
  const [initialFavorites] = useState(() => {
    try {
      return { ids: readMonthlyFavorites(localStorage), error: "" };
    } catch {
      return {
        ids: [],
        error: "관심 원두 목록을 읽지 못했어요. 기존 자료를 변경하지 않습니다.",
      };
    }
  });
  const [favorites, setFavorites] = useState(initialFavorites.ids),
    [favoriteError, setFavoriteError] = useState(initialFavorites.error);
  const detailDialog = useRef(null),
    compareDialog = useRef(null),
    detailOpener = useRef(null),
    compareOpener = useRef(null);
  useEffect(() => {
    let live = true;
    monthlyCatalog()
      .then((rows) => {
        if (live) {
          setCatalog(rows);
          const current = currentMonthlyCatalog(rows);
          const first = current.find((p) => p.edition === "regular") || current[0];
          setSeries(first?.sourceUrl || "");
          setUrl(first?.sourceUrl || "");
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
  const currentCatalog = currentMonthlyCatalog(catalog);
  const product = currentCatalog.find((p) => p.sourceUrl === series) || currentCatalog[0];
  const allBeans = catalog.flatMap((owner) =>
    owner.items.map((bean) => ({ ...bean, owner })),
  );
  const candidates = favoritesOnly
    ? allBeans.filter((b) => favorites.includes(String(b.id)))
    : allBeans.filter((b) => b.owner.sourceUrl === product?.sourceUrl);
  const beans=filterMonthlyBeans(candidates,{query,category,color,available,hideDecaf});
  const grouped=groupMonthlyBeans(beans);
  function clearFilters(){setQuery("");setCategory("all");setColor("all");setAvailable(false);setHideDecaf(false);setFavoritesOnly(false);}
  const compared = allBeans.filter((b) => selected.includes(String(b.id)));
  function choose(p) {
    if (!p || !currentMonthlyCatalog([p]).length) return;
    setSeries(p.sourceUrl);
    setUrl(p.sourceUrl);
    clearFilters();
  }
  function favorite(id) {
    try {
      const next = saveMonthlyFavorite(localStorage, favorites, id);
      setFavorites(next);
      setFavoriteError("");
    } catch {
      setFavoriteError(
        "관심 원두를 저장하지 못했어요. 기존 자료를 유지합니다. 저장 공간과 자료 상태를 확인해 주세요.",
      );
    }
  }
  function compare(id) {
    try {
      setSelected(toggleMonthlyComparison(selected, id));
      setMessage("");
    } catch (e) {
      setMessage(e.message);
    }
  }
  function openDetail(bean, event) {
    detailOpener.current = event.currentTarget;
    setActive(bean);
    detailDialog.current.showModal();
  }
  function openCompare(event) {
    compareOpener.current = event.currentTarget;
    compareDialog.current.showModal();
  }
  async function refresh(event) {
    event.preventDefault();
    if (importing) return;
    setImporting(true);
    setError("");
    setMessage("");
    try {
      const fresh = await importMonthlyUrl(url, catalog);
      setCatalog((rows) => [
        ...rows.filter((p) => p.sourceUrl !== fresh.sourceUrl),
        fresh,
      ]);
      choose(fresh);
      setMessage(
        !currentMonthlyCatalog([fresh]).length
          ? "자료를 확인했지만 현재 판매 기간이 아니어서 월픽 선택에는 표시하지 않아요. 저장한 관심 원두는 유지됩니다."
          : fresh.roastery +
          " 원두 " +
          fresh.items.length +
          "종의 자료를 확인했어요.",
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setImporting(false);
    }
  }
  return (
    <PageShell
      title={`${new Intl.DateTimeFormat("ko-KR", {timeZone:"Asia/Seoul",month:"long"}).format(new Date())} 월픽`}
      subtitle="이달의 로스터리와 다음 한 잔을 골라보세요."
    >
      {loading ? (
        <Loading title="월픽 원두를 살펴보고 있어요." />
      ) : (
        <>
          <div className="monthly-library">
          <aside className="monthly-library-filters" aria-label="월픽 검색과 필터" data-expanded={filtersExpanded}>
          <div className="monthly-core-toolbar">
            <label className="monthly-core-search">
              원두 검색
              <input
                type="search"
                placeholder="원두 이름, 산지, 컵노트"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <button
              type="button"
              className="ghost-button"
              aria-pressed={favoritesOnly}
              onClick={() => {
                setFavoritesOnly((v) => !v);
                setQuery("");
              }}
            >
              관심 원두{" "}
              {allBeans.filter((b) => favorites.includes(String(b.id))).length}
            </button>
          </div>
          <button type="button" className="ghost-button monthly-filter-toggle" aria-expanded={filtersExpanded} aria-controls="monthly-library-filter-panel" onClick={() => setFiltersExpanded(value => !value)}>필터 {filtersExpanded ? "접기" : "펼치기"} · {beans.length}종</button>
          <section id="monthly-library-filter-panel" className="monthly-restored-filters" aria-label="월픽 원두 필터">
            <fieldset><legend>원두 분류</legend><div className="monthly-filter-chips">
              {[["all","전체"],...Object.entries(monthlyGroups).map(([key,value])=>[key,value.label])].map(([key,label])=><button key={key} type="button" aria-pressed={category===key} onClick={()=>setCategory(key)}><span className="monthly-filter-check" aria-hidden="true">{category===key?"✓":""}</span>{label} <small>{key==='all'?candidates.length:candidates.filter(bean=>bean.category===key).length}종</small></button>)}
            </div></fieldset>
            <fieldset><legend>판매처 향미 색상</legend><div className="monthly-filter-chips">
              <button type="button" aria-pressed={color==='all'} onClick={()=>setColor('all')}><span className="monthly-filter-check" aria-hidden="true">{color==='all'?"✓":""}</span>모든 색</button>
              {colorFamilies.map(([key,label,hex])=><button key={key} type="button" aria-pressed={color===key} onClick={()=>setColor(key)}><span className="monthly-filter-check" aria-hidden="true">{color===key?"✓":""}</span><i aria-hidden="true" style={{backgroundColor:hex}}/>{label}</button>)}
            </div></fieldset>
            <div className="monthly-filter-options">
              <label><input type="checkbox" checked={available} onChange={e=>setAvailable(e.target.checked)}/>구매 가능만</label>
              <label><input type="checkbox" checked={hideDecaf} onChange={e=>setHideDecaf(e.target.checked)}/>디카페인 숨기기</label>
              <button type="button" className="ghost-button" onClick={clearFilters}>필터 초기화</button>
            </div>
            <p className="monthly-filter-caption">색상은 판매처 원두 팔레트의 비슷한 색끼리 묶은 분류예요. 맛을 측정한 값은 아니며, 검색·분류·색상·판매 조건을 함께 적용합니다.</p>
            <p className="monthly-filter-results" role="status">조건에 맞는 원두 <strong>{beans.length}종</strong> / {candidates.length}종{favoritesOnly?' · 관심 원두에서 찾는 중':''}</p>
          </section>
          </aside>
          <div className="monthly-library-results">
          <div
            className="monthly-editions"
            style={{gridTemplateColumns: `repeat(${Math.max(1, editions.filter(([key]) => currentCatalog.some(p => p.edition === key)).length)}, minmax(0, 1fr))`}}
            role="group"
            aria-label="월픽 시리즈"
          >
            {editions.filter(([key]) => currentCatalog.some(row => row.edition === key)).map(([key, label]) => {
              const p = currentCatalog.find((row) => row.edition === key);
              return (
                <button
                  key={key}
                  type="button"
                  disabled={!p}
                  aria-pressed={!favoritesOnly && p?.sourceUrl === product?.sourceUrl}
                  onClick={() => choose(p)}
                >
                  <strong>{label}</strong>
                  <small>
                    {p ? p.roastery + " · " + p.items.length + "종" : "준비 중"}
                  </small>
                </button>
              );
            })}
          </div>
          {!currentCatalog.length && <p role="status">현재 선택할 수 있는 월픽이 없어요. 판매 기간이 확인되면 표시됩니다. 저장한 관심 원두는 계속 확인할 수 있어요.</p>}
          {product && (
            <div className="quiet-source">
              <h2>
                {favoritesOnly
                  ? "모든 시리즈의 관심 원두"
                  : product.month + " · " + product.roastery}{" "}
                · {beans.length}종
              </h2>
              {!favoritesOnly && (
                <a href={product.sourceUrl} target="_blank" rel="noreferrer">
                  판매처 원문 ↗
                </a>
              )}
              <small>
                {!favoritesOnly &&
                  product.saleStart &&
                  "판매 기간 " +
                    product.saleStart +
                    " ~ " +
                    product.saleEnd +
                    " · "}
                가격 · 재고는 확인 후 달라질 수 있어요.{" "}
                {!favoritesOnly &&
                  "원문 확인 " + displayDate(product.sourceCheckedAt)}
              </small>
            </div>
          )}
          {favoriteError && (
            <p role="alert" className="resource-error">
              {favoriteError}
            </p>
          )}
          {message && <p role="status">{message}</p>}
          <div className="quiet-bean-grid">
            {grouped.map(({key,group,items})=><Fragment key={key||'unknown'}>
              <div className="monthly-section-heading" style={{"--group-color":group.color,"--group-tint":group.tint}}><h2>{group.label}</h2><span>{items.length}종</span></div>
              {items.map((bean) => (
              <article className="monthly-bean-card" style={{"--group-color":group.color,"--group-tint":group.tint}} key={bean.id}>
                <div className="monthly-card-art">
                  <BeanArtwork item={bean} />
                </div>
                <div className="monthly-bean-copy">
                  <button
                    type="button"
                    className="monthly-bean-open"
                    onClick={(e) => openDetail(bean, e)}
                  >
                    <small>
                      {stateLabel[catalogAvailability(bean.owner, bean)] ||
                        stateLabel.unknown}{" "}
                      · {bean.owner.roastery}
                    </small>
                    <span className="monthly-category-label">{group.label}</span>
                    <h3>{bean.name.replace(/\s*\(언스페셜티 블렌드\)\s*$/, "")}</h3>
                    <p className="monthly-note-list">
                      {bean.flavors?.length ? bean.flavors.map((note,index)=><span className="monthly-note" key={index}>{note}{index < bean.flavors.length-1 && <span aria-hidden="true"> · </span>}</span>) : "컵노트는 판매처에서 확인"}
                    </p>
                    <span className="monthly-price">{price(bean)}</span>
                    <b>원두 설명 보기 →</b>
                  </button>
                  <div className="monthly-bean-actions">
                    <button
                      type="button"
                      aria-pressed={favorites.includes(String(bean.id))}
                      onClick={() => favorite(bean.id)}
                      aria-label={bean.name + " 관심 저장"}
                    >
                      {favorites.includes(String(bean.id))
                        ? "♥ 관심 저장됨"
                        : "♡ 관심 저장"}
                    </button>
                    <button
                      type="button"
                      aria-pressed={selected.includes(String(bean.id))}
                      onClick={() => compare(bean.id)}
                      aria-label={bean.name + " 비교 선택"}
                    >
                      {selected.includes(String(bean.id))
                        ? "✓ 비교 선택됨"
                        : "+ 비교 선택"}
                    </button>
                  </div>
                </div>
              </article>
            ))}</Fragment>)}
          </div>
          {!beans.length && (
            <p className="simple-empty">
              {favoritesOnly
                ? "이 조건의 관심 원두가 없어요. 원두 카드에서 관심 저장을 눌러보세요."
                : "맞는 원두가 없어요. 검색어·분류·색상 조건을 바꾸거나 필터를 초기화해 보세요."}
            </p>
          )}
          {compared.length > 0 && (
            <div className="monthly-compare-bar">
              <span>{compared.length}/3개 선택</span>
              <button
                type="button"
                className="primary-button"
                disabled={compared.length < 2}
                onClick={openCompare}
              >
                선택 원두 비교
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setSelected([])}
              >
                비우기
              </button>
            </div>
          )}
          <p className="monthly-local-note">
            관심 원두는 이 브라우저에 저장됩니다.
          </p>
          <details className="quiet-details monthly-source-tools">
            <summary>월픽 자료 가져오기 · 나의 월픽 노트</summary>
            <p>
              언스페셜티 월픽 링크로 연결된 원두 설명을 갱신할 수 있어요. 기존에
              직접 만든 월픽 노트도 그대로 남아 있습니다.
            </p>
            <form onSubmit={refresh}>
              <label>
                월픽 상품 링크
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://unspecialty.com/product/detail.html?product_no=..."
                />
              </label>
              <button
                type="submit"
                className="ghost-button"
                disabled={importing}
              >
                {importing ? "자료 확인 중…" : "링크 자료 가져오기"}
              </button>
            </form>
            <Link to="/archive/monthly">나의 월픽 노트 · 상세 자료 관리 →</Link>
          </details>
          </div>
          </div>
        </>
      )}
      {error && (
        <p role="alert" className="resource-error">
          {error}
        </p>
      )}
      <dialog
        ref={detailDialog}
        className="quiet-bean-dialog"
        aria-labelledby="monthly-core-detail"
        onClose={() => detailOpener.current?.focus()}
        onClick={(e) => {
          if (e.target === e.currentTarget) detailDialog.current.close();
        }}
      >
        <button
          type="button"
          className="quiet-close"
          onClick={() => detailDialog.current.close()}
        >
          닫기 ✕
        </button>
        {active && (
          <>
            <p className="quiet-muted">
              {active.owner.roastery} ·{" "}
              {stateLabel[catalogAvailability(active.owner, active)]}
            </p>
            <h2 id="monthly-core-detail">{active.name}</h2>
            {favoriteError && (
              <p role="alert" className="resource-error">
                {favoriteError}
              </p>
            )}
            <p className="quiet-note-copy">
              {active.flavors?.join(" · ") ||
                "컵노트는 원문에서 확인해 주세요."}
            </p>
            <p>{price(active)}</p>
            <dl className="quiet-facts">
              {active.specs?.map((s, i) => (
                <div key={i}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
            {active.gauges?.length > 0 && (
              <details className="quiet-details">
                <summary>판매처 향미 지표</summary>
                <p>판매처 기준이며 내가 느낀 맛과 구분합니다.</p>
                <dl className="quiet-facts">
                  {active.gauges.map((g, i) => (
                    <div key={i}>
                      <dt>{g.label}</dt>
                      <dd>{g.value} / 5</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}
            <div className="action-row">
              <button
                className="ghost-button"
                type="button"
                onClick={() => favorite(active.id)}
              >
                {favorites.includes(String(active.id))
                  ? "관심 저장됨"
                  : "관심 원두로 저장"}
              </button>
              <a
                className="primary-button"
                href={active.owner.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                판매처 원문 ↗
              </a>
            </div>
          </>
        )}
      </dialog>
      <dialog
        ref={compareDialog}
        className="monthly-compare-dialog"
        aria-labelledby="monthly-compare-title"
        onClose={() => compareOpener.current?.focus()}
      >
        <button
          type="button"
          className="quiet-close"
          onClick={() => compareDialog.current.close()}
        >
          비교 닫기 ✕
        </button>
        <h2 id="monthly-compare-title">선택한 원두 비교</h2>
        <p>모바일에서는 표를 좌우로 밀어 볼 수 있어요.</p>
        <div
          className="monthly-compare-scroll"
          role="region"
          aria-label="원두 비교표"
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th scope="col">항목</th>
                {compared.map((b) => (
                  <th scope="col" key={b.id}>
                    {b.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["로스터리", (b) => b.owner.roastery],
                ["컵노트", (b) => b.flavors?.join(" · ") || "미기재"],
                ["가공", (b) => b.process || "미기재"],
                ["품종", (b) => b.variety || "미기재"],
                ["로스팅", (b) => b.roast || "미기재"],
                ["가격", price],
                [
                  "판매 상태",
                  (b) => stateLabel[catalogAvailability(b.owner, b)],
                ],
              ].map(([label, value]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {compared.map((b) => (
                    <td key={b.id}>{value(b)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </dialog>
    </PageShell>
  );
}
