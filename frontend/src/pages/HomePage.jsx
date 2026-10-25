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
              좋았던 한 잔을
              <br />
              기억하는 작은 습관.
            </h1>
            <p className="simple-intro-lead">
              오늘 마신 커피의 느낌을 한 줄로 남겨요.
              <br />
              함께 듣고 싶은 음악은 그다음에 골라도 좋아요.
            </p>
            <button type="button" className="primary-button" onClick={start}>
              한 줄 남겨보기 <span aria-hidden="true">↓</span>
            </button>
            <small>커피 지식도, 긴 설명도 필요 없어요.</small>
          </div>
          <img
            src={import.meta.env.BASE_URL + "images/ritual-editorial.png"}
            alt="커피와 레코드가 함께 놓인 따뜻한 테이블"
          />
        </section>
        <section className="simple-how" aria-label="사용 방법">
          <p>
            <b>01</b> 커피의 느낌을 적고
          </p>
          <span aria-hidden="true">→</span>
          <p>
            <b>02</b> 음악을 더하고 싶다면 고르고
          </p>
          <span aria-hidden="true">→</span>
          <p>
            <b>03</b> 나만의 기록으로 보관해요
          </p>
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
