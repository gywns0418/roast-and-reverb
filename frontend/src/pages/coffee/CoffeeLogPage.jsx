import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Loading from "../../components/common/Loading.jsx";
import JournalNextSteps from "../../components/common/JournalNextSteps.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { adaptCoffeeLog } from "../../api/adapters.js";
import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { useApiResource } from "../../hooks/useApiResource.js";
import ResonanceAura from "../../components/visual/ResonanceAura.jsx";
import { useCupPalette } from "../../hooks/useCupPalette.js";
import { cupPalette } from "../../utils/cupColor.js";
import { useLiveCups } from "../../utils/ripple.js";
import { usePhone } from "../../hooks/usePhone.js";
import RecordSheet from "../../components/mobile/RecordSheet.jsx";
import { verdicts, verdictOf } from "../../utils/tasteProfile.js";
export default function CoffeeLogPage() {
  const palette = useCupPalette();
  // Phones show the same journal as the desktop, in one column.
  const [query, setQuery] = useState("");
  const phone = usePhone();
  const [sheet, setSheet] = useState({ row: null, open: false, focus: "" }), [updates, setUpdates] = useState({});
  const { data: logs, loading } = useApiResource(
    () =>
      listDiaryRecords(coffeeApi.list).then((rows) => rows.map(adaptCoffeeLog)),
    [],
    [],
  );
  const rows = useLiveCups(logs).map((row) => updates[String(row.id)] || row);
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
  // Phones: tap a cup to read it in a sheet; slide it left to jump straight to
  // the verdict. The full record page stays one tap away inside the sheet.
  const drag = useRef(null);
  function swipeable(row) {
    return {
      onClick: (e) => { if (e.currentTarget.dataset.swiped) { delete e.currentTarget.dataset.swiped; e.preventDefault(); return; } e.preventDefault(); setSheet({ row, open: true, focus: "" }); },
      onPointerDown: (e) => { drag.current = { x: e.clientX, y: e.clientY, el: e.currentTarget }; },
      onPointerMove: (e) => { const d = drag.current; if (!d) return; const dx = Math.min(0, e.clientX - d.x); if (Math.abs(e.clientY - d.y) < 24) d.el.style.transform = `translateX(${Math.max(-72, dx)}px)`; },
      onPointerUp: (e) => {
        const d = drag.current; drag.current = null; if (!d) return;
        d.el.style.transform = "";
        if (d.x - e.clientX > 56 && Math.abs(e.clientY - d.y) < 40) { d.el.dataset.swiped = "1"; setSheet({ row, open: true, focus: "verdict" }); }
      },
      onPointerCancel: () => { if (drag.current) drag.current.el.style.transform = ""; drag.current = null; },
    };
  }
  return (
    <PageShell
      title="내 기록"
      subtitle="좋았던 맛을 다시 읽고, 다음에 마실 커피의 힌트를 찾아보세요."
    >
      {loading ? (
        <Loading title="나의 기록을 펼치고 있어요." />
      ) : (
        <>
          <>
              <div className="journal-overview" aria-label="내 커피 기록 요약">
                <div><span>남긴 한 잔</span><strong>{rows.length}<small>잔</small></strong></div>
                <div><span>음악을 더한 기록</span><strong>{rows.filter(row => row.brewDetails?.soundtrack).length}<small>잔</small></strong></div>
                <div><span>가장 최근 기록</span><strong className="journal-last-date">{[...rows].sort((a,b)=>b.date.localeCompare(a.date))[0]?.date || "첫 한 잔을 기다려요"}</strong></div>
              </div>
              <div className="simple-section-title">
                <h2 className="journal-list-title">나의 커피 일지</h2>
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
                  <Link key={row.id} to={"/coffee/" + row.id} {...(phone ? swipeable(row) : {})}>
                    <ResonanceAura className="record-cup-art" seedKey={row.bean} rings={4} colors={cupPalette(row, palette)} />
                    <small>{row.date}</small>
                    <h2>{row.bean}</h2>
                    <p>{row.memo || "이날의 한 잔 다시 보기"}</p>
                    <em className="record-verdict">{verdicts.find((v) => v.key === verdictOf(row))?.short || "판단 전"}</em>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
              {!rows.length && !query && (
                <section className="quiet-section journal-desktop-empty">
                  <ResonanceAura className="journal-empty-aura" seedKey="empty" />
                  <h2>아직 기록이 없어요.</h2>
                  <p>“다시 마시고 싶어”라는 느낌부터 남겨보세요. 원두 이름을 몰라도 내 말로 적은 맛을 다시 찾을 수 있어요.</p>
                  <Link className="primary-button" to="/dashboard">오늘 기록하기 →</Link>
                </section>
              )}
              <JournalNextSteps omit="/dashboard" />
              {!visible.length && rows.length > 0 && (
                <p className="simple-empty">
                  {query
                    ? "찾는 기록이 없어요. 다른 말로 찾아보세요."
                    : "아직 남긴 한 잔이 없어요. 기억나는 느낌부터 적어볼까요?"}
                </p>
              )}
          </>
        </>
      )}
      <RecordSheet row={sheet.row} open={sheet.open} focus={sheet.focus} colors={sheet.row ? cupPalette(sheet.row, palette) : []}
        onClose={() => setSheet((s) => ({ ...s, open: false }))}
        onUpdated={(row) => { setUpdates((u) => ({ ...u, [String(row.id)]: row })); setSheet((s) => ({ ...s, row })); }} />
    </PageShell>
  );
}
