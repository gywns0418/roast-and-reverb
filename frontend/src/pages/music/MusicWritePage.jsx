import { useState } from "react";
import { useNavigate,useLocation,Link } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import {useDeviceDraft} from "../../hooks/useDeviceDraft.js";
import { musicApi } from "../../api/musicApi.js";

export default function MusicWritePage() {
  const navigate = useNavigate();
  const {state}=useLocation();const candidate=state?.musicCandidate;
  const [form, setForm, draftState] = useDeviceDraft("draft-music",()=>({
    trackName: candidate?.track || "",
    artistName: candidate?.artist || "",
    albumName: "",
    genre: candidate?.genre || "",
    listenedDate: new Date().toLocaleDateString("sv-SE"),
    memo: ""
  }),!!candidate);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function handleSave() {
    if(saving)return;
    if (!form.trackName.trim() || !form.artistName.trim() || !form.listenedDate) {
      setMessage("곡명, 아티스트와 들은 날짜를 입력해 주세요.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const created = await musicApi.create({
        ...form,
        trackName: form.trackName.trim(), artistName: form.artistName.trim()
      });
      draftState.clear();
      navigate(`/music/${created.musicLogId || created.music_log_id || created.id}`);
    } catch (error) {
      setMessage(error.message || "음악을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell title="음악 기록 작성" eyebrow="Music log" subtitle="오늘 들은 음악과 그때의 감상을 남깁니다.">
      {draftState.status&&<p className="draft-status" role="status">{draftState.status}</p>}<div className="action-row"><button className="ghost-button" type="button" onClick={draftState.discard}>초안 비우기</button><Link className="ghost-button" to="/coffee/write">커피는 따로 기록하기 ↗</Link></div>
      {candidate&&<p className="device-message">추천곡 정보를 가져왔습니다. 실제로 들은 날짜와 감상을 확인한 뒤 저장해 주세요.</p>}
      <form className="panel" onSubmit={event => { event.preventDefault(); handleSave(); }}>
        <div className="form-grid">
          <Input required label="곡명" placeholder="곡명" value={form.trackName} onChange={update("trackName")} />
          <Input required label="아티스트" placeholder="아티스트" value={form.artistName} onChange={update("artistName")} />
          <Input required type="date" label="들은 날짜" value={form.listenedDate} onChange={update("listenedDate")} />
          <Input label="앨범" placeholder="앨범" value={form.albumName} onChange={update("albumName")} />
          <Input label="장르" placeholder="장르" value={form.genre} onChange={update("genre")} />
        </div>
        <label className="input-field"><span>그때의 감상</span><textarea className="textarea" placeholder="기억에 남는 가사, 리듬, 그날의 기분을 적어보세요." value={form.memo} onChange={update("memo")} /></label>
        <Button type="submit" disabled={saving} loading={saving}>{saving ? "저장 중" : "음악 로그 저장"}</Button>
        {message && <p role="alert" className="muted">{message}</p>}
      </form>
    </PageShell>
  );
}
