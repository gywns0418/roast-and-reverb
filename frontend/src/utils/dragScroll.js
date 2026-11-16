// Mouse users can grab any horizontal scroller (chip rows, card rails) and drag it,
// instead of aiming for the thin scrollbar. Touch and pen keep native scrolling.
const SKIP = "input, textarea, select, [contenteditable='true'], [role='slider'], .no-drag-scroll";
const THRESHOLD = 6;

export function horizontalScroller(start, view = window) {
  for (let node = start; node && node.nodeType === 1; node = node.parentElement) {
    if (node.scrollWidth - node.clientWidth > 1) {
      const overflow = view.getComputedStyle(node).overflowX;
      if (overflow === "auto" || overflow === "scroll") return node;
    }
  }
  return null;
}

export function installDragScroll(doc = document) {
  const view = doc.defaultView;
  let drag = null;
  let suppressClick = false;

  const end = () => {
    if (!drag) return;
    if (drag.moved) {
      drag.el.classList.remove("is-drag-scrolling");
      suppressClick = true;
      view.setTimeout(() => { suppressClick = false; }, 0);
    }
    drag = null;
  };

  const down = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if (event.target.closest?.(SKIP)) return;
    const el = horizontalScroller(event.target, view);
    if (!el) return;
    drag = { el, x: event.clientX, left: el.scrollLeft, moved: false };
  };

  const move = (event) => {
    if (!drag) return;
    if (!(event.buttons & 1)) return end();
    const dx = event.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < THRESHOLD) return;
    if (!drag.moved) {
      drag.moved = true;
      drag.el.classList.add("is-drag-scrolling");
      view.getSelection?.()?.removeAllRanges();
    }
    event.preventDefault();
    drag.el.scrollLeft = drag.left - dx;
  };

  // A drag that ends over a chip must not also press it.
  const click = (event) => {
    if (!suppressClick) return;
    suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  };
  const dragstart = (event) => { if (drag) event.preventDefault(); };

  doc.addEventListener("pointerdown", down);
  doc.addEventListener("pointermove", move, { passive: false });
  doc.addEventListener("pointerup", end);
  doc.addEventListener("pointercancel", end);
  doc.addEventListener("click", click, true);
  doc.addEventListener("dragstart", dragstart);
  return () => {
    doc.removeEventListener("pointerdown", down);
    doc.removeEventListener("pointermove", move);
    doc.removeEventListener("pointerup", end);
    doc.removeEventListener("pointercancel", end);
    doc.removeEventListener("click", click, true);
    doc.removeEventListener("dragstart", dragstart);
  };
}
