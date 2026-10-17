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
        <section id="ritual" className="home-discovery">
          <div className="home-discovery-copy">
          <p className="studio-eyebrow">YOUR TASTE, CONNECTED</p>
          <h2>
            좋았던 한 잔,
            <br />
            다음에도 고를 수 있도록.
          </h2>
          <p>
            무슨 원두였는지, 어떻게 내렸는지 잊곤 하나요?
            커피와 어울린 음악, 그날의 감상을 한곳에 남겨보세요.
            다음 한 잔은 지난 기록에서 시작할 수 있어요.
          </p>
          <button className="studio-cta" onClick={start}>내 취향 알아보기 <ArrowUpRight size={20}/></button>
          </div>
          <div className="home-session-preview" aria-label="커피와 감상을 기록하는 방법">
            <p className="studio-eyebrow">ONE CUP, YOUR OWN WORDS</p>
            <h3>한 잔에 담는 세 가지</h3>
            <dl><div><dt><Coffee size={20}/> 커피</dt><dd>원두와 추출 조건을 남겨요.</dd></div><div><dt><Headphones size={20}/> 음악</dt><dd>어울리는 곡을 고르거나 연주를 만들어요.</dd></div><div><dt><Sparkles size={20}/> 나의 감상</dt><dd>직접 느낀 맛과 여운을 한 줄로 적어요.</dd></div></dl>
            <p className="home-preview-note">커피만 기록해도 괜찮아요. 음악과 감상은 원할 때 더하세요.</p>
          </div>
        </section>
        <section className="home-guide"><div><p className="studio-eyebrow">SEVEN SMALL DISCOVERIES</p><h2>무엇을 적을지 막막하다면,<br/>8분 가이드부터.</h2><p>향 하나, 음악의 느낌 하나. 질문을 따라 적다 보면 나만의 선택 기준이 남습니다.</p></div><Link className="ghost-button" to="/journey">감상 가이드 살펴보기 <ArrowUpRight size={18}/></Link></section>
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
              "어울리는 곡을 고르고, 실제로 들어본 느낌을 남겨요. 음악은 나중에 더해도 좋아요.",
            ],
            [
              Sparkles,
              "03",
              "다음 한 잔으로 이어가요",
              "지난 추출 조건을 불러와 바꾼 점을 비교하고, 나에게 맞는 한 잔을 찾아가요.",
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
      <a href={`${import.meta.env.BASE_URL}privacy.html`}>개인정보처리방침</a></footer>
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
