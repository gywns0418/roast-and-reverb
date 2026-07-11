import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Tag from "../../components/common/Tag.jsx";

export default function CoffeeWritePage() {
  return (
    <PageShell title="오늘의 로그" eyebrow="Natural log" subtitle="하루의 감각을 한 문장으로 남기면 AI가 커피와 음악 정보를 조용히 정리합니다.">
      <div className="today-log-layout">
        <section className="natural-log-panel">
          <span>자연어 입력</span>
          <textarea className="textarea" defaultValue="오늘 예가체프를 핸드드립으로 진하게 내려 마시면서 시규어 로스를 들었다." />
          <Button>AI로 분석하기</Button>
        </section>

        <section className="analysis-grid">
          <div className="ai-field ai-field-coffee">
            <h3>추출된 커피 정보</h3>
            <div className="form-grid">
              <Input placeholder="원두명" defaultValue="에티오피아 예가체프" />
              <Input placeholder="추출 방식" defaultValue="핸드드립" />
              <Input placeholder="강도" defaultValue="진하게" />
              <Input placeholder="무드" defaultValue="플로럴, 밝은 산미" />
            </div>
          </div>
          <div className="ai-field ai-field-music">
            <h3>추출된 음악 정보</h3>
            <div className="form-grid">
              <Input placeholder="곡명" defaultValue="Svefn-g-englar" />
              <Input placeholder="아티스트" defaultValue="Sigur Ros" />
              <Input placeholder="장르" defaultValue="Post-rock" />
              <Input placeholder="분위기" defaultValue="몽환적, 차분함" />
            </div>
          </div>
          <div className="mood-strip">
            <Tag variant="warm">플로럴</Tag>
            <Tag variant="cool">몽환적</Tag>
            <Tag variant="neutral">집중</Tag>
            <Button>페어링 생성</Button>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
