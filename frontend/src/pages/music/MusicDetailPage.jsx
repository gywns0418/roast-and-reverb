import { useState } from "react";
import { useParams } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import MusicCard from "../../components/music/MusicCard.jsx";
import PairingCard from "../../components/pairing/PairingCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Motif from "../../components/common/Motif.jsx";
import { musicLogs, pairings, collections } from "../../data/sampleData.js";
import { musicApi } from "../../api/musicApi.js";
import { pairingApi } from "../../api/pairingApi.js";
import { collectionApi } from "../../api/collectionApi.js";
import { adaptMusicLog, adaptPairing, adaptCollection } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export default function MusicDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState("pairings");
  const fallbackMusic = adaptMusicLog(musicLogs.find((item) => String(item.id) === String(id)) || musicLogs[0]);
  const fallbackPairings = pairings.map(adaptPairing);
  const { data: music } = useApiResource(
    () => musicApi.detail(id).then(adaptMusicLog),
    fallbackMusic,
    [id]
  );
  const { data: relatedPairings } = useApiResource(
    () => pairingApi.list().then((items) => items.map(adaptPairing).filter((item) => item.music === music.track)),
    fallbackPairings.filter((item) => item.music === fallbackMusic.track),
    [id, music.track]
  );
  const { data: collectionItems } = useApiResource(
    () => collectionApi.list().then((items) => items.map(adaptCollection)),
    collections.map(adaptCollection),
    []
  );
  const pairing = relatedPairings[0] || fallbackPairings[0];
  const owned = collectionItems.find((item) => item.title === music.album || item.artist === music.artist);

  return (
    <PageShell title="음악 기록 상세" eyebrow="Music detail" subtitle="앨범 정보와 이 음악에 연결된 커피 페어링을 확인합니다.">
      <div className="panel-grid">
        <MusicCard item={music} />
        {pairing && <PairingCard item={pairing} />}
      </div>

      <div className="tabs" style={{ marginTop: 24 }}>
        <button type="button" className={tab === "pairings" ? "tab active" : "tab"} onClick={() => setTab("pairings")}>페어링 기록</button>
        <button type="button" className={tab === "collection" ? "tab active" : "tab"} onClick={() => setTab("collection")}>컬렉션 소장</button>
      </div>
      <div className="ledger">
        {tab === "pairings"
          ? (relatedPairings.length === 0
            ? <EmptyState icon="blend">아직 이 음악으로 만든 페어링이 없어요.</EmptyState>
            : (
              <div className="card-grid">
                {relatedPairings.map((item) => <PairingCard item={item} key={item.id} />)}
              </div>
            ))
          : (owned
            ? (
              <div className="specimen-card" style={{ margin: 0 }}>
                <Motif variant="wave" />
                <div className="names">{owned.title}<span>·</span>{owned.artist}</div>
                <p className="catalog smcp">{owned.format} · No. <span className="oldnum">{owned.score}</span></p>
              </div>
            )
            : <EmptyState icon="wave">아직 컬렉션에 등록되지 않았어요.</EmptyState>)}
      </div>
    </PageShell>
  );
}
