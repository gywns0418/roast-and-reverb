// Taste links: a summary of "my taste" packed into the URL so a friend can
// compare without any server. Only family keys, counts and up to three brew
// method names travel — never bean names, memos, dates or roasteries.
import { noteFamilies } from "./tasteQuery.js";

const familyKeys = new Set(noteFamilies.map((f) => f.key));
const labelOf = (key) => noteFamilies.find((f) => f.key === key)?.label || key;
const MAX_CODE = 900;

const toBase64Url = (text) => {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromBase64Url = (code) => {
  const binary = atob(code.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
};
const count = (value) => (Number.isInteger(value) && value >= 0 && value <= 9999 ? value : null);
const shortText = (value, max) => {
  const text = String(value ?? "").replace(/[\u0000-\u001f<>]/g, "").trim();
  return text.slice(0, max);
};

export function encodeTaste(profile, name = "") {
  const pack = (list, field) => list.slice(0, 8).map((f) => [f.key, f[field]]);
  const data = {
    v: 1,
    n: shortText(name, 12) || undefined,
    l: pack(profile.likedFamilies, "again"),
    d: pack(profile.dislikedFamilies, "notMine"),
    j: profile.judged,
    a: profile.againCount,
    r: profile.roasteries.length,
    m: profile.favoriteMethods.slice(0, 3).map((m) => shortText(m.name, 20)),
  };
  return toBase64Url(JSON.stringify(data));
}

// Returns a friend profile shaped like buildTasteProfile's families, or null
// when the code is missing, too long, or does not match the expected shape.
export function decodeTaste(code) {
  if (typeof code !== "string" || !code || code.length > MAX_CODE || !/^[A-Za-z0-9_-]+$/.test(code)) return null;
  let data;
  try {
    data = JSON.parse(fromBase64Url(code));
  } catch {
    return null;
  }
  if (!data || data.v !== 1) return null;
  const families = (list, field) => {
    if (!Array.isArray(list) || list.length > 8) return null;
    const seen = new Set();
    const out = [];
    for (const row of list) {
      if (!Array.isArray(row) || row.length !== 2 || !familyKeys.has(row[0]) || seen.has(row[0]) || count(row[1]) === null) return null;
      seen.add(row[0]);
      out.push({ key: row[0], label: labelOf(row[0]), [field]: row[1] });
    }
    return out;
  };
  const likedFamilies = families(data.l, "again");
  const dislikedFamilies = families(data.d, "notMine");
  const judged = count(data.j), againCount = count(data.a), roasteries = count(data.r);
  if (!likedFamilies || !dislikedFamilies || judged === null || againCount === null || roasteries === null) return null;
  if (likedFamilies.some((f) => dislikedFamilies.some((g) => g.key === f.key))) return null;
  const methods = Array.isArray(data.m) ? data.m.slice(0, 3).map((m) => shortText(m, 20)).filter(Boolean) : [];
  return {
    name: shortText(data.n, 12),
    likedFamilies,
    dislikedFamilies,
    judged,
    againCount,
    roasteryCount: roasteries,
    methods,
  };
}

export function tasteLink(code, base = typeof location === "undefined" ? "" : location.origin + location.pathname) {
  return `${base}#/taste/compare?t=${code}`;
}

// Compares a friend's taste with mine. Only lists overlaps and differences of
// families each person actually marked; no compatibility score is invented.
export function compareTaste(mine, friend) {
  const has = (list, key) => list.some((f) => f.key === key);
  const mineLiked = mine?.likedFamilies || [];
  const mineDisliked = mine?.dislikedFamilies || [];
  return {
    bothLiked: friend.likedFamilies.filter((f) => has(mineLiked, f.key)),
    friendOnly: friend.likedFamilies.filter((f) => !has(mineLiked, f.key) && !has(mineDisliked, f.key)),
    mineOnly: mineLiked.filter((f) => !has(friend.likedFamilies, f.key) && !has(friend.dislikedFamilies, f.key)),
    split: [
      ...friend.likedFamilies.filter((f) => has(mineDisliked, f.key)).map((f) => ({ ...f, friendLikes: true })),
      ...mineLiked.filter((f) => has(friend.dislikedFamilies, f.key)).map((f) => ({ ...f, friendLikes: false })),
    ],
  };
}

// Picks the Korean particle that fits the name's last syllable (민지가 / 준이).
export function withParticle(word, [withFinal, withoutFinal]) {
  const code = String(word).charCodeAt(String(word).length - 1);
  const hasFinal = code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
  return word + (hasFinal ? withFinal : withoutFinal);
}
