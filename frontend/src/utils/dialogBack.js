// Opens a native <dialog> so the phone's back gesture closes it, the same way
// bottom sheets close: opening adds one history step, closing removes it.
export function showWithBack(dialog) {
  if (!dialog || dialog.open) return;
  dialog.showModal();
  const key = "rr-dialog-" + Math.random().toString(36).slice(2);
  window.history.pushState({ ...(window.history.state || {}), rrSheet: key }, "");
  const onPop = () => { if (dialog.open) dialog.close(); };
  window.addEventListener("popstate", onPop);
  dialog.addEventListener("close", () => {
    window.removeEventListener("popstate", onPop);
    if (window.history.state?.rrSheet === key) window.history.back();
  }, { once: true });
}
