import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import CoffeeForm from "../../components/coffee/CoffeeForm.jsx";
import { coffeePayload } from "../../utils/brewDetails.js";
import Tag from "../../components/common/Tag.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { musicApi } from "../../api/musicApi.js";
import { pairingApi } from "../../api/pairingApi.js";

export default function CoffeeWritePage() {
  const navigate = useNavigate();
  const local = import.meta.env.VITE_USE_REAL_API !== "true";
  const [naturalLog, setNaturalLog] = useState(
    local
      ? "오늘 예가체프를 핸드드립으로 진하게 내려 마시면서 시규어 로스를 들었다."
      : "",
  );
  const [coffee, setCoffee] = useState({
    beanName: local ? "에티오피아 예가체프" : "",
    brewMethod: "핸드드립",
    roastLevel: "Light",
    tasteNote: local ? "플로럴, 밝은 산미" : "",
    memo: "",
    drinkDate: new Date().toLocaleDateString("sv-SE"),
    brewDetails: {},
  });
  const [music, setMusic] = useState({
    trackName: local ? "Svefn-g-englar" : "",
    artistName: local ? "Sigur Ros" : "",
    genre: local ? "Post-rock" : "",
    tags: local ? "몽환적, 차분함" : "",
    memo: "",
  });
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [message, setMessage] = useState("");

  const updateCoffee = (key) => (event) =>
    setCoffee((prev) => ({ ...prev, [key]: event.target.value }));
  const updateMusic = (key) => (event) =>
    setMusic((prev) => ({ ...prev, [key]: event.target.value }));

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

  async function handleSaveCoffee() {
    if (!coffee.beanName.trim()) {
      setMessage("원두명을 입력해 주세요.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const item = await coffeeApi.create(coffeePayload(coffee));
      navigate(`/coffee/${item.coffeeLogId || item.coffee_log_id || item.id}`);
    } catch (error) {
      setMessage(error.message || "기록을 저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreatePairing() {
    if (
      !coffee.beanName.trim() ||
      !music.trackName.trim() ||
      !music.artistName.trim()
    ) {
      setMessage("원두명, 곡명, 아티스트를 입력해 주세요.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const analyzed = await pairingApi.analyze({
        coffee,
        music,
        text: naturalLog,
      });
      const today = new Date().toISOString().slice(0, 10);
      const createdCoffee = await coffeeApi.create({
        ...coffeePayload(coffee),
        drinkDate: coffee.drinkDate || today,
      });
      const createdMusic = await musicApi.create({
        ...music,
        albumName: music.albumName || "",
        listenedDate: today,
      });
      const pairing = await pairingApi.create({
        memberId: 1,
        coffeeLogId:
          createdCoffee.coffeeLogId ||
          createdCoffee.coffee_log_id ||
          createdCoffee.id,
        musicLogId:
          createdMusic.musicLogId ||
          createdMusic.music_log_id ||
          createdMusic.id,
        moodSummary: analyzed.moodSummary,
        moodTags: analyzed.moodTags,
        pairingScore: analyzed.pairingScore,
        pairingText: analyzed.pairingText,
        aiReason: analyzed.aiReason,
      });
      navigate(
        `/pairing/${pairing.pairingId || pairing.pairing_id || pairing.id}`,
      );
    } catch (error) {
      setMessage(
        error.message || "저장에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell
      title="오늘의 로그"
      eyebrow="Natural log"
      subtitle="하루의 감각을 한 문장으로 남기면 AI가 커피와 음악 정보를 조용히 정리합니다."
    >
      <div className="today-log-layout">
        <section className="natural-log-panel">
          <span>자연어 입력</span>
          <textarea
            aria-label="오늘의 커피와 음악"
            placeholder="오늘 마신 커피와 들은 음악을 적어보세요."
            className="textarea"
            value={naturalLog}
            onChange={(event) => setNaturalLog(event.target.value)}
          />
          <Button onClick={handleParse} disabled={parsing} loading={parsing}>
            {parsing ? "분석 중" : "AI로 분석하기"}
          </Button>
        </section>

        <section className="analysis-grid">
          <div className="ai-field ai-field-coffee">
            <h3>추출된 커피 정보</h3>
            <CoffeeForm value={coffee} onChange={setCoffee} />
          </div>
          <div className="ai-field ai-field-music">
            <h3>추출된 음악 정보</h3>
            <div className="form-grid">
              <Input
                placeholder="곡명"
                value={music.trackName}
                onChange={updateMusic("trackName")}
              />
              <Input
                placeholder="아티스트"
                value={music.artistName}
                onChange={updateMusic("artistName")}
              />
              <Input
                placeholder="장르"
                value={music.genre}
                onChange={updateMusic("genre")}
              />
              <Input
                placeholder="분위기"
                value={music.tags}
                onChange={updateMusic("tags")}
              />
            </div>
          </div>
          <div className="mood-strip">
            <Tag variant="warm">플로럴</Tag>
            <Tag variant="cool">몽환적</Tag>
            <Tag variant="neutral">집중</Tag>
            <Button
              onClick={handleSaveCoffee}
              disabled={saving}
              loading={saving}
            >
              {saving ? "저장 중" : "커피 기록 저장"}
            </Button>
            <Button
              onClick={handleCreatePairing}
              disabled={saving}
              loading={saving}
            >
              {saving ? "저장 중" : "페어링 생성"}
            </Button>
            {message && <span className="muted">{message}</span>}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
