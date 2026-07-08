import PageShell from "../../components/common/PageShell.jsx";
import Tag from "../../components/common/Tag.jsx";
import { coffeeLogs, musicLogs, pairings } from "../../data/sampleData.js";

export default function DashboardPage() {
  return (
    <PageShell title="대시보드" eyebrow="Today" subtitle="오늘의 커피, 음악, AI 페어링 흐름을 한눈에 봅니다.">
      <div className="dashboard-grid">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">AI pairing insight</p>
            <h2>{pairings[0].coffee} × {pairings[0].music}</h2>
            <p>{pairings[0].text}</p>
          </div>
          <strong>{pairings[0].score}</strong>
        </section>
        <section className="panel">
          <h3>최근 커피</h3>
          {coffeeLogs.map((item) => <p key={item.id}>{item.bean} · {item.brew} · {item.roast}</p>)}
        </section>
        <section className="panel">
          <h3>최근 음악</h3>
          {musicLogs.map((item) => <p key={item.id}>{item.track} · {item.artist}</p>)}
        </section>
        <section className="panel">
          <h3>이번 달 무드</h3>
          <div className="tag-row"><Tag>몽환적</Tag><Tag>차분함</Tag><Tag>밝은 산미</Tag><Tag>앰비언트</Tag></div>
        </section>
      </div>
    </PageShell>
  );
}
