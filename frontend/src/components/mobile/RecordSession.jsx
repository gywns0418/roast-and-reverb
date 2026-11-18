import { useEffect, useId, useRef, useState } from "react";
import BottomSheet from "./BottomSheet.jsx";
import ResonanceAura from "../visual/ResonanceAura.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { firstCupPayload } from "../../utils/firstCup.js";
import { matchedSoundtrack } from "../../utils/coffeeSoundtrack.js";
import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { familiesInText } from "../../utils/tasteQuery.js";
import { familyColors } from "../../utils/resonanceAura.js";
import { verdicts } from "../../utils/tasteProfile.js";
import { SESSION_OPEN, announceRemoved, announceSaved, blankCup, hasContent, readQuickDraft, showToast, writeQuickDraft } from "../../utils/ripple.js";

const STEPS = ["느낌", "원두", "판단", "음악"];
const TASTES = ["고소한", "달콤한", "산미", "쌉쌀한", "꽃향", "과일향", "초콜릿", "깔끔한"];
const MARK = { again: "♥", okay: "~", "not-mine": "×" };
const HINT = { again: "또 고르고 싶은 맛", okay: "나쁘지 않았지만 애매해요", "not-mine": "다음엔 다른 원두를 골라 볼래요" };
const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const colorsOf = (text) => familiesInText(text).map((k) => familyColors[k]).filter(Boolean);
const musicOf = (soundtrack) => ({ track: soundtrack?.track || "", artist: soundtrack?.artist || "", url: soundtrack?.url || "" });

// The phone's record session: four short steps in a bottom sheet, every change
// kept as a draft, then a preview card and save.
export default function RecordSession() {
  const [open, setOpen] = useState(false), [step, setStep] = useState(0);
  const [value, setValueState] = useState(() => readQuickDraft().value);
  const [music, setMusic] = useState(() => musicOf(readQuickDraft().value.soundtrack));
  const [draftError, setDraftError] = useState(""), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  const [beans, setBeans] = useState([]), [pulse, setPulse] = useState("");
  const latest = useRef(value), swipe = useRef(null), card = useRef(null);
  const id = useId(), titleId = id + "-title";

  useEffect(() => {
    const start = () => {
      const draft = readQuickDraft();
      latest.current = draft.value;
      setValueState(draft.value);
      setMusic(musicOf(draft.value.soundtrack));
      setDraftError(draft.error || "");
      setError("");
      setStep(draft.value.note.trim() ? (draft.value.verdict ? 3 : draft.value.beanName ? 2 : 1) : 0);
      setOpen(true);
      listDiaryRecords(coffeeApi.list)
        .then((rows) => setBeans([...new Set(rows.map((r) => r.beanName).filter((b) => b && b !== "원두 미기록"))].slice(0, 6)))
        .catch(() => setBeans([]));
    };
    window.addEventListener(SESSION_OPEN, start);
    return () => window.removeEventListener(SESSION_OPEN, start);
  }, []);

  // A new step moves focus to its question (read out by screen readers) without
  // popping the keyboard; only the first step focuses the text box on open.
  const body = useRef(null), firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    if (open) body.current?.querySelector(".rr-q, .rr-card")?.focus({ preventScroll: true });
  }, [step]);
  function update(patch) {
    const next = { ...latest.current, ...patch };
    latest.current = next;
    setValueState(next);
    if (draftError) return;
    try { writeQuickDraft(next); } catch { setDraftError("초안을 이 기기에 보관하지 못했어요. 화면의 내용은 그대로 있어요."); }
  }
  function setMusicField(field, text) {
    const next = { ...music, [field]: text };
    setMusic(next);
    let soundtrack = null;
    try { if (next.track.trim()) soundtrack = { ...matchedSoundtrack(next, "직접 입력"), listened: true }; } catch { soundtrack = null; }
    update({ soundtrack });
  }
  const noteOk = value.note.trim().length > 0 && value.note.length <= 2000;
  const go = (n) => { if (n > step && step === 0 && !noteOk) return; setStep(Math.max(0, Math.min(4, n))); setError(""); };
  function close() {
    setOpen(false);
    if (hasContent(latest.current)) showToast("초안을 보관했어요. ＋를 누르면 이어서 써요.");
  }
  function pickVerdict(key) {
    update({ verdict: latest.current.verdict === key ? "" : key });
    setPulse(key);
    setTimeout(() => setPulse(""), 420);
    if (latest.current.verdict) setTimeout(() => setStep(3), reduced() ? 0 : 260);
  }
  function toggleTaste(word) {
    const on = !latest.current.tastes.includes(word);
    const tastes = on ? [...latest.current.tastes, word] : latest.current.tastes.filter((t) => t !== word);
    const note = on && !latest.current.note.includes(word) ? (latest.current.note.trim() ? latest.current.note.trim() + " · " : "") + word : latest.current.note;
    update({ tastes, note });
  }
  async function save() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const payload = firstCupPayload(latest.current);
      const result = await coffeeApi.create(payload);
      const row = { ...payload, ...result };
      const savedId = result.coffeeLogId || result.coffee_log_id || result.id;
      flyToJournal(card.current);
      try { writeQuickDraft(blankCup()); } catch {}
      latest.current = blankCup();
      setValueState(blankCup());
      setMusic(musicOf(null));
      setOpen(false);
      announceSaved(row);
      showToast("기록에 담았어요 · 이 기기에만 저장", {
        label: "되돌리기",
        run: async () => {
          try { await coffeeApi.remove(savedId); announceRemoved(savedId); showToast("저장을 되돌렸어요."); }
          catch (err) { showToast(err.message || "되돌리지 못했어요. 내 기록에서 지워 주세요."); }
        },
      });
    } catch (err) {
      setError(err.message || "저장하지 못했어요. 초안은 그대로 남아 있어요.");
    } finally {
      setBusy(false);
    }
  }
  const swipeHandlers = {
    onPointerDown: (e) => { if (e.target.closest("textarea, input")) return; swipe.current = { x: e.clientX, y: e.clientY }; },
    onPointerUp: (e) => {
      if (!swipe.current) return;
      const dx = e.clientX - swipe.current.x, dy = Math.abs(e.clientY - swipe.current.y);
      swipe.current = null;
      if (Math.abs(dx) > 56 && dy < 40 && step < 4) go(step + (dx < 0 ? 1 : -1));
    },
  };

  const verdict = verdicts.find((v) => v.key === value.verdict);
  const title = step < 4 ? `${step + 1}/4 · ${STEPS[step]}` : "저장 전 미리보기";
  const footer = step === 0 ? (
    <button type="button" className="rr-btn rr-btn-cta" disabled={!noteOk} onClick={() => go(1)}>다음 · 원두</button>
  ) : step < 4 ? (
    <>
      <button type="button" className="rr-btn rr-btn-ghost" onClick={() => go(step - 1)}>이전</button>
      <button type="button" className="rr-btn rr-btn-cta" onClick={() => go(step + 1)}>
        {step === 1 ? (value.beanName.trim() ? "다음 · 판단" : "건너뛰기") : step === 2 ? (value.verdict ? "다음 · 음악" : "건너뛰기") : "카드 미리보기"}
      </button>
    </>
  ) : (
    <>
      <button type="button" className="rr-btn rr-btn-ghost" onClick={() => go(3)} disabled={busy}>고치기</button>
      <button type="button" className="rr-btn rr-btn-cta" onClick={save} disabled={busy}>{busy ? "저장하는 중…" : "이 잔 저장"}</button>
    </>
  );

  return (
    <BottomSheet open={open} onClose={close} labelledBy={titleId} size="full" className="rr-session" footer={footer}>
      <div className="rr-sheet-head">
        <div className="rr-session-progress">
          <div className="rr-steps" aria-hidden="true">{STEPS.map((s, i) => <i key={s} className={i < step ? "done" : i === step ? "on" : ""} />)}</div>
          <h2 id={titleId}>{title}</h2>
        </div>
        {hasContent(value) && !draftError && <span className="rr-draft-note">초안 저장됨</span>}
        <button type="button" className="rr-icon-btn" onClick={close} aria-label="닫기 (초안은 남아요)">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
      <div className="rr-sheet-body" ref={body} {...swipeHandlers}>
        {draftError && <p className="rr-error" role="alert">{draftError}</p>}
        {step === 0 && (
          <>
            <p className="rr-q" tabIndex={-1}>오늘 커피는 어땠나요?</p>
            <div className="rr-field">
              <label htmlFor={id + "-note"}>한 줄 느낌</label>
              <textarea id={id + "-note"} data-autofocus maxLength={2100} value={value.note} placeholder="예시: 고소하고 끝맛이 달았어" onChange={(e) => update({ note: e.target.value })} />
              <span className={"rr-count" + (value.note.length > 2000 ? " over" : "")}>{value.note.length.toLocaleString()} / 2,000자</span>
            </div>
            <p className="rr-label">맛 칩으로 덧붙이기</p>
            <div className="rr-chips">
              {TASTES.map((t) => {
                const color = colorsOf(t)[0];
                return (
                  <button key={t} type="button" className="rr-chip" aria-pressed={value.tastes.includes(t)} onClick={() => toggleTaste(t)}>
                    {color && <span className="rr-sw" style={{ background: color }} aria-hidden="true" />}{t}
                  </button>
                );
              })}
            </div>
            {!value.note.trim() && <p className="rr-hint">한 단어라도 적으면 다음으로 넘어갈 수 있어요.</p>}
            {value.note.length > 2000 && <p className="rr-hint rr-hint-error">2,000자까지 남길 수 있어요.</p>}
          </>
        )}
        {step === 1 && (
          <>
            <p className="rr-q" tabIndex={-1}>어떤 원두였나요? <span className="rr-label">선택</span></p>
            <div className="rr-field">
              <label htmlFor={id + "-bean"}>원두 이름</label>
              <input id={id + "-bean"} value={value.beanName} placeholder="몰라도 괜찮아요" onChange={(e) => update({ beanName: e.target.value })} />
            </div>
            {beans.length > 0 ? (
              <>
                <p className="rr-label">최근 남긴 원두</p>
                <div className="rr-chips">{beans.map((b) => <button key={b} type="button" className="rr-chip" aria-pressed={value.beanName === b} onClick={() => update({ beanName: b })}>{b}</button>)}</div>
              </>
            ) : <p className="rr-hint">이 기기에서 남긴 원두가 생기면 여기서 바로 고를 수 있어요.</p>}
          </>
        )}
        {step === 2 && (
          <>
            <p className="rr-q" tabIndex={-1}>이 한 잔, 다시 마시고 싶나요?</p>
            <div className="rr-verdicts" role="radiogroup" aria-label="다시 마실지 판단">
              {verdicts.map((v) => (
                <button key={v.key} type="button" role="radio" aria-checked={value.verdict === v.key} className={"rr-verdict" + (pulse === v.key ? " pulsing" : "")} onClick={() => pickVerdict(v.key)}>
                  <span className="rr-mark" aria-hidden="true">{MARK[v.key]}</span>
                  <span>{v.label}<small>{HINT[v.key]}</small></span>
                  <i className="rr-pulse" aria-hidden="true" />
                </button>
              ))}
            </div>
            <p className="rr-hint">고르지 않아도 저장돼요. 고른 판단만 "나의 취향"에 쓰여요.</p>
          </>
        )}
        {step === 3 && (
          <>
            <p className="rr-q" tabIndex={-1}>함께 들은 곡이 있나요? <span className="rr-label">선택</span></p>
            <div className="rr-field"><label htmlFor={id + "-track"}>곡</label><input id={id + "-track"} value={music.track} placeholder="곡 이름" onChange={(e) => setMusicField("track", e.target.value)} /></div>
            <div className="rr-field"><label htmlFor={id + "-artist"}>아티스트</label><input id={id + "-artist"} value={music.artist} placeholder="아티스트" onChange={(e) => setMusicField("artist", e.target.value)} /></div>
            <div className="rr-field"><label htmlFor={id + "-url"}>링크</label><input id={id + "-url"} inputMode="url" value={music.url} placeholder="https://" onChange={(e) => setMusicField("url", e.target.value)} /></div>
            {!music.track.trim() && (music.artist || music.url) && <p className="rr-hint">곡 이름이 있어야 음악이 함께 저장돼요.</p>}
          </>
        )}
        {step === 4 && (
          <article className="rr-card" ref={card} tabIndex={-1} aria-label="저장할 기록 카드">
            <div className="rr-card-art">
              <ResonanceAura className="rr-card-aura" colors={colorsOf(value.note)} rings={value.verdict === "again" ? 3 : value.verdict ? 2 : 0} seedKey={value.note.slice(0, 80)} />
              {value.soundtrack && <svg className="rr-card-wave" viewBox="0 0 56 16" width="56" height="16" aria-hidden="true"><path d="M2 8 Q 6 1 10 8 T 18 8 T 26 8 T 34 8 T 42 8 T 50 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
              <span className="rr-card-who">미리보기</span>
            </div>
            <div className="rr-card-body">
              <p className="rr-card-meta">{value.beanName.trim() || "원두 미기록"} · 오늘</p>
              <p className="rr-card-note">{value.note.trim()}</p>
              <span className={"rr-vtag" + (value.verdict === "again" ? " again" : "")}>{verdict ? `${MARK[verdict.key]} ${verdict.label}` : "판단 미기록"}</span>
              {value.soundtrack && <p className="rr-card-music"><span aria-hidden="true">♫</span> {value.soundtrack.track}{value.soundtrack.artist ? ` · ${value.soundtrack.artist}` : ""}</p>}
            </div>
          </article>
        )}
        {error && <p className="rr-error" role="alert">{error}</p>}
      </div>
    </BottomSheet>
  );
}

// The saved card shrinks into the 기록 tab. Skipped when motion is reduced.
function flyToJournal(card) {
  const tab = document.querySelector('[data-rr-tab="records"]');
  if (!card || !tab || reduced()) return;
  const from = card.getBoundingClientRect(), to = tab.getBoundingClientRect();
  const ghost = card.cloneNode(true);
  ghost.classList.add("rr-fly");
  Object.assign(ghost.style, { left: from.left + "px", top: from.top + "px", width: from.width + "px" });
  document.body.appendChild(ghost);
  requestAnimationFrame(() => {
    const scale = 40 / from.width;
    ghost.style.transform = `translate(${to.left + to.width / 2 - 20 - from.left}px, ${to.top - from.top}px) scale(${scale})`;
    ghost.style.opacity = "0.15";
  });
  setTimeout(() => ghost.remove(), 620);
}
