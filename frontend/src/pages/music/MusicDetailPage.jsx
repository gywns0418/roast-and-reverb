import { Link, useParams } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Loading from "../../components/common/Loading.jsx";
import { musicApi } from "../../api/musicApi.js";
import { adaptMusicLog } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";
import { musicSearchLink } from "../../utils/musicCandidates.js";
export default function MusicDetailPage() {
  const { id } = useParams();
  const { data: music, loading } = useApiResource(
    () => musicApi.detail(id).then(adaptMusicLog),
    {},
    [id],
  );
  return (
    <PageShell
      title={loading ? "음악 기록" : music.track}
      subtitle={music.artist}
    >
      {loading ? (
        <Loading title="음악 기록을 펼치고 있어요." />
      ) : (
        <>
          <Link className="quiet-back" to="/music">
            ← 함께 남긴 음악
          </Link>
          <article className="quiet-note">
            <small>{music.date}</small>
            <p className="quiet-note-copy">
              {music.memo || "남긴 감상이 없어요."}
            </p>
            <a
              className="primary-button"
              href={musicSearchLink(music)}
              target="_blank"
              rel="noreferrer"
            >
              YouTube에서 곡 찾기 ↗
            </a>
          </article>
          <details className="quiet-details">
            <summary>앨범과 장르 정보</summary>
            <dl className="quiet-facts">
              {[
                ["앨범", music.album],
                ["장르", music.genre],
                ["태그", music.tags?.join(" · ")],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v || "미기록"}</dd>
                </div>
              ))}
            </dl>
          </details>
        </>
      )}
    </PageShell>
  );
}
