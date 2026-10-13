import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Coffee,
  Headphones,
  Sparkles,
} from "lucide-react";
import AuthModal from "../components/auth/AuthModal.jsx";
export default function HomePage() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(null);
  const local = import.meta.env.VITE_USE_REAL_API !== "true";
  const start = () => (local ? navigate("/dashboard") : setAuthMode("join"));
  return (
    <div className="studio-home">
      <header className="studio-nav">
        <Link to="/" className="studio-brand">
          r&r<span>ROAST & REVERB</span>
        </Link>
        <nav>
          <button
            type="button"
            onClick={() => document.getElementById("ritual")?.scrollIntoView()}
          >
            서비스 소개
          </button>
          <button
            type="button"
            onClick={() => document.getElementById("notes")?.scrollIntoView()}
          >
            기록하는 방법
          </button>
          {!local && (
            <button onClick={() => setAuthMode("login")}>
              로그인 <ArrowUpRight size={16} />
            </button>
          )}
        </nav>
      </header>
      <main>
        <section className="studio-hero">
          <div className="studio-copy">
            <p className="studio-eyebrow">
              ● &nbsp; A LITTLE RITUAL, EVERY DAY
            </p>
            <h1>
              한 잔의 취향.
              <br />한 곡의 <em>여운.</em>
            </h1>
            <p className="studio-lead">
              마신 커피와 들은 음악, 그 순간의 기분까지.
              <br />
              흩어진 취향을 모아 나만의 리듬을 발견하세요.
            </p>
            <button className="studio-cta" onClick={start}>
              {local ? "기록장 체험하기" : "나의 첫 기록 남기기"}
              <ArrowUpRight size={22} />
            </button>
            <p className="studio-caption">
              {local
                ? "체험 데이터로 둘러보세요 · 이 브라우저에 저장됩니다"
                : "커피 × 음악, 나를 알아가는 작은 습관"}
            </p>
          </div>
          <div
            className="studio-art"
            role="img"
            aria-label="햇살 아래 커피와 레코드, 헤드폰이 놓인 장면"
            style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/ritual-editorial.png)` }}
          >
            <span className="art-edition">THE DAILY SESSION / 001</span>
            <div className="art-record">
              <div className="record-label">
                r&r
                <br />
                <small>SIDE A · SLOW MORNING</small>
              </div>
            </div>
            <div className="art-sleeve">
              <span>
                ROAST
                <br />& REVERB
              </span>
              <div className="sleeve-wave">〰</div>
              <small>NOTES FOR A SLOW MORNING</small>
            </div>
            <div className="art-cup">
              <div />
            </div>
            <div className="art-note">
              Ethiopia, washed.
              <br />
              Bill Evans, on repeat.
            </div>
            <span className="art-bottom">
              GOOD COFFEE. GOOD MUSIC. YOUR STORY.
            </span>
          </div>
        </section>
        <div className="studio-strip">
          <span>BREW.</span>
          <span>LISTEN.</span>
          <span>FEEL.</span>
          <span>REMEMBER.</span>
          <Coffee size={22} />
        </div>
        <section id="ritual" className="studio-intro">
          <p className="studio-eyebrow">YOUR TASTE, CONNECTED</p>
          <h2>
            좋아하는 것들은
            <br />
            서로 닮아 있으니까.
          </h2>
          <p>
            산뜻한 산미에 어울리는 가벼운 재즈.
            <br />
            묵직한 바디와 오래 머무는 베이스.
            <br />
            일상의 기록에서 당신만의 조합을 찾아갑니다.
          </p>
        </section>
        <section id="notes" className="studio-steps">
          {[
            [
              Coffee,
              "01",
              "한 잔을 기록하고",
              "원두, 추출 방식, 맛과 향. 오늘의 컵을 당신의 언어로 남기세요.",
            ],
            [
              Headphones,
              "02",
              "한 곡을 더하고",
              "그때 듣던 음악과 기분을 함께 적어두세요.",
            ],
            [
              Sparkles,
              "03",
              "취향을 연결해요",
              "페어링과 월간 리포트로 반복되는 취향을 발견하세요.",
            ],
          ].map(([Icon, n, title, copy]) => (
            <article key={n}>
              <div>
                <Icon size={25} />
                <span>{n}</span>
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </section>
        <section className="studio-closing">
          <p>오늘의 커피에는 어떤 음악이 어울릴까요?</p>
          <button onClick={start}>
            내 기록장 열기 <ArrowRight size={22} />
          </button>
        </section>
      </main>
      <footer className="studio-footer">
        <strong>Roast & Reverb</strong>
        <span>매일 조금씩, 취향이 되는 순간들.</span>
        <span>© {new Date().getFullYear()} R&R</span>
      </footer>
      {authMode && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setAuthMode(null)}
          onAuthenticated={() => navigate("/dashboard")}
        />
      )}
    </div>
  );
}
