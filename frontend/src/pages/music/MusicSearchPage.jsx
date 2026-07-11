import PageShell from "../../components/common/PageShell.jsx";
import Input from "../../components/common/Input.jsx";
import MusicCard from "../../components/music/MusicCard.jsx";
import { musicLogs } from "../../data/sampleData.js";

export default function MusicSearchPage() {
  return (
    <PageShell title="음악 검색" eyebrow="Last.fm · Discogs" subtitle="곡과 앨범 메타데이터를 찾아 음악 로그에 연결합니다.">
      <section className="panel compose-panel">
        <Input placeholder="곡 또는 아티스트 검색" defaultValue="Sigur Ros" />
        <div className="card-grid">
          {musicLogs.slice(0, 2).map((item) => <MusicCard item={item} key={item.id} />)}
        </div>
      </section>
    </PageShell>
  );
}
