import {authStore} from '../store/authStore.js';
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
  const start = () => (local||authStore.token ? navigate("/journey") : setAuthMode("join"));
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
              좋았던 커피와 음악, 다음에도 고르고 싶다면.
              <br />
              짧은 감상 가이드와 기록으로 나만의 선택 기준을 만드세요.
            </p>
            <button className="studio-cta" onClick={start}>
              오늘의 8분 가이드 시작하기
              <ArrowUpRight size={22} />
            </button>
            <p className="studio-caption">
              {local
                ? "가입 없이 시작해요 · 발견과 기록은 이 브라우저에 저장됩니다"
                : "커피 × 음악, 나를 알아가는 작은 습관"}
            </p>
            <ul className="flow-benefits" aria-label="시작하면 할 수 있는 일">
              <li><b>감각을 발견해요</b><span>약 8분 가이드부터 가볍게</span></li>
              <li><b>내 말로 남겨요</b><span>좋았던 이유를 한 줄로</span></li>
              <li><b>다음에 꺼내 써요</b><span>지난 발견 비교와 청음실 취향 반영</span></li>
            </ul>
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
<section className="studio-intro"><p className="studio-eyebrow">SEVEN SMALL DISCOVERIES</p><h2>추천을 받는 것에서,<br/>좋아하는 이유를 아는 것으로.</h2><p>향과 여운, 질감과 리듬.<br/>일곱 가지 감상 가이드와 나만의 발견 노트를 통해<br/>다음 한 잔과 한 곡을 고르는 기준을 만들어보세요.</p><Link className="ghost-button" to="/journey">감상 가이드 살펴보기 ↗</Link></section>
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
            나의 취향 여정 시작하기 <ArrowRight size={22} />
          </button>
        </section>
      </main>
      <footer className="studio-footer">
        <strong>Roast & Reverb</strong>
        <span>매일 조금씩, 취향이 되는 순간들.</span>
        <Link to="/help">이용 도움말</Link><span>© {new Date().getFullYear()} R&R</span>
      </footer>
      {authMode && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setAuthMode(null)}
          onAuthenticated={() => navigate("/ritual")}
        />
      )}
    </div>
  );
}
