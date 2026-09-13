import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { musicApi } from "../../api/musicApi.js";

export default function MusicWritePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    trackName: "Svefn-g-englar",
    artistName: "Sigur Ros",
    albumName: "Agaetis byrjun",
    genre: "Post-rock",
    memo: "느리게 번지는 기타와 보컬이 오늘 마신 커피의 플로럴한 향과 잘 어울렸다."
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const created = await musicApi.create({
        ...form,
        listenedDate: new Date().toISOString().slice(0, 10)
      });
      navigate(`/music/${created.musicLogId || created.music_log_id || created.id}`);
    } catch {
      setMessage("저장에 실패했습니다. 백엔드 서버가 켜져 있는지 확인해주세요.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell title="음악 기록 작성" eyebrow="Music log" subtitle="오늘 들은 음악과 그때의 감상을 남깁니다.">
      <section className="panel">
        <div className="form-grid">
          <Input placeholder="곡명" value={form.trackName} onChange={update("trackName")} />
          <Input placeholder="아티스트" value={form.artistName} onChange={update("artistName")} />
          <Input placeholder="앨범" value={form.albumName} onChange={update("albumName")} />
          <Input placeholder="장르" value={form.genre} onChange={update("genre")} />
        </div>
        <textarea className="textarea" value={form.memo} onChange={update("memo")} />
        <Button onClick={handleSave} disabled={saving} loading={saving}>{saving ? "저장 중" : "음악 로그 저장"}</Button>
        {message && <p className="muted">{message}</p>}
      </section>
    </PageShell>
  );
}
