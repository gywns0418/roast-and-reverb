import { Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import PairingCard from "../../components/pairing/PairingCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { pairings } from "../../data/sampleData.js";
import { pairingApi } from "../../api/pairingApi.js";
import { adaptPairing } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export default function PairingPage() {
  const fallback = pairings.map(adaptPairing);
  const { data: items } = useApiResource(
    () => pairingApi.list().then((result) => result.map(adaptPairing)),
    fallback,
    []
  );

  return (
    <PageShell title="AI 페어링" eyebrow="Signal Read" subtitle="커피와 음악, 두 신호가 만난 기록을 확인하고 보관합니다.">
      <div className="action-row">
        <Link to="/pairing/write" className="primary-button">페어링 생성</Link>
      </div>
      {items.length === 0
        ? <EmptyState>아직 페어링 기록이 없어요.</EmptyState>
        : (
          <div className="card-grid">
            {items.map((item) => <PairingCard item={item} key={item.id} />)}
          </div>
        )}
    </PageShell>
  );
}
