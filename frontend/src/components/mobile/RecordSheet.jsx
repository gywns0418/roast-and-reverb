import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BottomSheet from "./BottomSheet.jsx";
import ResonanceAura from "../visual/ResonanceAura.jsx";
import { saveCoffeeVerdict } from "../../api/verdictApi.js";
import { verdicts, verdictOf } from "../../utils/tasteProfile.js";
import { readSoundtrack } from "../../utils/coffeeSoundtrack.js";
import { showToast } from "../../utils/ripple.js";

const MARK = { again: "♥", okay: "~", "not-mine": "×" };

// A saved cup on phones: read it in a sheet and change the verdict right there.
// Everything else (recipe, edit) stays on the full record page.
export default function RecordSheet({ row, open, focus, colors, onClose, onUpdated }) {
  const id = useId(), verdictRef = useRef(null);
  const [busy, setBusy] = useState(""), [error, setError] = useState("");
  useEffect(() => { setError(""); setBusy(""); }, [row?.id]);
  useEffect(() => {
    if (open && row && focus === "verdict") {
      const t = setTimeout(() => verdictRef.current?.querySelector('[aria-checked="true"], button')?.focus({ preventScroll: false }), 380);
      return () => clearTimeout(t);
    }
  }, [open, row, focus]);
  const current = row ? verdictOf(row) : "";
  const note = row ? (row.brewDetails?.momentNote || row.memo || "") : "";
  const song = row ? readSoundtrack(row.brewDetails?.soundtrack) : null;
  async function choose(key) {
    if (!row || busy) return;
    const next = current === key ? "" : key;
    setBusy(key);
    setError("");
    try {
      const updated = await saveCoffeeVerdict(row.id, next);
      onUpdated?.(updated);
      showToast(next ? `"${verdicts.find((v) => v.key === next).label}"로 바꿨어요.` : "판단을 지웠어요.");
    } catch (err) {
      setError(err.message || "판단을 저장하지 못했어요. 다시 눌러 주세요.");
    } finally {
      setBusy("");
    }
  }
  return (
    <BottomSheet open={open && !!row} onClose={onClose} labelledBy={id + "-title"} size="full" className="rr-record-sheet"
      footer={row && <>
        <button type="button" className="rr-btn rr-btn-ghost" onClick={onClose}>닫기</button>
        <Link className="rr-btn rr-btn-cta" to={"/coffee/" + row.id} onClick={onClose}>전체 기록 · 수정</Link>
      </>}>
      {row && <>
        <div className="rr-sheet-head"><h2 id={id + "-title"} tabIndex={-1} data-autofocus={focus === "verdict" ? undefined : true}>{row.bean === "원두 미기록" ? "이날의 한 잔" : row.bean}</h2></div>
        <div className="rr-sheet-body">
          <article className="rr-card">
            <div className="rr-card-art">
              <ResonanceAura className="rr-card-aura" colors={colors} rings={current === "again" ? 3 : current ? 2 : 0} seedKey={row.bean} />
              {song && <svg className="rr-card-wave" viewBox="0 0 56 16" width="56" height="16" aria-hidden="true"><path d="M2 8 Q 6 1 10 8 T 18 8 T 26 8 T 34 8 T 42 8 T 50 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
            </div>
            <div className="rr-card-body">
              <p className="rr-card-meta">{row.date || "날짜 미기록"}{row.roastery ? ` · ${row.roastery}` : ""}</p>
              <p className="rr-card-note">{note || "남긴 감상이 없어요."}</p>
              {song && <p className="rr-card-music"><span aria-hidden="true">♫</span> {song.track}{song.artist ? ` · ${song.artist}` : ""}</p>}
            </div>
          </article>
          <p className="rr-q rr-q-small">이 한 잔, 다시 마시고 싶나요?</p>
          <div className="rr-verdicts" role="radiogroup" aria-label="다시 마실지 판단" ref={verdictRef}>
            {verdicts.map((v) => (
              <button key={v.key} type="button" role="radio" aria-checked={current === v.key} className="rr-verdict rr-verdict-compact" disabled={!!busy} onClick={() => choose(v.key)}>
                <span className="rr-mark" aria-hidden="true">{MARK[v.key]}</span>
                <span>{busy === v.key ? "저장하는 중…" : v.label}</span>
              </button>
            ))}
          </div>
          <p className="rr-hint">{current ? "고른 판단을 다시 누르면 지워져요." : "아직 판단하지 않은 잔이에요."}</p>
          {error && <p className="rr-error" role="alert">{error}</p>}
        </div>
      </>}
    </BottomSheet>
  );
}
