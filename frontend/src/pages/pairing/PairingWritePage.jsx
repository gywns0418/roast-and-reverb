import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import CoffeeLogCard from "../../components/coffee/CoffeeLogCard.jsx";
import MusicCard from "../../components/music/MusicCard.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { musicApi } from "../../api/musicApi.js";
import { pairingApi } from "../../api/pairingApi.js";
import { adaptCoffeeLog, adaptMusicLog } from "../../api/adapters.js";
import { coffeeLogs, musicLogs } from "../../data/sampleData.js";
import { useApiResource } from "../../hooks/useApiResource.js";

function readId(item, keys) {
  for (const key of keys) {
    if (item?.raw?.[key] !== undefined) return item.raw[key];
  }
  return item?.id;
}

export default function PairingWritePage() {
  const navigate = useNavigate();
  const { data: coffees } = useApiResource(
    () => listDiaryRecords(coffeeApi.list).then((items) => items.map(adaptCoffeeLog)),
    coffeeLogs.map(adaptCoffeeLog),
    []
  );
  const { data: musics } = useApiResource(
    () => listDiaryRecords(musicApi.list).then((items) => items.map(adaptMusicLog)),
    musicLogs.map(adaptMusicLog),
    []
  );
  const [coffeeId, setCoffeeId] = useState("");
  const [musicId, setMusicId] = useState("");
  const [openPicker, setOpenPicker] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const selectedCoffee = useMemo(() => coffees.find((item) => String(item.id) === String(coffeeId)) || coffees[0], [coffees, coffeeId]);
  const selectedMusic = useMemo(() => musics.find((item) => String(item.id) === String(musicId)) || musics[0], [musics, musicId]);

  function pickCoffee(id) {
    setCoffeeId(id);
    setOpenPicker(null);
  }
  function pickMusic(id) {
    setMusicId(id);
    setOpenPicker(null);
  }

  async function handleAnalyze() {
    if (!selectedCoffee || !selectedMusic) return;
    setSaving(true);
    setMessage("");
    try {
      const analyzed = await pairingApi.analyze({
        coffeeLogId: readId(selectedCoffee, ["coffeeLogId", "coffee_log_id"]),
        musicLogId: readId(selectedMusic, ["musicLogId", "music_log_id"]),
        coffee: selectedCoffee.raw,
        music: selectedMusic.raw
      });
      const pairing = await pairingApi.create({
        coffeeLogId: readId(selectedCoffee, ["coffeeLogId", "coffee_log_id"]),
        musicLogId: readId(selectedMusic, ["musicLogId", "music_log_id"]),
        moodSummary: analyzed.moodSummary || analyzed.mood_summary || selectedMusic.tags.join(", "),
        moodTags: analyzed.moodTags || analyzed.mood_tags || selectedMusic.tags.join(", "),
        pairingScore: analyzed.pairingScore || analyzed.pairing_score || 80,
        pairingText: analyzed.pairingText || analyzed.pairing_text || analyzed.text || "",
        aiReason: analyzed.aiReason || analyzed.ai_reason || analyzed.reason || ""
      });
      navigate(`/pairing/${pairing.pairingId || pairing.pairing_id || pairing.id}`);
    } catch {
      setMessage("분석에 실패했습니다. 백엔드 서버 상태를 확인해주세요.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell title="AI 페어링 생성" eyebrow="Analyze" subtitle="커피 로그와 음악 로그를 선택해 AI 인사이트를 생성합니다.">
      {(!coffees.length || !musics.length) && <div className="panel"><p>한 잔과 한 곡의 기록이 있어야 연결할 수 있어요.</p><div className="action-row"><Link className="ghost-button" to="/coffee/write">커피 기록하기</Link><Link className="ghost-button" to="/music/write">음악 기록하기</Link></div></div>}
      <div className="picker-group">
        <button type="button" aria-expanded={openPicker === "coffee"} className={`ledger-pick coffee ${openPicker === "coffee" ? "open" : ""}`} onClick={() => setOpenPicker(openPicker === "coffee" ? null : "coffee")}>
          <div>
            <span className="meta smcp">Coffee</span>
            <span className="name">{selectedCoffee?.bean || "선택 없음"}</span>
          </div>
          <span className="chg">{openPicker === "coffee" ? "닫기" : "변경"}</span>
        </button>
        {openPicker === "coffee" && (
          <div className="pick-list">
            {coffees.map((item) => (
              <button type="button" className={`pick-row ${String(item.id) === String(selectedCoffee?.id) ? "active" : ""}`} key={item.id} onClick={() => pickCoffee(item.id)}>
                <span>{item.bean}</span>
                <span className="sub oldnum">{item.date}</span>
              </button>
            ))}
          </div>
        )}

        <button type="button" aria-expanded={openPicker === "music"} className={`ledger-pick music ${openPicker === "music" ? "open" : ""}`} onClick={() => setOpenPicker(openPicker === "music" ? null : "music")}>
          <div>
            <span className="meta smcp">Music</span>
            <span className="name">{selectedMusic ? `${selectedMusic.artist} — ${selectedMusic.track}` : "선택 없음"}</span>
          </div>
          <span className="chg">{openPicker === "music" ? "닫기" : "변경"}</span>
        </button>
        {openPicker === "music" && (
          <div className="pick-list">
            {musics.map((item) => (
              <button type="button" className={`pick-row ${String(item.id) === String(selectedMusic?.id) ? "active" : ""}`} key={item.id} onClick={() => pickMusic(item.id)}>
                <span>{item.artist} — {item.track}</span>
                <span className="sub oldnum">{item.date}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="compose-layout">
        {selectedCoffee && <CoffeeLogCard item={selectedCoffee} />}
        {selectedMusic && <MusicCard item={selectedMusic} />}
      </div>
      <div className="action-row">
        <Button onClick={handleAnalyze} disabled={saving || !selectedCoffee || !selectedMusic} loading={saving}>{saving ? "분석 중" : "선택한 기록으로 분석"}</Button>
        {message && <span className="muted">{message}</span>}
      </div>
    </PageShell>
  );
}
