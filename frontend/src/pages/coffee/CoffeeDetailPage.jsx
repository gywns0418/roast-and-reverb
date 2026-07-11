import PageShell from "../../components/common/PageShell.jsx";
import CoffeeLogCard from "../../components/coffee/CoffeeLogCard.jsx";
import PairingCard from "../../components/pairing/PairingCard.jsx";
import { coffeeLogs, pairings } from "../../data/sampleData.js";

export default function CoffeeDetailPage() {
  return (
    <PageShell title="커피 기록 상세" eyebrow="Coffee detail" subtitle="커피 정보와 연결된 음악, AI 페어링 문장을 함께 확인합니다.">
      <div className="panel-grid">
        <CoffeeLogCard item={coffeeLogs[0]} />
        <PairingCard item={pairings[0]} />
      </div>
    </PageShell>
  );
}
