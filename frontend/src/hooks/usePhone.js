import { useSyncExternalStore } from "react";

// True on phone widths (the range mobile.css covers). Only used where a phone
// needs a different container, such as moving filters into a bottom sheet.
const query = "(max-width: 760px)";
const subscribe = (notify) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
export function usePhone() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
