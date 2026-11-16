import ResonanceAura from "../components/visual/ResonanceAura.jsx";
import TasteSpectrum from "../components/visual/TasteSpectrum.jsx";
import { useApiResource } from "../hooks/useApiResource.js";
import { useCupPalette } from "../hooks/useCupPalette.js";
import { coffeeApi } from "../api/coffeeApi.js";
import { adaptCoffeeLog } from "../api/adapters.js";
import { listDiaryRecords } from "../utils/diaryRecords.js";
import { spectrumOf } from "../utils/cupColor.js";
import { Link, Navigate, useLocation } from "react-router-dom";
import { hasDiaryRecords } from "../utils/diaryStorage.js";
import FirstCup from "../components/coffee/FirstCup.jsx";
export default function HomePage() {
  const { pathname } = useLocation();
  const returning = pathname === "/" && hasDiaryRecords();
  const { data: records } = useApiResource(() => listDiaryRecords(coffeeApi.list).then((rows) => rows.map(adaptCoffeeLog)), [], []);
  const palette = useCupPalette();
  const spectrum = spectrumOf(records || [], palette);
  if (returning) return <Navigate to="/dashboard" replace />;
  function start() {
    document
      .getElementById("first-cup-start")
      ?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    document
      .querySelector("#first-cup-start textarea")
      ?.focus({ preventScroll: true });
  }
  return (
    <div className="studio-home simple-home">
      <header className="first-home-nav">
        <Link to="/" className="first-home-brand">
          R&amp;R<span>ROAST &amp; REVERB</span>
        </Link>
        <Link to="/dashboard">내 홈 열기 →</Link>
      </header>
      <main>
        <section className="simple-intro">
          <div>
            <p className="eyebrow">Taste in resonance</p>
            <h1>
              마신 커피가 쌓이면,
              <br />
              <em>내 취향</em>이 보여요.
            </h1>
            <p className="simple-intro-lead">
              한 잔마다 느낌을 남기고 다시 마시고 싶은지 답하세요.
              <br />
              매달 바뀌는 로스터리의 월픽으로 그 취향을 확인해요.
            </p>
            <button type="button" className="primary-button" onClick={start}>
              한 줄 남겨보기 <span aria-hidden="true">↓</span>
            </button>
            <small>원두 이름을 몰라도 괜찮아요. 기억나는 느낌부터.</small>
            <ol className="home-loop" aria-label="Roast & Reverb를 쓰는 순서">
              <li><b>01</b><strong>한 줄 남기기</strong>원두 이름을 몰라도 느낌부터</li>
              <li><b>02</b><strong>다시 마실지 답하기</strong>좋았던 맛이 쌓여 취향이 돼요</li>
              <li><b>03</b><strong>월픽으로 확인하기</strong>매달 다른 로스터리에서 닮은 원두</li>
            </ol>
            <div className="consumer-discover">
              <span>아직 마실 커피를 고르는 중인가요?</span>
              <Link to="/monthly-pick">이달의 원두 둘러보기 →</Link>
            </div>
          </div>
          <figure className="home-aura-figure">
            {spectrum.length ? (
              <>
                <TasteSpectrum spectrum={spectrum} label={`지금까지 마신 ${records.length}잔의 색 ${spectrum.length}가지를 합친 그림`} />
                <figcaption>지금까지 마신 {records.length}잔에서 모은 {spectrum.length}가지 색이에요. 같은 원두는 언제나 같은 색, 자주 마신 색일수록 크게 번져요.</figcaption>
              </>
            ) : (
              <>
                <ResonanceAura seedKey="home" label="아직 기록이 없어 윤곽만 보이는 오라" />
                <figcaption>기록이 쌓이면 이 윤곽이 내가 마신 커피의 색으로 채워져요. 같은 원두는 언제나 같은 색이에요.</figcaption>
              </>
            )}
          </figure>
        </section>
        <div id="first-cup-start" className="simple-start">
          <FirstCup />
          <p className="simple-return">
            이미 남긴 한 잔이 있나요?{" "}
            <Link to="/coffee">내 기록에서 이어보기 →</Link>
          </p>
        </div>
      </main>
      <footer className="first-home-footer">
        <strong>Roast &amp; Reverb</strong>
        <span>한 잔의 취향. 한 곡의 여운.</span>
        <Link to="/help">도움말</Link>
        <a href={import.meta.env.BASE_URL + "privacy.html"}>개인정보처리방침</a>
      </footer>
    </div>
  );
}
