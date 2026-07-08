import PageShell from "../../components/common/PageShell.jsx";
import Tag from "../../components/common/Tag.jsx";
import { pairings } from "../../data/sampleData.js";

export default function PairingPage() {
  return (
    <PageShell title="AI 페어링" eyebrow="Pairing" subtitle="커피와 음악을 연결하고 무드 인사이트를 저장합니다.">
      {pairings.map((item) => (
        <article className="hero-panel" key={item.id}>
          <div>
            <h2>{item.coffee} × {item.music}</h2>
            <p>{item.text}</p>
            <div className="tag-row"><Tag>몽환적</Tag><Tag>플로럴</Tag><Tag>차분함</Tag></div>
          </div>
          <strong>{item.score}</strong>
        </article>
      ))}
    </PageShell>
  );
}
