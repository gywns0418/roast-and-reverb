import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Bookmark,
  Check,
  ChevronRight,
  Link2,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import PageShell from "../../components/common/PageShell.jsx";
import { monthlyCatalog, importMonthlyUrl } from "../../api/monthlyCatalog.js";
import { monthlyPickApi } from "../../api/monthlyPickApi.js";

const groups = {
  "single origin": "싱글 오리진",
  "special single": "스페셜 오리진",
  blend: "하우스 블렌드",
  "unspecialty blend": "언스페셜티 블렌드",
  easy: "드립백",
};
const stateLabel = {
  available: "구매 가능",
  "sold-out": "품절",
  upcoming: "오픈 예정",
  unknown: "재고 미확인",
};
const money = (value) => Number(value).toLocaleString("ko-KR") + "원";
const dateLabel = (value) =>
  value
    ? new Date(value).toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "확인 전";
function BeanVisual({ item }) {
  const type = item.process.toLowerCase();
  const theme = type.includes("honey")
    ? "honey"
    : type.includes("natural")
      ? "natural"
      : "washed";
  const tone =
    [...item.name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 5;
  return (
    <div
      className={`bean-visual bean-${theme} bean-tone-${tone}`}
      aria-hidden="true"
    >
      <span>{item.origin || "BLEND"}</span>
      <div className="bean-orbit" />
      <div className="bean-object">
        <i />
      </div>
      <b>{item.name.match(/#\d+/)?.[0] || item.name.split(" ")[0]}</b>
      <small>{item.variety || "COFFEE SELECTION"}</small>
    </div>
  );
}
function BeanDialog({ item, close, source }) {
  const dialog = useRef(null);
  useEffect(() => {
    const active = document.activeElement;
    dialog.current?.showModal();
    return () => active?.focus();
  }, []);
  return (
    <dialog
      className="bean-dialog"
      ref={dialog}
      onCancel={close}
      aria-label={`${item.name} 원두 상세`}
    >
      <button
        className="dialog-close"
        type="button"
        aria-label="원두 상세 닫기"
        onClick={close}
      >
        <X size={22} />
      </button>
      <div className="bean-detail-layout">
        <BeanVisual item={item} />
        <div className="bean-detail-copy">
          <p className="eyebrow">
            {groups[item.category]} / {stateLabel[item.availability]}
          </p>
          <h2>{item.name}</h2>
          <p className="bean-english">{item.nameEnglish}</p>
          <div className="flavor-row">
            {item.flavors.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
          <dl>
            {item.specs.map((spec) => (
              <div key={spec.label}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
          <div className="vendor-gauges">
            <p>판매처 향미 지표 · 개인 평가와 별도</p>
            {item.gauges.map((gauge) => (
              <div key={gauge.label}>
                <span>{gauge.label}</span>
                <div>
                  <i
                    style={{
                      width: `${(Math.max(0, Math.min(5, gauge.value)) / 5) * 100}%`,
                    }}
                  />
                </div>
                <strong>{gauge.value}</strong>
              </div>
            ))}
          </div>
          <div className="bean-prices">
            {item.prices.map((price, index) => (
              <span key={index}>
                {price.label} <strong>{money(price.price)}</strong>
              </span>
            ))}
          </div>
          <a
            href={source}
            target="_blank"
            rel="noreferrer"
            className="primary-button"
          >
            판매처 원문 보기 <ArrowUpRight size={16} />
          </a>
          <p className="source-small">
            긴 원두 소개와 상세 레시피는 판매처 원문에서 확인하세요. 가격·재고는
            확인 시점 이후 달라질 수 있습니다.
          </p>
        </div>
      </div>
    </dialog>
  );
}
export default function MonthlyPickPage() {
  const [catalog, setCatalog] = useState([]),
    [product, setProduct] = useState(null),
    [url, setUrl] = useState(
      "https://unspecialty.com/product/detail.html?product_no=901",
    );
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("all"),
    [availableOnly, setAvailableOnly] = useState(false),
    [hideDecaf, setHideDecaf] = useState(false),
    [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState([]),
    [active, setActive] = useState(null),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("rr-monthly-favorites-v1") || "[]",
      );
    } catch {
      return [];
    }
  });
  const [ownPicks, setOwnPicks] = useState([]),
    [ownDetail, setOwnDetail] = useState(null);
  const [showManual, setShowManual] = useState(false),
    [manual, setManual] = useState({
      month: "",
      roastery: "",
      rawOptionsText: "",
      sourceUrl: "",
    });
  useEffect(() => {
    monthlyCatalog()
      .then((items) => {
        setCatalog(items);
        setProduct(items[0] || null);
        if (items[0]) setUrl(items[0].sourceUrl);
      })
      .catch((err) => setError(err.message));
  }, []);
  useEffect(() => {
    monthlyPickApi
      .list()
      .then((items) => setOwnPicks(items || []))
      .catch((err) => setError(err.message));
  }, []);
  const beans = product?.items || [];
  const visible = useMemo(
    () =>
      beans.filter(
        (item) =>
          (category === "all" || item.category === category) &&
          (!availableOnly || item.availability === "available") &&
          (!hideDecaf || !item.decaf) &&
          (!favoritesOnly || favorites.includes(item.id)) &&
          [
            item.name,
            item.nameEnglish,
            item.process,
            item.origin,
            ...item.flavors,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [
      beans,
      category,
      availableOnly,
      hideDecaf,
      favoritesOnly,
      favorites,
      query,
    ],
  );
  const compared = beans.filter((item) => selected.includes(item.id));
  function toggleFavorite(id) {
    const next = favorites.includes(id)
      ? favorites.filter((value) => value !== id)
      : [...favorites, id];
    setFavorites(next);
    localStorage.setItem("rr-monthly-favorites-v1", JSON.stringify(next));
  }
  function toggleCompare(id) {
    if (selected.includes(id))
      setSelected(selected.filter((value) => value !== id));
    else if (selected.length < 3) setSelected([...selected, id]);
    else setMessage("원두는 최대 3개까지 비교할 수 있어요.");
  }
  async function importUrl(event) {
    event?.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const fresh = await importMonthlyUrl(url, catalog);
      setProduct(fresh);
      setSelected([]);
      setMessage(
        `${fresh.items.length}개 원두의 향미·원산지·가격 자료를 가져왔어요.`,
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function saveManual(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const created = await monthlyPickApi.create(manual);
      setOwnPicks([created, ...ownPicks]);
      setOwnDetail(created);
      setShowManual(false);
      setMessage("내 월픽 기록에 저장했어요.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <PageShell
      title="이번 달, 어떤 커피?"
      eyebrow="THE MONTHLY EDIT"
      subtitle="새로운 원두를 발견하고, 향미를 비교하고, 다음 한 잔을 골라보세요."
    >
      <div className="monthly-editorial">
        <div>
          <span className="edition-label">
            {product?.month?.replace("-", ".") || "MONTHLY"} / COFFEE SELECTION
          </span>
          <h2>
            {product?.roastery || "이달의 로스터리"}
            <br />
            <em>다음 한 잔의 발견.</em>
          </h2>
          <p>
            원두 이름만 보고 고르지 않도록.
            <br />
            컵노트부터 가공 방식까지, 한곳에서 살펴보세요.
          </p>
          <button
            type="button"
            onClick={() =>
              document.getElementById("monthly-beans")?.scrollIntoView()
            }
            className="monthly-jump"
          >
            원두 컬렉션 둘러보기 <ArrowRight size={19} />
          </button>
          <div className="edition-stats">
            <span>
              <b>{beans.length}</b> 원두
            </span>
            <span>
              <b>
                {new Set(beans.map((item) => item.origin).filter(Boolean)).size}
              </b>{" "}
              산지
            </span>
            <span>FROM UNSPECIALTY ↗</span>
          </div>
        </div>
        <div className="monthly-still">
          <img
            src={`${import.meta.env.BASE_URL}images/ritual-editorial.png`}
            alt="햇살 아래 커피와 레코드, 헤드폰이 놓인 장면"
          />
          <span>NEW COFFEE. SAME GOOD RITUAL.</span>
        </div>
      </div>
      <section className="url-import">
        <div>
          <Link2 size={20} />
          <div>
            <h3>링크 하나로, 새로운 월픽.</h3>
            <p>언스페셜티 상품 링크에서 원두 정보를 가져옵니다.</p>
          </div>
        </div>
        <form onSubmit={importUrl}>
          <input
            type="url"
            required
            aria-label="월픽 상품 링크"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://unspecialty.com/product/detail.html?product_no=…"
          />
          <button className="primary-button" disabled={busy}>
            {busy ? (
              <RefreshCw className="spin" size={16} />
            ) : (
              <ArrowUpRight size={16} />
            )}{" "}
            {busy ? "자료 읽는 중" : "링크 가져오기"}
          </button>
        </form>
      </section>
      {error && (
        <p role="alert" className="source-error">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="source-success">
          {message}
        </p>
      )}
      <div className="monthly-source-line">
        <span>
          상품페이지 확인 {dateLabel(product?.sourceCheckedAt)}
          {product?.detailsCheckedAt &&
            ` · 원두자료 갱신 ${dateLabel(product.detailsCheckedAt)}`}
        </span>
        <a href={product?.sourceUrl || url} target="_blank" rel="noreferrer">
          출처 보기 <ArrowUpRight size={13} />
        </a>
      </div>
      {catalog.length > 1 && (
        <div className="monthly-history">
          {catalog.map((item) => (
            <button
              className={
                item.sourceUrl === product?.sourceUrl
                  ? "primary-button"
                  : "ghost-button"
              }
              key={item.sourceUrl}
              onClick={() => {
                setProduct(item);
                setUrl(item.sourceUrl);
                setSelected([]);
              }}
            >
              {item.month} · {item.roastery}
            </button>
          ))}
        </div>
      )}
      <div className="monthly-section-heading" id="monthly-beans">
        <div>
          <p className="eyebrow">FIND YOUR NEXT FAVORITE</p>
          <h2>
            이달의 원두 컬렉션 <span>{visible.length}</span>
          </h2>
        </div>
        <button
          className={favoritesOnly ? "saved-filter active" : "saved-filter"}
          onClick={() => setFavoritesOnly(!favoritesOnly)}
        >
          <Bookmark size={17} /> 관심 원두 <small>이 기기</small>
        </button>
      </div>
      <div className="monthly-categories">
        {[["all", "전체"], ...Object.entries(groups)].map(([key, label]) => (
          <button
            className={category === key ? "active" : ""}
            key={key}
            onClick={() => setCategory(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="monthly-filters">
        <label className="monthly-search">
          <Search size={18} />
          <input
            aria-label="월픽 원두 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="원두, 산지, 컵노트 검색"
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(event) => setAvailableOnly(event.target.checked)}
          />{" "}
          구매 가능만
        </label>
        <label>
          <input
            type="checkbox"
            checked={hideDecaf}
            onChange={(event) => setHideDecaf(event.target.checked)}
          />{" "}
          디카페인 숨기기
        </label>
      </div>
      <div className="monthly-bean-grid">
        {visible.map((item) => (
          <article
            className={`monthly-bean ${item.availability === "sold-out" ? "is-sold-out" : ""}`}
            key={item.id}
          >
            <div className="bean-top">
              <button
                className="bean-open"
                onClick={() => setActive(item)}
                aria-label={`${item.name} 상세 보기`}
              >
                <BeanVisual item={item} />
              </button>
              <button
                className={`bean-save ${favorites.includes(item.id) ? "active" : ""}`}
                aria-label={`${item.name} 관심 원두 ${favorites.includes(item.id) ? "해제" : "저장"}`}
                onClick={() => toggleFavorite(item.id)}
              >
                <Bookmark
                  size={18}
                  fill={favorites.includes(item.id) ? "currentColor" : "none"}
                />
              </button>
              <span className={`availability ${item.availability}`}>
                {stateLabel[item.availability]}
              </span>
            </div>
            <div className="bean-card-copy">
              <p className="bean-category">{groups[item.category]}</p>
              <button className="bean-title" onClick={() => setActive(item)}>
                {item.name}
              </button>
              <div className="flavor-row">
                {item.flavors.slice(0, 4).map((note) => (
                  <span key={note}>{note}</span>
                ))}
              </div>
              <p className="bean-process">
                {item.process || item.roast || "판매처 상세 확인"}
              </p>
              <div className="bean-card-foot">
                <span>
                  {item.prices[0] ? (
                    <>
                      <small>{item.prices[0].label}</small>
                      <strong>{money(item.prices[0].price)}</strong>
                    </>
                  ) : (
                    "가격 미기재"
                  )}
                </span>
                <label>
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => toggleCompare(item.id)}
                  />{" "}
                  비교
                </label>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="monthly-empty">
          <Search size={30} />
          <h3>찾는 원두가 아직 없어요.</h3>
          <p>검색어와 필터를 조정해보세요.</p>
          <button type="button" className="ghost-button" onClick={() => { setQuery(""); setCategory("all"); setAvailableOnly(false); setHideDecaf(false); setFavoritesOnly(false); }}>필터 초기화</button>
        </div>
      )}
      {compared.length > 0 && (
        <section className="compare-panel">
          <div>
            <h3>다음 한 잔, 나란히 비교.</h3>
            <button className="ghost-button" onClick={() => setSelected([])}>
              비교 비우기
            </button>
          </div>
          <div className="compare-scroll">
            <table>
              <caption>
                선택한 원두 {compared.length}개 비교 · 판매처 정보
              </caption>
              <thead>
                <tr>
                  <th>원두</th>
                  {compared.map((item) => (
                    <th key={item.id}>{item.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["컵노트", (item) => item.flavors.join(" · ")],
                  ["가공 방식", (item) => item.process],
                  ["품종", (item) => item.variety],
                  ["로스팅", (item) => item.roast],
                  [
                    "가격·중량",
                    (item) =>
                      item.prices
                        .map((price) => `${price.label} ${money(price.price)}`)
                        .join(" / "),
                  ],
                  ["구매 상태", (item) => stateLabel[item.availability]],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <th>{label}</th>
                    {compared.map((item) => (
                      <td key={item.id}>{value(item) || "판매처 미기재"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <section className="monthly-bottom">
        <div>
          <p className="eyebrow">MAKE IT YOURS</p>
          <h3>발견한 원두를, 나의 한 잔으로.</h3>
          <p>판매처의 컵노트와 내가 느낀 맛을 기록하며 비교해보세요.</p>
        </div>
        <a href="#/coffee/write" className="primary-button">
          커피 기록 남기기 <ArrowUpRight size={17} />
        </a>
      </section>
      <details
        className="monthly-manual"
        open={showManual}
        onToggle={(event) => setShowManual(event.currentTarget.open)}
      >
        <summary>직접 월픽 목록 기록하기</summary>
        <form onSubmit={saveManual}>
          <div className="form-grid">
            <label className="input-field">
              월
              <input
                className="input"
                type="month"
                required
                value={manual.month}
                onChange={(event) =>
                  setManual({ ...manual, month: event.target.value })
                }
              />
            </label>
            <label className="input-field">
              로스터리
              <input
                className="input"
                required
                value={manual.roastery}
                onChange={(event) =>
                  setManual({ ...manual, roastery: event.target.value })
                }
              />
            </label>
          </div>
          <label className="input-field">
            원두 이름 · 한 줄에 하나씩
            <textarea
              className="textarea"
              required
              value={manual.rawOptionsText}
              onChange={(event) =>
                setManual({ ...manual, rawOptionsText: event.target.value })
              }
            />
          </label>
          <button className="primary-button" disabled={busy}>
            내 월픽 기록에 저장
          </button>
        </form>
      </details>
      {ownPicks.length > 0 && (
        <section className="own-pick-notes">
          <h3>내 월픽 노트</h3>
          <div className="monthly-history">
            {ownPicks.map((pick) => (
              <button
                key={pick.monthly_pick_id}
                className="ghost-button"
                onClick={() =>
                  monthlyPickApi
                    .detail(pick.monthly_pick_id)
                    .then(setOwnDetail)
                    .catch((err) => setError(err.message))
                }
              >
                {pick.pick_month} · {pick.roastery}
              </button>
            ))}
          </div>
          {ownDetail && (
            <div className="own-pick-options">
              {(ownDetail.options || []).map((option, index) => (
                <p key={option.option_id || index}>{option.raw_text}</p>
              ))}
            </div>
          )}
        </section>
      )}
      {active && (
        <BeanDialog
          item={active}
          source={product.sourceUrl}
          close={() => setActive(null)}
        />
      )}
    </PageShell>
  );
}
