import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Loading from "../../components/common/Loading.jsx";
import FirstCup from "../../components/coffee/FirstCup.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { adaptCoffeeLog } from "../../api/adapters.js";
import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { useApiResource } from "../../hooks/useApiResource.js";
import { useCompactLayout } from "../../hooks/useCompactLayout.js";
const Editor = lazy(
  () => import("../../components/coffee/MobileRecordEditor.jsx"),
);
const Music = lazy(
  () => import("../../components/coffee/CoffeeSoundtrack.jsx"),
);
function Entry({ row, onSaved }) {
  const [editing, setEditing] = useState(false),
    [musicOpen, setMusicOpen] = useState(false);
  return (
    <details className="mobile-journal-entry">
      <summary id={"mobile-record-" + row.id}>
        <small>{row.date}</small>
        <strong>
          {row.bean === "원두 미기록" ? "그날의 한 잔" : row.bean}
        </strong>
        <p>
          {row.brewDetails?.momentNote || row.memo || "남긴 감상이 없어요."}
        </p>
        <span className="mobile-expand-label">펼쳐보기</span>
      </summary>
      <div className="mobile-entry-body">
        {editing ? (
          <Suspense fallback={<p role="status">수정 도구를 준비해요…</p>}>
            <Editor
              id={row.id}
              onSaved={(updated) => {
                onSaved(updated);
                setEditing(false);
              }}
              onCancel={() => setEditing(false)}
            />
          </Suspense>
        ) : (
          <>
            <p className="mobile-entry-note">
              {row.brewDetails?.momentNote || row.memo || "남긴 감상이 없어요."}
            </p>
            <button
              type="button"
              className="ghost-button"
              onClick={() => setEditing(true)}
            >
              감상 수정
            </button>
          </>
        )}
        {row.brewDetails?.soundtrack && (
          <details
            className="mobile-music-choice"
            onToggle={(e) => setMusicOpen(e.currentTarget.open)}
          >
            <summary>♫ {row.brewDetails.soundtrack.track}</summary>
            {musicOpen && (
              <Suspense fallback={<p role="status">음악을 준비해요…</p>}>
                <Music
                  coffee={{ beanName: row.bean, brewDetails: row.brewDetails }}
                  readOnly
                />
              </Suspense>
            )}
          </details>
        )}
        <Link className="mobile-record-more" to={"/coffee/" + row.id}>
          추출 정보 · 전체 기록 →
        </Link>
      </div>
    </details>
  );
}
export default function CoffeeLogPage() {
  const compact = useCompactLayout(),
    [params] = useSearchParams();
  const [query, setQuery] = useState(""),
    [added, setAdded] = useState([]),
    [writer, setWriter] = useState(params.get("write") === "1"),
    [search, setSearch] = useState(false),
    [limit, setLimit] = useState(6),
    [notice, setNotice] = useState("");
  const initialized = useRef(false),
    composer = useRef(null);
  const { data: logs, loading } = useApiResource(
    () =>
      listDiaryRecords(coffeeApi.list).then((rows) => rows.map(adaptCoffeeLog)),
    [],
    [],
  );
  const rows = [
    ...added,
    ...logs.filter(
      (row) => !added.some((item) => String(item.id) === String(row.id)),
    ),
  ];
  const visible = rows
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
  useEffect(() => {
    if (compact && !loading && !initialized.current) {
      initialized.current = true;
      if (!rows.length) setWriter(true);
    }
  }, [compact, loading, rows.length]);
  function update(row) {
    setAdded((current) => [
      row,
      ...current.filter((item) => String(item.id) !== String(row.id)),
    ]);
    setNotice("기록을 저장했어요.");
    requestAnimationFrame(() => {
      const entry = document.getElementById("mobile-record-" + row.id);
      entry?.focus();
      entry?.scrollIntoView({ block: "nearest" });
    });
  }
  function openWriter() {
    setWriter(true);
    setNotice("");
    requestAnimationFrame(() =>
      composer.current?.scrollIntoView({ behavior: "auto", block: "nearest" }),
    );
  }
  return (
    <PageShell
      title={compact ? "기록" : "내 기록"}
      subtitle={
        compact
          ? undefined
          : "짧게 남긴 한 줄에서, 그날의 한 잔을 다시 떠올려요."
      }
    >
      {loading ? (
        <Loading title="나의 기록을 펼치고 있어요." />
      ) : (
        <>
          {compact ? (
            <div className="mobile-journal-home">
              {!writer && (
                <button
                  className="primary-button mobile-new-cup"
                  type="button"
                  onClick={openWriter}
                >
                  + 한 잔 남기기
                </button>
              )}
              {writer && (
                <section ref={composer} className="mobile-composer">
                  <div className="mobile-composer-top">
                    <span>새 기록</span>
                    {rows.length > 0 && (
                      <button type="button" onClick={() => setWriter(false)}>
                        접기
                      </button>
                    )}
                  </div>
                  <FirstCup
                    onSaved={(row) => {
                      update(adaptCoffeeLog(row));
                      setWriter(false);
                    }}
                  />
                </section>
              )}
              {notice && (
                <p role="status" className="mobile-form-status">
                  {notice}
                </p>
              )}
              {rows.length > 0 && (
                <div className="mobile-record-tools">
                  <strong>남긴 한 잔 {rows.length}</strong>
                  <button
                    type="button"
                    aria-expanded={search}
                    onClick={() => {
                      setSearch(!search);
                      setQuery("");
                      setLimit(6);
                    }}
                  >
                    기록 찾기
                  </button>
                </div>
              )}
              {search && (
                <label className="simple-record-search">
                  기록 찾기
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setLimit(6);
                    }}
                    placeholder="원두 이름이나 남긴 느낌"
                  />
                </label>
              )}
              <div className="mobile-journal-list">
                {visible.slice(0, limit).map((row) => (
                  <Entry key={row.id} row={row} onSaved={update} />
                ))}
              </div>
              {visible.length > limit && (
                <button
                  type="button"
                  className="ghost-button mobile-load-more"
                  onClick={() => setLimit((n) => n + 6)}
                >
                  기록 더 보기
                </button>
              )}
              {query && !visible.length && (
                <p className="simple-empty">
                  맞는 기록이 없어요. 다른 말로 찾아보세요.
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="simple-section-title">
                <p>{rows.length}개의 한 잔</p>
                <Link className="primary-button" to="/dashboard">
                  새 한 잔 남기기
                </Link>
              </div>
              {rows.length > 0 && (
                <label className="simple-record-search">
                  기록 찾기
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
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
        </>
      )}
    </PageShell>
  );
}
