import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";

export default function MusicWritePage() {
  return (
    <PageShell title="음악 기록 작성" eyebrow="Music log" subtitle="오늘 들은 음악과 그때의 감상을 남깁니다.">
      <section className="panel compose-panel">
        <div className="form-grid">
          <Input placeholder="곡명" defaultValue="Svefn-g-englar" />
          <Input placeholder="아티스트" defaultValue="Sigur Ros" />
          <Input placeholder="앨범" defaultValue="Agaetis byrjun" />
          <Input placeholder="장르" defaultValue="Post-rock" />
        </div>
        <textarea className="textarea" defaultValue="느리게 번지는 기타와 보컬이 오늘 마신 커피의 플로럴한 향과 잘 어울렸다." />
        <Button>음악 로그 저장</Button>
      </section>
    </PageShell>
  );
}
