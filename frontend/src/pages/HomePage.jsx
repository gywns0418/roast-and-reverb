import JournalGuide from "../components/common/JournalGuide.jsx";
import { Link } from "react-router-dom";
import FirstCup from "../components/coffee/FirstCup.jsx";
export default function HomePage() {
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
          r&amp;r<span>ROAST &amp; REVERB</span>
        </Link>
        <Link to="/coffee">내 기록 열기 →</Link>
      </header>
      <main>
        <section className="simple-intro">
          <div>
            <p className="eyebrow">커피 한 잔, 음악 한 곡</p>
            <h1>
              좋았던 커피,
              <br />
              다음에도 고를 수 있게.
            </h1>
            <p className="simple-intro-lead">
              내 말로 남긴 맛을 다시 보고, 다음 원두를 골라요.
              <br />
              음악 한 곡을 더하면 그날의 분위기도 함께 남아요.
            </p>
            <button type="button" className="primary-button" onClick={start}>
              한 줄 남겨보기 <span aria-hidden="true">↓</span>
            </button>
            <small>원두 이름을 몰라도 괜찮아요. 기억나는 느낌부터.</small>
            <div className="consumer-discover">
              <span>아직 마실 커피를 고르는 중인가요?</span>
              <Link to="/monthly-pick">이달의 원두 둘러보기 →</Link>
            </div>
          </div>
          <JournalGuide compact />
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
