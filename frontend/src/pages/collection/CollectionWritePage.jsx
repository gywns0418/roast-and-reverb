import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { collectionApi } from "../../api/collectionApi.js";

export default function CollectionWritePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", artist: "", format: "LP", note: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      await collectionApi.create(form);
      navigate("/collection");
    } catch {
      setMessage("저장에 실패했습니다. 백엔드 서버가 켜져 있는지 확인해주세요.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell title="컬렉션 추가" eyebrow="New specimen" subtitle="새로 들인 LP/CD를 표본철에 등록합니다.">
      <section className="panel">
        <div className="form-grid">
          <Input placeholder="앨범명" value={form.title} onChange={update("title")} />
          <Input placeholder="아티스트" value={form.artist} onChange={update("artist")} />
        </div>
        <div className="filter-row">
          <button type="button" className={form.format === "LP" ? "primary-button" : "ghost-button"} onClick={() => setForm((prev) => ({ ...prev, format: "LP" }))}>LP</button>
          <button type="button" className={form.format === "CD" ? "primary-button" : "ghost-button"} onClick={() => setForm((prev) => ({ ...prev, format: "CD" }))}>CD</button>
        </div>
        <textarea className="textarea" placeholder="메모 — 어떤 페어링에 자주 등장하는지, 왜 들였는지" value={form.note} onChange={update("note")} />
        <Button onClick={handleSave} disabled={saving || !form.title} loading={saving}>{saving ? "저장 중" : "표본철에 등록"}</Button>
        {message && <p className="muted">{message}</p>}
      </section>
    </PageShell>
  );
}
