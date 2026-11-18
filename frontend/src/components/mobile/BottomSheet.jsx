import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const CLOSE_DRAG = 120;

// Bottom sheet for phones. Closing is the same action everywhere: drag the
// handle down past 120px, tap outside, the close button, Esc, or the phone's
// back gesture (opening adds one history step). Focus moves in on open and back
// to the opener on close; the page behind is inert while the sheet is up.
export default function BottomSheet({ open, onClose, labelledBy, size = "full", className = "", children, footer }) {
  const sheet = useRef(null), closeRef = useRef(onClose), start = useRef(null);
  const [mounted, setMounted] = useState(open), [shown, setShown] = useState(false), [offset, setOffset] = useState(0);
  closeRef.current = onClose;

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(frame);
    }
    setShown(false);
    setOffset(0);
    const t = setTimeout(() => setMounted(false), reduced() ? 0 : 320);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement, key = "rr-sheet-" + Math.random().toString(36).slice(2);
    const root = document.getElementById("root");
    window.history.pushState({ ...(window.history.state || {}), rrSheet: key }, "");
    const onPop = () => closeRef.current?.("back");
    const onKey = (e) => { if (e.key === "Escape") closeRef.current?.("esc"); };
    window.addEventListener("popstate", onPop);
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("rr-sheet-open");
    if (root) root.inert = true;
    const focus = setTimeout(() => {
      const target = sheet.current?.querySelector("[data-autofocus]") || sheet.current;
      target?.focus({ preventScroll: true });
    }, reduced() ? 0 : 340);
    return () => {
      clearTimeout(focus);
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("rr-sheet-open");
      if (root) root.inert = false;
      if (window.history.state?.rrSheet === key) window.history.back();
      opener?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!mounted) return null;
  const handle = {
    onPointerDown: (e) => { start.current = e.clientY; e.currentTarget.setPointerCapture?.(e.pointerId); },
    onPointerMove: (e) => { if (start.current !== null) setOffset(Math.max(0, e.clientY - start.current)); },
    onPointerUp: (e) => { if (start.current === null) return; const d = e.clientY - start.current; start.current = null; if (d > CLOSE_DRAG) closeRef.current?.("drag"); else setOffset(0); },
    onPointerCancel: () => { start.current = null; setOffset(0); },
  };
  return createPortal(
    <div className={"rr-sheet-layer" + (shown ? " is-open" : "")}>
      <div className="rr-scrim" onClick={() => closeRef.current?.("scrim")} aria-hidden="true" />
      <section
        ref={sheet}
        className={`rr-sheet rr-sheet-${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        style={offset ? { transform: `translateY(${offset}px)`, transition: "none" } : undefined}
      >
        <div className="rr-sheet-handle" {...handle}><i aria-hidden="true" /></div>
        {children}
        {footer && <div className="rr-sheet-foot">{footer}</div>}
      </section>
    </div>,
    document.body,
  );
}
