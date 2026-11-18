import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { House, NotebookPen, Search, Orbit, CircleUserRound, Plus } from "lucide-react";
import BottomSheet from "./BottomSheet.jsx";
import { CUP_REMOVED, CUP_SAVED, TOAST, openSession, storedCupCount, useHasDraft } from "../../utils/ripple.js";
import { backupDue, lastBackupAt } from "../../utils/backupReminder.js";

const tabs = [
  ["/dashboard", House, "오늘", "today"],
  ["/coffee", NotebookPen, "기록", "records"],
  null,
  ["/monthly-pick", Search, "발견", "discover"],
  ["/taste", Orbit, "취향", "taste"],
];

// Phone tab bar: fixed to the bottom edge on an opaque ground, with the record
// button in the middle so a cup can be started from any screen in one tap.
export function RippleTabbar() {
  const draft = useHasDraft(), { pathname } = useLocation();
  const [fresh, setFresh] = useState(0);
  useEffect(() => {
    const up = () => setFresh((n) => n + 1), down = () => setFresh((n) => Math.max(0, n - 1));
    window.addEventListener(CUP_SAVED, up);
    window.addEventListener(CUP_REMOVED, down);
    return () => { window.removeEventListener(CUP_SAVED, up); window.removeEventListener(CUP_REMOVED, down); };
  }, []);
  useEffect(() => { if (pathname.startsWith("/coffee")) setFresh(0); }, [pathname]);
  return (
    <nav className="rr-tabbar" aria-label="주요 화면">
      {tabs.map((tab) => {
        if (!tab) return (
          <button key="fab" type="button" className="rr-fab" onClick={openSession} aria-label={draft ? "한 잔 기록 이어서 쓰기 (초안 있음)" : "한 잔 기록하기"}>
            <Plus size={26} strokeWidth={2.4} aria-hidden="true" />
            {draft && <span className="rr-fab-dot" aria-hidden="true" />}
          </button>
        );
        const [to, Icon, label, key] = tab;
        return (
          <NavLink key={to} to={to} data-rr-tab={key} className={({ isActive }) => "rr-tab" + (isActive ? " active" : "")} aria-label={key === "records" && fresh ? `${label}, 새 기록 ${fresh}개` : undefined}>
            <Icon size={22} aria-hidden="true" />
            <span aria-hidden={key === "records" && fresh ? true : undefined}>{label}</span>
            {key === "records" && fresh > 0 && <span className="rr-badge" aria-hidden="true">{fresh}</span>}
          </NavLink>
        );
      })}
    </nav>
  );
}

// Top bar on phones: brand, where records live (one dot), and the way to 나.
export function RippleAppbar() {
  const [open, setOpen] = useState(false), { pathname } = useLocation();
  const [due, setDue] = useState(false);
  useEffect(() => {
    const check = () => setDue(backupDue({ total: storedCupCount(), last: lastBackupAt(globalThis.localStorage) }));
    check();
    window.addEventListener(CUP_SAVED, check);
    return () => window.removeEventListener(CUP_SAVED, check);
  }, [pathname]);
  return (
    <>
      <header className="rr-appbar">
        <NavLink className="rr-brand" to="/dashboard" aria-label="Roast & Reverb 오늘">
          <i className="brand-orb" aria-hidden="true" />
          <span>R&amp;R</span>
        </NavLink>
        <span className="rr-grow" />
        <button type="button" className={"rr-status" + (due ? " due" : "")} onClick={() => setOpen(true)} aria-label={due ? "저장 위치: 이 기기. 백업할 때가 됐어요. 자세히 보기" : "저장 위치: 이 기기에만 저장. 자세히 보기"}>이 기기</button>
        <NavLink to="/mypage" className={({ isActive }) => "rr-icon-btn" + (isActive ? " active" : "")} aria-label="나: 보관·백업·설정">
          <CircleUserRound size={20} aria-hidden="true" />
        </NavLink>
      </header>
      <BottomSheet open={open} onClose={() => setOpen(false)} labelledBy="rr-status-title" size="peek"
        footer={<>
          <button type="button" className="rr-btn rr-btn-ghost" onClick={() => setOpen(false)}>닫기</button>
          <Link className="rr-btn rr-btn-cta" to="/backup" onClick={() => setOpen(false)}>백업하기</Link>
        </>}>
        <div className="rr-sheet-head"><h2 id="rr-status-title" tabIndex={-1} data-autofocus>이 기기에만 저장돼요</h2></div>
        <div className="rr-sheet-body">
          <p className="rr-text">기록은 로그인 없이 이 브라우저에만 보관돼요. 기기를 바꾸기 전에 백업 파일을 만들어 두세요.{due ? " 마지막 백업 뒤로 기록이 쌓였어요." : ""}</p>
        </div>
      </BottomSheet>
    </>
  );
}

// Home's thumb-zone button. Shows when a draft is waiting.
export function RippleStart({ label = "한 잔 남기기" }) {
  const draft = useHasDraft();
  return (
    <div className="rr-start">
      <button type="button" className="rr-btn rr-btn-cta" onClick={openSession}>
        {draft ? <>이어서 쓰기 <span className="rr-draft-pill">초안 1</span></> : label}
      </button>
    </div>
  );
}

// One toast above the tab bar; an action (되돌리기) keeps it up a little longer.
export function RippleToaster() {
  const [toast, setToast] = useState(null), timer = useRef(null);
  useEffect(() => {
    const show = (e) => {
      clearTimeout(timer.current);
      setToast(e.detail);
      timer.current = setTimeout(() => setToast(null), e.detail.action ? 5000 : 3200);
    };
    window.addEventListener(TOAST, show);
    return () => { window.removeEventListener(TOAST, show); clearTimeout(timer.current); };
  }, []);
  return (
    <div className={"rr-toast" + (toast ? " on" : "")} role="status" aria-live="polite">
      {toast && <>
        <span>{toast.text}</span>
        {toast.action && <button type="button" onClick={() => { clearTimeout(timer.current); setToast(null); toast.action.run(); }}>{toast.action.label}</button>}
      </>}
    </div>
  );
}
