import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import CoffeeLogCard from "../../components/coffee/CoffeeLogCard.jsx";
import MusicCard from "../../components/music/MusicCard.jsx";
import { coffeeLogs, musicLogs } from "../../data/sampleData.js";

export default function PairingWritePage() {
  return (
    <PageShell title="AI 페어링 생성" eyebrow="Analyze" subtitle="커피 로그와 음악 로그를 선택해 AI 인사이트를 생성합니다.">
      <div className="compose-layout">
        <CoffeeLogCard item={coffeeLogs[0]} />
        <MusicCard item={musicLogs[0]} />
      </div>
      <div className="action-row">
        <Button>선택한 기록으로 분석</Button>
      </div>
    </PageShell>
  );
}
