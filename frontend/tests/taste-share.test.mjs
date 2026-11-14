import test from "node:test";
import assert from "node:assert/strict";
import { buildTasteProfile } from "../src/utils/tasteProfile.js";
import { compareTaste, decodeTaste, encodeTaste, tasteLink, withParticle } from "../src/utils/tasteShare.js";
import { backupDue, daysSince, lastBackupAt, markBackup } from "../src/utils/backupReminder.js";
import { flavorBandBackground } from "../src/utils/flavorBand.js";

const cup = (memo, verdict, extra = {}) => ({ id: memo, date: "2026.11.14", bean: "비밀 원두", roastery: "비밀 로스터리", memo, brewDetails: { verdict }, brew: "핸드드립", ...extra });
const mine = buildTasteProfile([
  cup("꽃향이 좋고 차 같은 느낌", "again"),
  cup("고소한 견과 맛", "not-mine"),
]);

test("taste link round-trips families and counts but never bean names or memos", () => {
  const code = encodeTaste(mine, "민지");
  assert.match(code, /^[A-Za-z0-9_-]+$/);
  const raw = Buffer.from(code, "base64url").toString("utf8");
  assert.doesNotMatch(raw, /비밀|꽃향이 좋고|2026/);
  const friend = decodeTaste(code);
  assert.equal(friend.name, "민지");
  assert.deepEqual(friend.likedFamilies.map((f) => f.key), mine.likedFamilies.map((f) => f.key));
  assert.deepEqual(friend.dislikedFamilies.map((f) => f.key), ["nutty"]);
  assert.equal(friend.judged, 2);
  assert.deepEqual(friend.methods, ["핸드드립"]);
  assert.equal(tasteLink(code, "https://x.test/app/"), `https://x.test/app/#/taste/compare?t=${code}`);
});

test("broken or tampered taste links are rejected", () => {
  const pack = (data) => Buffer.from(JSON.stringify(data)).toString("base64url");
  const ok = { v: 1, l: [["floral", 1]], d: [], j: 1, a: 1, r: 0, m: [] };
  assert.ok(decodeTaste(pack(ok)));
  for (const bad of [
    "",
    "not base64!",
    "x".repeat(901),
    pack({ ...ok, v: 2 }),
    pack({ ...ok, l: [["unknown", 1]] }),
    pack({ ...ok, l: [["floral", -1]] }),
    pack({ ...ok, l: [["floral", 1], ["floral", 2]] }),
    pack({ ...ok, d: [["floral", 1]] }),
    pack({ ...ok, j: "1" }),
  ])
    assert.equal(decodeTaste(bad), null, bad.slice(0, 40));
  const tidy = decodeTaste(pack({ ...ok, n: "<b>아주아주아주아주긴이름입니다</b>", m: ["<script>", "a".repeat(40)] }));
  assert.equal(tidy.name.includes("<"), false);
  assert.ok(tidy.name.length <= 12);
  assert.ok(tidy.methods.every((m) => !m.includes("<") && m.length <= 20));
});

test("comparison lists overlaps and differences only from marked families", () => {
  const friend = decodeTaste(Buffer.from(JSON.stringify({ v: 1, l: [["floral", 2], ["chocolate", 1], ["nutty", 1]], d: [["tea", 1]], j: 4, a: 3, r: 2, m: [] })).toString("base64url"));
  const result = compareTaste(mine, friend);
  assert.deepEqual(result.bothLiked.map((f) => f.key), ["floral"]);
  assert.deepEqual(result.friendOnly.map((f) => f.key), ["chocolate"]);
  assert.deepEqual(result.mineOnly.map((f) => f.key), []);
  assert.deepEqual(result.split.map((f) => [f.key, f.friendLikes]).sort(), [["nutty", true], ["tea", false]]);
});

test("particles follow the last syllable of the name", () => {
  assert.equal(withParticle("민지", ["이", "가"]), "민지가");
  assert.equal(withParticle("준", ["이", "가"]), "준이");
  assert.equal(withParticle("준", ["과", "와"]), "준과");
  assert.equal(withParticle("Alex", ["과", "와"]), "Alex와");
});

test("backup reminder waits for three cups and repeats every two weeks", () => {
  const day = 86_400_000, now = 100 * day;
  assert.equal(backupDue({ total: 2, last: null, now }), false);
  assert.equal(backupDue({ total: 3, last: null, now }), true);
  assert.equal(backupDue({ total: 3, last: now - 13 * day, now }), false);
  assert.equal(backupDue({ total: 3, last: now - 15 * day, now }), true);
  assert.equal(daysSince(now - 3 * day - 5, now), 3);
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  assert.equal(lastBackupAt(storage), null);
  markBackup(storage, 1234);
  assert.equal(lastBackupAt(storage), 1234);
  assert.equal(lastBackupAt({ getItem() { throw new Error("blocked"); } }), null);
});

test("flavor band keeps vendor HEX colors exactly and ignores malformed ones", () => {
  const band = flavorBandBackground({ flavorColors: ["#E9A28F", "red", "#7d4b8a"] });
  assert.match(band, /#E9A28F 0\.00% 50\.00%/);
  assert.match(band, /#7d4b8a 50\.00% 100\.00%/);
  assert.doesNotMatch(band, /red/);
  assert.equal(flavorBandBackground({}), "#b9a88a");
});
