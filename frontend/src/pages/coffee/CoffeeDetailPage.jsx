import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Loading from "../../components/common/Loading.jsx";
import BrewDetails from "../../components/coffee/BrewDetails.jsx";
import CoffeeSoundtrack from "../../components/coffee/CoffeeSoundtrack.jsx";
import BrewPlaylist from "../../components/music/BrewPlaylist.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { adaptCoffeeLog } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";
import { readSoundtrack } from "../../utils/coffeeSoundtrack.js";
import VerdictPicker from "../../components/coffee/VerdictPicker.jsx";
import { saveCoffeeVerdict } from "../../api/verdictApi.js";
import { verdictOf } from "../../utils/tasteProfile.js";
function DetailVerdict({ id, cup }) {
  const [verdict, setVerdict] = useState(verdictOf(cup));
  const [state, setState] = useState({ busy: false, message: "", error: "" });
  async function change(next) {
    const previous = verdict;
    setVerdict(next);
    setState({ busy: true, message: "", error: "" });
    try {
      await saveCoffeeVerdict(id, next);
      setState({ busy: false, message: next ? "판단을 저장했어요. 나의 취향에 반영돼요." : "판단을 지웠어요.", error: "" });
    } catch (e) {
      setVerdict(previous);
      setState({ busy: false, message: "", error: e.message || "판단을 저장하지 못했어요. 기록은 그대로예요." });
    }
  }
  return (
    <section className="quiet-section detail-verdict">
      <VerdictPicker value={verdict} onChange={change} disabled={state.busy} />
      {state.message && <p role="status">{state.message} <Link to="/taste">나의 취향 보기 →</Link></p>}
      {state.error && <p role="alert" className="resource-error">{state.error}</p>}
    </section>
  );
}
export default function CoffeeDetailPage() {
  const { id } = useParams();
  const { data: cup, loading } = useApiResource(
    () => coffeeApi.detail(id).then(adaptCoffeeLog),
    {},
    [id],
  );
  if (loading)
    return (
      <PageShell title="한 잔의 기록">
        <Loading title="기록을 펼치고 있어요." />
      </PageShell>
    );
  const song = readSoundtrack(cup.brewDetails?.soundtrack);
  return (
    <PageShell
      title={cup.bean === "원두 미기록" ? "이날의 한 잔" : cup.bean}
      subtitle={cup.date}
    >
      <Link className="quiet-back" to="/coffee">
        ← 내 기록
      </Link>
      <article className="quiet-note">
        <p className="quiet-note-copy">
          {cup.brewDetails?.momentNote ||
            cup.memo ||
            "남긴 감상이 없어요. 기억나는 느낌을 더해보세요."}
        </p>
        <Link className="primary-button" to={"/coffee/" + id + "/edit"}>
          기록 수정하기
        </Link>
      </article>
      {cup.id !== undefined && <DetailVerdict key={id} id={id} cup={cup} />}
      {song && (
        <section className="quiet-section">
          <h2>함께 남긴 음악</h2>
          {song.kind === "generated" ? (
            <CoffeeSoundtrack
              coffee={{ beanName: cup.bean, brewDetails: cup.brewDetails }}
              readOnly
            />
          ) : (
            <BrewPlaylist
              tracks={[song]}
              title={song.track}
              continuous={false}
            />
          )}
        </section>
      )}
      <details className="quiet-details">
        <summary>원두와 추출 정보 보기</summary>
        <dl className="quiet-facts">
          {[
            ["로스터리", cup.roastery],
            ["산지", cup.origin],
            ["가공", cup.process],
            ["내린 방법", cup.brew],
            ["로스팅", cup.roast],
          ]
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
        </dl>
        <BrewDetails
          details={cup.brewDetails || {}}
          waterTemp={cup.waterTemp}
          grindSize={cup.grindSize}
          brewTime={cup.brewTime}
        />
        <Link to="/coffee/write" state={{ repeatCoffee: cup }}>
          이 추출 조건으로 새 한 잔 남기기 →
        </Link>
      </details>
      <div className="quiet-next">
        <p>다음 한 잔도 기억해둘까요?</p>
        <Link to="/dashboard">오늘의 한 잔으로 →</Link>
      </div>
    </PageShell>
  );
}
