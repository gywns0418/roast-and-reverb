import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import MusicCard from "../../components/music/MusicCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { musicApi } from "../../api/musicApi.js";
import { adaptMusicLog } from "../../api/adapters.js";
import {listDiaryRecords} from "../../utils/diaryRecords.js";
import {useApiResource} from "../../hooks/useApiResource.js";

const SHOWN_LIMIT = 6;

export default function MusicSearchPage() {
  const [params] = useSearchParams();
  const [keyword, setKeyword] = useState(params.get("q") || "");
  const {data:results,loading}=useApiResource(()=>listDiaryRecords(musicApi.list).then(items=>items.map(adaptMusicLog)),[],[]);
  const [limit,setLimit]=useState(SHOWN_LIMIT);
  const routeQuery=params.get('q')||'';
  useEffect(()=>{setKeyword(routeQuery);setLimit(SHOWN_LIMIT);},[routeQuery]);

  const visible = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return results;
    return results.filter((item) => [item.track, item.artist, item.album, item.genre, item.memo].join(" ").toLowerCase().includes(normalized));
  }, [keyword, results]);

  function handleSearch(){setLimit(SHOWN_LIMIT);}

  return (
    <PageShell title="음악 검색" eyebrow="Music Library" subtitle="내 기록에서 곡과 앨범을 찾습니다.">
      <section className="panel">
        <form className="form-grid" onSubmit={e=>{e.preventDefault();handleSearch();}}>
          <Input placeholder="곡 또는 아티스트 검색" value={keyword} onChange={(event) => {setKeyword(event.target.value);setLimit(SHOWN_LIMIT);}} />
          <Button type="submit" disabled={loading}>검색</Button>
        </form>
        {loading&&<p role="status">내 음악 기록을 불러오는 중…</p>}
        <div className="card-head" style={{ marginTop: 14, paddingBottom: 8, borderBottom: "1px dashed var(--line)" }}>
          <span>검색 결과</span>
          <span className="oldnum">{Math.min(visible.length, limit)} / {visible.length}건</span>
        </div>
        {!loading && visible.length === 0
          ? <EmptyState icon="wave">일치하는 곡을 찾지 못했어요. 다른 검색어로 시도해보세요.</EmptyState>
          : (
            <div className="card-grid">
              {visible.slice(0, limit).map((item) => <MusicCard item={item} key={item.id} />)}
            </div>
          )}
        {visible.length>limit&&<Button variant="ghost" onClick={()=>setLimit(value=>value+SHOWN_LIMIT)}>다음 {Math.min(SHOWN_LIMIT,visible.length-limit)}곡 더 보기</Button>}
      </section>
    </PageShell>
  );
}
