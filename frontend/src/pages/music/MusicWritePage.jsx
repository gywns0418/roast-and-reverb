import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { musicApi } from "../../api/musicApi.js";

export default function MusicWritePage() {
  const navigate = useNavigate();
  const local = import.meta.env.VITE_USE_REAL_API !== "true";
  const [form, setForm] = useState({
    trackName: local ? "Svefn-g-englar" : "",
    artistName: local ? "Sigur Ros" : "",
    albumName: local ? "Agaetis byrjun" : "",
    genre: local ? "Post-rock" : "",
    memo: ""
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
          <Input label="곡명" placeholder="곡명" value={form.trackName} onChange={update("trackName")} />
          <Input label="아티스트" placeholder="아티스트" value={form.artistName} onChange={update("artistName")} />
          <Input label="앨범" placeholder="앨범" value={form.albumName} onChange={update("albumName")} />
          <Input label="장르" placeholder="장르" value={form.genre} onChange={update("genre")} />
        </div>
        <label className="input-field"><span>그때의 감상</span><textarea className="textarea" placeholder="기억에 남는 가사, 리듬, 그날의 기분을 적어보세요." value={form.memo} onChange={update("memo")} /></label>
        <Button onClick={handleSave} disabled={saving} loading={saving}>{saving ? "저장 중" : "음악 로그 저장"}</Button>
        {message && <p className="muted">{message}</p>}
      </section>
    </PageShell>
  );
}
