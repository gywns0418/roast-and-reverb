import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Tag from "../../components/common/Tag.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { musicApi } from "../../api/musicApi.js";
import { pairingApi } from "../../api/pairingApi.js";

export default function CoffeeWritePage() {
  const navigate = useNavigate();
  const [naturalLog, setNaturalLog] = useState("오늘 예가체프를 핸드드립으로 진하게 내려 마시면서 시규어 로스를 들었다.");
  const [coffee, setCoffee] = useState({
    beanName: "에티오피아 예가체프",
    brewMethod: "핸드드립",
    roastLevel: "Light",
    tasteNote: "플로럴, 밝은 산미",
    memo: "플로럴, 밝은 산미"
  });
  const [music, setMusic] = useState({
    trackName: "Svefn-g-englar",
    artistName: "Sigur Ros",
    genre: "Post-rock",
    tags: "몽환적, 차분함",
    memo: "몽환적, 차분함"
  });
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [message, setMessage] = useState("");

  const updateCoffee = (key) => (event) => setCoffee((prev) => ({ ...prev, [key]: event.target.value }));
  const updateMusic = (key) => (event) => setMusic((prev) => ({ ...prev, [key]: event.target.value }));

  async function handleParse() {
    setParsing(true);
    setMessage("");
    try {
      const parsed = await pairingApi.parseNaturalLog({ text: naturalLog });
      setCoffee((prev) => ({ ...prev, ...parsed.coffee }));
      setMusic((prev) => ({ ...prev, ...parsed.music }));
      setMessage("구조화된 정보를 확인해보세요.");
    } catch {
      setMessage("분석 서버에 연결되지 않아 현재 입력값을 유지합니다.");
    } finally {
      setParsing(false);
    }
  }

  async function handleCreatePairing() {
    setSaving(true);
    setMessage("");
    try {
      const today = new Date().toISOString().slice(0, 10);
      const createdCoffee = await coffeeApi.create({
        ...coffee,
        acidity: 4,
        sweetness: 4,
        bitterness: 2,
        body: 3,
        aroma: 4,
        drinkDate: today
      });
      const createdMusic = await musicApi.create({
        ...music,
        albumName: music.albumName || "",
        listenedDate: today
      });
      const analyzed = await pairingApi.analyze({ coffee, music, text: naturalLog });
      const pairing = await pairingApi.create({
        memberId: 1,
        coffeeLogId: createdCoffee.coffeeLogId || createdCoffee.coffee_log_id || createdCoffee.id,
        musicLogId: createdMusic.musicLogId || createdMusic.music_log_id || createdMusic.id,
        moodSummary: analyzed.moodSummary,
        moodTags: analyzed.moodTags,
        pairingScore: analyzed.pairingScore,
        pairingText: analyzed.pairingText,
        aiReason: analyzed.aiReason
      });
      navigate(`/pairing/${pairing.pairingId || pairing.pairing_id || pairing.id}`);
    } catch (error) {
      setMessage("저장에 실패했습니다. 백엔드 서버가 켜져 있는지 확인해주세요.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell title="오늘의 로그" eyebrow="Natural log" subtitle="하루의 감각을 한 문장으로 남기면 AI가 커피와 음악 정보를 조용히 정리합니다.">
      <div className="today-log-layout">
        <section className="natural-log-panel">
          <span>자연어 입력</span>
          <textarea className="textarea" value={naturalLog} onChange={(event) => setNaturalLog(event.target.value)} />
          <Button onClick={handleParse} disabled={parsing} loading={parsing}>{parsing ? "분석 중" : "AI로 분석하기"}</Button>
        </section>

        <section className="analysis-grid">
          <div className="ai-field ai-field-coffee">
            <h3>추출된 커피 정보</h3>
            <div className="form-grid">
              <Input placeholder="원두명" value={coffee.beanName} onChange={updateCoffee("beanName")} />
              <Input placeholder="추출 방식" value={coffee.brewMethod} onChange={updateCoffee("brewMethod")} />
              <Input placeholder="로스팅" value={coffee.roastLevel} onChange={updateCoffee("roastLevel")} />
              <Input placeholder="무드" value={coffee.tasteNote} onChange={updateCoffee("tasteNote")} />
            </div>
          </div>
          <div className="ai-field ai-field-music">
            <h3>추출된 음악 정보</h3>
            <div className="form-grid">
              <Input placeholder="곡명" value={music.trackName} onChange={updateMusic("trackName")} />
              <Input placeholder="아티스트" value={music.artistName} onChange={updateMusic("artistName")} />
              <Input placeholder="장르" value={music.genre} onChange={updateMusic("genre")} />
              <Input placeholder="분위기" value={music.tags} onChange={updateMusic("tags")} />
            </div>
          </div>
          <div className="mood-strip">
            <Tag variant="warm">플로럴</Tag>
            <Tag variant="cool">몽환적</Tag>
            <Tag variant="neutral">집중</Tag>
            <Button onClick={handleCreatePairing} disabled={saving} loading={saving}>{saving ? "저장 중" : "페어링 생성"}</Button>
            {message && <span className="muted">{message}</span>}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
