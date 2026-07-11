import PageShell from "../../components/common/PageShell.jsx";
import MusicCard from "../../components/music/MusicCard.jsx";
import PairingCard from "../../components/pairing/PairingCard.jsx";
import { musicLogs, pairings } from "../../data/sampleData.js";

export default function MusicDetailPage() {
  return (
    <PageShell title="음악 기록 상세" eyebrow="Music detail" subtitle="앨범 정보와 이 음악에 연결된 커피 페어링을 확인합니다.">
      <div className="panel-grid">
        <MusicCard item={musicLogs[0]} />
        <PairingCard item={pairings[0]} />
      </div>
    </PageShell>
  );
}
