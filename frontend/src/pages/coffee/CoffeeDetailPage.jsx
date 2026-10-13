import { Link, useParams } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import CoffeeLogCard from "../../components/coffee/CoffeeLogCard.jsx";
import PairingCard from "../../components/pairing/PairingCard.jsx";
import { coffeeLogs } from "../../data/sampleData.js";
import { coffeeApi } from "../../api/coffeeApi.js";
import { pairingApi } from "../../api/pairingApi.js";
import { adaptCoffeeLog, adaptPairing } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export default function CoffeeDetailPage() {
  const { id } = useParams();
  const fallbackCoffee = adaptCoffeeLog(
    coffeeLogs.find((item) => String(item.id) === String(id)) || coffeeLogs[0],
  );

  const { data: coffee, loading } = useApiResource(
    () => coffeeApi.detail(id).then(adaptCoffeeLog),
    fallbackCoffee,
    [id],
  );
  const { data: relatedPairings } = useApiResource(
    () =>
      pairingApi
        .list()
        .then((items) =>
          items.map(adaptPairing).filter((item) => item.coffee === coffee.bean),
        ),
    [],
    [id, coffee.bean],
  );
  const pairing = relatedPairings[0];
  const morePairings =
    relatedPairings.length > 1 ? relatedPairings.slice(1) : [];

  return (
    <PageShell
      title="커피 기록 상세"
      eyebrow="Coffee detail"
      subtitle="커피 정보와 연결된 음악, AI 페어링 문장을 함께 확인합니다."
    >
      <div className="action-row">
        <Link className="ghost-button" to={`/coffee/${id}/edit`}>
          기록 수정
        </Link>
        <Link className="ghost-button" to="/pairing/write">
          내 음악과 연결하기
        </Link>
      </div>
      <div className="panel-grid">
        {!loading && <CoffeeLogCard item={coffee} />}
        {pairing ? (
          <PairingCard item={pairing} />
        ) : (
          <p className="brew-hint">
            아직 음악과 연결하지 않은 커피입니다. 실제로 들은 곡을 골라 페어링해
            보세요.
          </p>
        )}
      </div>
      {morePairings.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <div className="ledger-head">
            <span className="book smcp">이 원두로 만든 다른 페어링</span>
            <span className="vol oldnum">{morePairings.length}건 더</span>
          </div>
          <div className="card-grid" style={{ marginTop: 14 }}>
            {morePairings.map((item) => (
              <PairingCard item={item} key={item.id} />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
