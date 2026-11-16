import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import ResonanceAura from "../../components/visual/ResonanceAura.jsx";
import ResonanceChart from "../../components/visual/ResonanceChart.jsx";
import { useCupPalette } from "../../hooks/useCupPalette.js";
import { cupPalette } from "../../utils/cupColor.js";
import { analyzePairing, axes as pairAxes, readPreferences } from "../../utils/pairingEngine.js";
import { coffeeApi } from "../../api/coffeeApi.js";
import { musicApi } from "../../api/musicApi.js";
import { pairingApi } from "../../api/pairingApi.js";
import { adaptCoffeeLog, adaptMusicLog } from "../../api/adapters.js";
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
    [],
    []
  );
  const { data: musics } = useApiResource(
    () => listDiaryRecords(musicApi.list).then((items) => items.map(adaptMusicLog)),
    [],
    []
  );
  const [engine, setEngine] = useState("local");
  const local = import.meta.env.VITE_USE_REAL_API !== "true";
  const [coffeeId, setCoffeeId] = useState("");
  const [musicId, setMusicId] = useState("");
  const [openPicker, setOpenPicker] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const palette = useCupPalette();

  const selectedCoffee = useMemo(() => coffees.find((item) => String(item.id) === String(coffeeId)) || coffees[0], [coffees, coffeeId]);
  const selectedMusic = useMemo(() => musics.find((item) => String(item.id) === String(musicId)) || musics[0], [musics, musicId]);

  // Local, read-only preview of where the two senses meet, before anything is saved.
  const preview = useMemo(() => {
    if (!selectedCoffee || !selectedMusic) return null;
    try {
      return analyzePairing({ coffee: selectedCoffee, music: selectedMusic }, readPreferences()).evidence;
    } catch (error) {
      return { error: error.message };
    }
  }, [selectedCoffee, selectedMusic]);

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
        engine,
        coffeeLogId: readId(selectedCoffee, ["coffeeLogId", "coffee_log_id"]),
        musicLogId: readId(selectedMusic, ["musicLogId", "music_log_id"]),
        coffee: selectedCoffee,
        music: selectedMusic
      });
      const pairing = await pairingApi.create({
        coffeeLogId: readId(selectedCoffee, ["coffeeLogId", "coffee_log_id"]),
        musicLogId: readId(selectedMusic, ["musicLogId", "music_log_id"]),
        moodSummary: analyzed.moodSummary || analyzed.mood_summary || selectedMusic.tags.join(", "),
        moodTags: analyzed.moodTags || analyzed.mood_tags || selectedMusic.tags.join(", "),
        pairingScore: analyzed.pairingScore ?? analyzed.pairing_score,
        pairingText: analyzed.pairingText || analyzed.pairing_text || analyzed.text || "",
        aiReason: analyzed.aiReason || analyzed.ai_reason || analyzed.reason || ""
      });
      navigate(`/pairing/${pairing.pairingId || pairing.pairing_id || pairing.id}`);
    } catch (error) {
      setMessage(error.message || "분석을 완료하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell title={local ? "한 잔과 한 곡 연결하기" : "AI 페어링 생성"} eyebrow="Analyze" subtitle={local ? "남긴 커피와 음악의 특징을 비교해 연결점을 찾아보세요." : "커피 로그와 음악 로그를 선택해 AI 인사이트를 생성합니다."}>
      {(!coffees.length || !musics.length) && <div className="panel"><p>한 잔과 한 곡의 기록이 있어야 연결할 수 있어요.</p><div className="action-row"><Link className="ghost-button" to="/coffee/write">커피 기록하기</Link><Link className="ghost-button" to="/music/write">음악 기록하기</Link></div></div>}
      <div className="action-row"><Link className="primary-button" to="/recommend">내 원두·월픽과 새로운 음악으로 추천받기 ↗</Link></div>
      <section className="engine-intro"><p className="eyebrow">R&R PAIRING ENGINE</p><h2>내 취향에 맞춰, 한 잔과 한 곡.</h2><p>맛 노트와 음악의 장르·감상을 비교해 연결점을 찾습니다. 조합에 피드백을 남기면 이 기기에서 선호를 학습해요.</p><label className="input-field"><span>분석 방식</span><select aria-label="페어링 분석 방식" value={engine} onChange={event => setEngine(event.target.value)}><option value="local">R&R 로컬 엔진 · 무료</option>{!local && <option value="claude">Claude · 서버 연결 필요</option>}</select></label><small>로컬 엔진: 특성 규칙 + 개인 선호 학습. 학습된 대형 언어 모델이 아니며, 실제 음원을 듣거나 맛을 측정하지 않습니다.</small></section>
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
      {selectedCoffee && selectedMusic && (
        <section className="pair-compose" aria-label="고른 한 잔과 한 곡">
          <article className="pair-side coffee">
            <ResonanceAura colors={cupPalette(selectedCoffee, palette)} seedKey={selectedCoffee.bean} rings={4} />
            <div>
              <p className="pair-kind">Coffee</p>
              <h2>{selectedCoffee.bean === "원두 미기록" ? "이날의 한 잔" : selectedCoffee.bean}</h2>
              <small>{[selectedCoffee.roastery, selectedCoffee.date].filter(Boolean).join(" · ")}</small>
              {preview?.coffee?.length > 0 && <p className="pair-clues">{preview.coffee.slice(0, 5).join(" · ")}</p>}
            </div>
          </article>
          <span className="pair-join" aria-hidden="true">×</span>
          <article className="pair-side music">
            <ResonanceAura colors={["#3446C9", "#9AAAFF"]} seedKey={`${selectedMusic.artist}:${selectedMusic.track}`} rings={5} />
            <div>
              <p className="pair-kind">Music</p>
              <h2>{selectedMusic.track}</h2>
              <small>{[selectedMusic.artist, selectedMusic.date].filter(Boolean).join(" · ")}</small>
              {preview?.music?.length > 0 && <p className="pair-clues">{preview.music.slice(0, 5).join(" · ")}</p>}
            </div>
          </article>
        </section>
      )}
      {preview && (
        <section className="pairing-resonance pair-preview" aria-labelledby="pair-preview-title">
          <h3 id="pair-preview-title">저장 전 미리 보기 · 같은 좌표에 놓인 두 감각</h3>
          {preview.error ? (
            <p className="pair-preview-empty">{preview.error}</p>
          ) : (
            <ResonanceChart
              axes={pairAxes}
              caption="고른 커피와 음악의 공명 미리 보기"
              series={[
                { label: "커피", values: preview.vectors.coffee, color: "var(--rs-coffee)", fill: "color-mix(in srgb, var(--rs-coffee) 20%, transparent)" },
                { label: "음악", values: preview.vectors.music, color: "var(--rs-sound)", dashed: true },
              ]}
            />
          )}
        </section>
      )}
      <div className="action-row">
        <Button onClick={handleAnalyze} disabled={saving || !selectedCoffee || !selectedMusic} loading={saving}>{saving ? "분석 중" : "선택한 기록으로 분석"}</Button>
        {message && <span className="muted">{message}</span>}
      </div>
    </PageShell>
  );
}
