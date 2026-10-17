import Loading from "../../components/common/Loading.jsx";
import { listDiaryRecords } from "../../utils/diaryRecords.js";
import { useEffect, useState } from "react";
import { monthlyCatalog } from "../../api/monthlyCatalog.js";
import { Link } from "react-router-dom";
import { Coffee, Headphones, ArrowUpRight, Sparkles } from "lucide-react";
import PageShell from "../../components/common/PageShell.jsx";
import RecordArtwork from "../../components/common/RecordArtwork.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { musicApi } from "../../api/musicApi.js";
import { pairingApi } from "../../api/pairingApi.js";
import {
  adaptCoffeeLog,
  adaptMusicLog,
  adaptPairing,
} from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export default function DashboardPage() {
  const [monthly, setMonthly] = useState(null);
  useEffect(() => {
    monthlyCatalog()
      .then((items) => setMonthly(items[0] || null))
      .catch(() => {});
  }, []);
  const { data: coffees, loading: coffeeLoading } = useApiResource(
    () =>
      listDiaryRecords(coffeeApi.list).then((items) =>
        items.map(adaptCoffeeLog),
      ),
    [],
    [],
  );
  const { data: music, loading: musicLoading } = useApiResource(
    () =>
      listDiaryRecords(musicApi.list).then((items) => items.map(adaptMusicLog)),
    [],
    [],
  );
  const { data: pairs, loading: pairingLoading } = useApiResource(
    () =>
      listDiaryRecords(pairingApi.list).then((items) =>
        items.map(adaptPairing),
      ),
    [],
    [],
  );
  if (coffeeLoading || musicLoading || pairingLoading) return <PageShell title="대시보드" eyebrow="YOUR DAILY RITUAL" subtitle="쌓인 기록을 한눈에 보고, 오늘의 커피와 음악을 이어가세요."><Loading title="나의 기록을 펼치고 있어요." detail="저장한 커피와 음악을 모아 오늘의 시간을 준비합니다." /></PageShell>;
  const recent = [
    ...coffees.map((item) => ({
      ...item,
      kind: "coffee",
      title: item.bean,
      detail: [item.brew, item.roastery].filter(Boolean).join(" · "),
      path: `/coffee/${item.id}`,
    })),
    ...music.map((item) => ({
      ...item,
      kind: "music",
      title: item.track,
      detail: item.artist,
      path: `/music/${item.id}`,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);
  const last = [...pairs].sort((a, b) => b.date.localeCompare(a.date))[0];
  const latestCoffee = [...coffees].sort((a, b) =>
    b.date.localeCompare(a.date),
  )[0];
  const latestMusic = [...music].sort((a, b) =>
    b.date.localeCompare(a.date),
  )[0];
  const days = new Set(
    [...coffees, ...music].map((item) => item.date).filter(Boolean),
  ).size;
  const loading=coffeeLoading||musicLoading||pairingLoading;
  const isNew=!coffees.length&&!music.length;
  return (
    <PageShell
      title="대시보드"
      eyebrow="YOUR DAILY RITUAL"
      subtitle="쌓인 기록을 한눈에 보고, 오늘의 커피와 음악을 이어가세요."
    >
      <div className="metric-strip" role="group" aria-label="기록 현황">
        {[
          ["커피 기록", coffees.length, "cups", Coffee, "/coffee"],
          ["음악 기록", music.length, "tracks", Headphones, "/music"],
          ["연결한 페어링", pairs.length, "pairs", Sparkles, "/pairing"],
          ["기록한 날", days, "days", ArrowUpRight, "/report/monthly"],
        ].map(([label, value, unit, Icon, destination]) => (
          <Link className="metric" key={label} to={destination} aria-label={`${label} ${loading?"조회 중":value} · 자세히 보기`}>
            <span>
              <Icon size={16} />
              {label}
            </span>
            <strong>
              {loading?"—":value}
              <small>{unit}</small>
            </strong>
          </Link>
        ))}
      </div>
      <div className="dashboard-hero">
        <div className="session-copy">
          <p className="eyebrow">BREW & LISTEN / DAILY SESSION</p>
          <h2>{loading?'오늘의 시간을 준비해요.':isNew?'처음이라면, 짧은 가이드부터.':'지난 기록에서, 오늘의 한 잔으로.'}</h2>
          <p>{loading?'저장한 커피와 음악 기록을 확인하고 있어요.':isNew?'약 8분 동안 한 잔과 한 곡을 살펴보고, 좋았던 이유 한 줄을 남겨보세요.':'새 기록을 남기거나 아래 최근의 순간들을 다시 열어보세요. 직접 남긴 감상이 다음 선택의 단서가 됩니다.'}</p>
          <div className="action-row">
            <Link to={isNew?"/journey":"/coffee/write"} className="primary-button">
              {isNew?"첫 감상 가이드 시작":"오늘의 한 잔 기록"} <ArrowUpRight size={17} />
            </Link>
            <Link to={isNew?"/ritual":"/music/write"} className="session-secondary">
              {isNew?"청음실 둘러보기 ↗":"음악 기록하기 ↗"}
            </Link>
          </div>
        </div>
        <div className="dashboard-photo">
          <img
            src={`${import.meta.env.BASE_URL}images/ritual-editorial.png`}
            alt="커피와 레코드, 헤드폰이 놓인 브랜드 장면"
          />
          <span>BREW / LISTEN / REPEAT</span>
        </div>
      </div>
      {monthly && (
        <Link className="monthly-discover" to="/monthly-pick">
          <div className="discover-date">
            {monthly.month.slice(5)}
            <small>MONTHLY EDIT</small>
          </div>
          <div>
            <p>이번 달의 새로운 취향</p>
            <h3>
              {monthly.roastery} · {monthly.items.length}개의 원두
            </h3>
            <span>컵노트와 가격을 살펴보고, 다음 한 잔을 골라보세요.</span>
          </div>
          <span className="discover-arrow">
            <ArrowUpRight size={25} />
          </span>
        </Link>
      )}
      <div className="dashboard-body">
        <section className="journal-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE JOURNAL</p>
              <h2>최근의 순간들</h2>
            </div>
            <Link to="/coffee">모든 커피 기록 ↗</Link>
          </div>
          <Link className="dashboard-room-entry" to="/ritual"><span>TODAY IN YOUR LISTENING ROOM</span><strong>내 취향을 기억하는 한 잔의 시간</strong><small>나의 청음실 열기 ↗</small></Link>
          {loading?<p role="status">기록을 불러오고 있어요…</p>:recent.length ? (
            recent.map((item) => (
              <Link
                key={`${item.kind}-${item.id}`}
                to={item.path}
                className="journal-entry"
              >
                <div className={`entry-icon ${item.kind}`}>
                  {item.kind === "coffee" ? (
                    <Coffee size={22} />
                  ) : (
                    <Headphones size={22} />
                  )}
                </div>
                <div>
                  <span className="entry-date">
                    {item.date} / {item.kind === "coffee" ? "COFFEE" : "MUSIC"}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.detail || "나의 취향 기록"}</p>
                </div>
                <ArrowUpRight size={18} />
              </Link>
            ))
          ) : (
            <EmptyState>
              아직 첫 기록이 없어요. 오늘 마신 커피부터 남겨보세요.
            </EmptyState>
          )}
          <Link className="journal-add" to="/coffee/write">
            + 새로운 순간 기록하기
          </Link>
        </section>
        <aside className="dashboard-aside">
          <section className="latest-session">
            <p className="eyebrow">LAST PAIRING</p>
            <h2>함께 남은 여운</h2>
            {last ? (
              <>
                <RecordArtwork kind="blend" seed={last.artist} />
                <h3>{last.coffee}</h3>
                <p>
                  {last.artist} — {last.music}
                </p>
                <blockquote>{last.text || last.mood}</blockquote>
                <Link to={`/pairing/${last.id}`}>페어링 자세히 보기 ↗</Link>
              </>
            ) : (
              <>
                <RecordArtwork kind="blend" />
                <p>한 잔과 한 곡을 골라 첫 조합을 연결해보세요.</p>
                <Link to="/pairing/write">첫 페어링 만들기 ↗</Link>
              </>
            )}
          </section>
        </aside>
      </div>
      <div className="two-sides">
        {[
          [
            "SIDE A / LAST BREW",
            latestCoffee?.bean || "나의 다음 한 잔",
            latestCoffee?.memo ||
              "원두, 추출 조건, 식은 뒤의 맛까지 남겨보세요.",
            "coffee",
            latestCoffee ? `/coffee/${latestCoffee.id}` : "/coffee/write",
          ],
          [
            "SIDE B / LAST LISTEN",
            latestMusic?.track || "나의 다음 한 곡",
            latestMusic
              ? [latestMusic.artist, latestMusic.memo]
                  .filter(Boolean)
                  .join(" · ")
              : "오늘의 기분에 머무른 곡을 기록해보세요.",
            "music",
            latestMusic ? `/music/${latestMusic.id}` : "/music/write",
          ],
        ].map(([label, title, note, kind, path]) => (
          <Link className={`side-feature ${kind}`} to={path} key={kind}>
            <RecordArtwork kind={kind} seed={title} small />
            <div>
              <p className="eyebrow">{label}</p>
              <h3>{title}</h3>
              <p>{note}</p>
              <span>기록 열기 ↗</span>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
