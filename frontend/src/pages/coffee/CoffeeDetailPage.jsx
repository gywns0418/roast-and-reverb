import { Link, useParams } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import CoffeeSoundtrack from "../../components/coffee/CoffeeSoundtrack.jsx";
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
        {!loading && <Link className="primary-button" to="/coffee/write" state={{repeatCoffee:coffee}}>이 조건으로 다시 내리기</Link>}
        <Link className="ghost-button" to={`/coffee/${id}/edit`}>
          기록·음악·감상 수정
        </Link>
      </div>
      <div className="panel-grid">
        {!loading && <CoffeeLogCard item={coffee} />}
        {pairing ? (
          <PairingCard item={pairing} />
        ) : (
          <p className="brew-hint">
            이 한 잔의 음악과 감상은 아래에서 함께 볼 수 있어요.
          </p>
        )}
      </div>
      {!loading&&<section className="panel" style={{marginTop:24}}><CoffeeSoundtrack key={id} coffee={{beanName:coffee.bean,brewDetails:coffee.brewDetails}} readOnly/></section>}
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
