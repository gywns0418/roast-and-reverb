// Shared plumbing for the phone experience (Ripple): opening the record session
// from anywhere, telling open pages that a cup was saved or undone, toasts, and
// the quick draft that the phone session and the desktop form both use.
import { useEffect, useState } from "react";
import { authStore } from "../store/authStore.js";
import { validateDraft } from "./draft.js";
import { quickDraftKey } from "./firstCup.js";
import { DIARY_KEY } from "./diaryStorage.js";
import { adaptCoffeeLog } from "../api/adapters.js";

export const SESSION_OPEN = "rr-open-session";
export const CUP_SAVED = "rr-cup-saved";
export const CUP_REMOVED = "rr-cup-removed";
export const DRAFT_CHANGED = "rr-draft-changed";
export const TOAST = "rr-toast";

export const openSession = () => window.dispatchEvent(new Event(SESSION_OPEN));
export const announceSaved = (row) => window.dispatchEvent(new CustomEvent(CUP_SAVED, { detail: row }));
export const announceRemoved = (id) => window.dispatchEvent(new CustomEvent(CUP_REMOVED, { detail: String(id) }));
export const draftChanged = () => window.dispatchEvent(new Event(DRAFT_CHANGED));
export const showToast = (text, action) => window.dispatchEvent(new CustomEvent(TOAST, { detail: { text, action } }));

const real = import.meta.env?.VITE_USE_REAL_API === "true";
export function draftScope() {
  const user = authStore.user;
  return real ? (authStore.token ? String(user.memberId || user.member_id || user.id || user.email) : "guest") : "trial";
}

export const blankCup = () => ({ note: "", beanName: "", roastery: "", brewMethod: "", tastes: [], soundtrack: null, verdict: "", senses: {} });

export function readQuickDraft(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(quickDraftKey(draftScope()));
    if (!raw) return { value: blankCup() };
    const row = validateDraft(JSON.parse(raw), "draft-first-cup");
    const v = row.value;
    if (typeof v.note !== "string" || v.note.length > 2000 || !Array.isArray(v.tastes)) throw Error();
    return { value: { ...blankCup(), ...v } };
  } catch {
    return { value: blankCup(), error: "저장된 초안을 읽지 못했어요. 원본 보호를 위해 덮어쓰지 않아요." };
  }
}

export function writeQuickDraft(value, storage = globalThis.localStorage) {
  const key = quickDraftKey(draftScope());
  if (!hasContent(value)) storage.removeItem(key);
  else storage.setItem(key, JSON.stringify(validateDraft({ version: 1, updatedAt: new Date().toISOString(), value }, "draft-first-cup")));
  draftChanged();
}

export const hasContent = (v) => !!(v && (v.note?.trim() || v.beanName?.trim() || v.verdict || v.soundtrack));

export function useHasDraft() {
  const read = () => hasContent(readQuickDraft().value);
  const [has, setHas] = useState(read);
  useEffect(() => {
    const update = () => setHas(read());
    window.addEventListener(DRAFT_CHANGED, update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener(DRAFT_CHANGED, update); window.removeEventListener("storage", update); };
  }, []);
  return has;
}

// Pages that list cups add what the session saved and drop what was undone,
// without reloading the whole list.
export function useLiveCups(stored) {
  const [added, setAdded] = useState([]), [removed, setRemoved] = useState([]);
  useEffect(() => {
    const add = (e) => setAdded((rows) => [adaptCoffeeLog(e.detail), ...rows]);
    const drop = (e) => setRemoved((ids) => [...ids, e.detail]);
    window.addEventListener(CUP_SAVED, add);
    window.addEventListener(CUP_REMOVED, drop);
    return () => { window.removeEventListener(CUP_SAVED, add); window.removeEventListener(CUP_REMOVED, drop); };
  }, []);
  return [...added, ...stored.filter((row) => !added.some((x) => String(x.id) === String(row.id)))].filter((row) => !removed.includes(String(row.id)));
}

export function storedCupCount(storage = globalThis.localStorage) {
  try { return JSON.parse(storage.getItem(DIARY_KEY))?.coffeeLogs?.length || 0; } catch { return 0; }
}
