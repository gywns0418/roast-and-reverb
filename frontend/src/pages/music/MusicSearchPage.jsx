import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import MusicCard from "../../components/music/MusicCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { musicApi } from "../../api/musicApi.js";
import { adaptMusicLog } from "../../api/adapters.js";
import { musicLogs } from "../../data/sampleData.js";

const SHOWN_LIMIT = 6;

export default function MusicSearchPage() {
  const [params] = useSearchParams();
  const [keyword, setKeyword] = useState(params.get("q") || "");
  const [results, setResults] = useState(import.meta.env.VITE_USE_REAL_API === "true" ? [] : musicLogs.map(adaptMusicLog));
  const [message, setMessage] = useState("");

  const visible = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return results;
    return results.filter((item) => [item.track, item.artist, item.album, item.genre, item.memo].join(" ").toLowerCase().includes(normalized));
  }, [keyword, results]);

  async function handleSearch() {
    setMessage("");
    try {
      const items = await musicApi.list({ keyword });
      setResults(items.map(adaptMusicLog));
    } catch {
      setResults([]);
      setMessage("검색에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <PageShell title="음악 검색" eyebrow="Music Library" subtitle="내 기록에서 곡과 앨범을 찾습니다.">
      <section className="panel">
        <div className="form-grid">
          <Input placeholder="곡 또는 아티스트 검색" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          <Button onClick={handleSearch}>검색</Button>
        </div>
        {message && <p className="muted">{message}</p>}
        <div className="card-head" style={{ marginTop: 14, paddingBottom: 8, borderBottom: "1px dashed var(--line)" }}>
          <span>검색 결과</span>
          <span className="oldnum">{Math.min(visible.length, SHOWN_LIMIT)} / {visible.length}건</span>
        </div>
        {visible.length === 0
          ? <EmptyState icon="wave">일치하는 곡을 찾지 못했어요. 다른 검색어로 시도해보세요.</EmptyState>
          : (
            <div className="card-grid">
              {visible.slice(0, SHOWN_LIMIT).map((item) => <MusicCard item={item} key={item.id} />)}
            </div>
          )}
      </section>
    </PageShell>
  );
}
