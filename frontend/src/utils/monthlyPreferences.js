export const MONTHLY_FAVORITES_KEY = "rr-monthly-favorites-v1";
export function readMonthlyFavorites(storage) {
  const raw = storage.getItem(MONTHLY_FAVORITES_KEY);
  if (raw === null) return [];
  const ids = JSON.parse(raw);
  if (
    !Array.isArray(ids) ||
    ids.some(
      (id) =>
        !(
          (typeof id === "string" && id.length > 0) ||
          (typeof id === "number" && Number.isFinite(id))
        ),
    )
  )
    throw Error(
      "관심 원두 목록을 읽지 못했어요. 기존 자료를 보호하기 위해 변경하지 않습니다.",
    );
  return [...new Set(ids.map(String))];
}
export function saveMonthlyFavorite(storage, ids, id) {
  // Validate existing storage first, so unreadable personal data is never overwritten.
  const current = readMonthlyFavorites(storage);
  const key = String(id),
    wantSaved = !ids.includes(key);
  const next = wantSaved
    ? current.includes(key)
      ? current
      : [...current, key]
    : current.filter((x) => x !== key);
  storage.setItem(MONTHLY_FAVORITES_KEY, JSON.stringify(next));
  return next;
}
export function toggleMonthlyComparison(ids, id) {
  const key = String(id);
  if (ids.includes(key)) return ids.filter((x) => x !== key);
  if (ids.length >= 3)
    throw Error(
      "원두는 최대 3개까지 비교할 수 있어요. 선택한 원두를 먼저 해제해 주세요.",
    );
  return [...ids, key];
}
