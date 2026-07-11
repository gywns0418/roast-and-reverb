import PageShell from "../../components/common/PageShell.jsx";
import PairingCard from "../../components/pairing/PairingCard.jsx";
import { pairings } from "../../data/sampleData.js";

export default function PairingPage() {
  return (
    <PageShell title="AI 페어링" eyebrow="Signal Read" subtitle="커피와 음악, 두 신호가 만난 기록을 확인하고 보관합니다.">
      <div className="card-grid">
        {pairings.map((item) => <PairingCard item={item} key={item.id} />)}
      </div>
    </PageShell>
  );
}
