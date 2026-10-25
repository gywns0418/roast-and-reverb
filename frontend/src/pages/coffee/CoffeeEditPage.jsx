import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import CoffeeSoundtrack from "../../components/coffee/CoffeeSoundtrack.jsx";
import CoffeeForm from "../../components/coffee/CoffeeForm.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { adaptCoffeeLog } from "../../api/adapters.js";
import { coffeePayload } from "../../utils/brewDetails.js";
import { coffeeEditForm, changeCoffeeNote } from "../../utils/coffeeEdit.js";
import { useApiResource } from "../../hooks/useApiResource.js";
export default function CoffeeEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: coffee, loading } = useApiResource(
    () => coffeeApi.detail(id).then(adaptCoffeeLog),
    {},
    [id],
  );
  const [form, setForm] = useState({
    beanName: "",
    drinkDate: "",
    brewDetails: {},
  });
  const [saving, setSaving] = useState(false);
  const [musicBusy, setMusicBusy] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!loading) setForm(coffeeEditForm(coffee));
  }, [coffee, loading]);
  async function save() {
    if (saving || musicBusy) return;
    setSaving(true);
    setMessage("");
    try {
      await coffeeApi.update(id, coffeePayload(form));
      navigate(`/coffee/${id}`);
    } catch (error) {
      setMessage(error.message || "기록을 수정하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <PageShell
      title="기록 수정"
      eyebrow="Edit coffee"
      subtitle="그날의 느낌을 다듬고, 기억나는 내용을 더해보세요."
    >
      <Link className="quiet-back" to={`/coffee/${id}`}>
        ← 수정 취소
      </Link>
      <section className="panel">
        <fieldset className="coffee-fields" disabled={loading}>
          <label className="quiet-field">
            이름
            <input
              maxLength={120}
              value={form.beanName || ""}
              onChange={(e) => setForm({ ...form, beanName: e.target.value })}
            />
          </label>
          <label className="quiet-field">
            날짜
            <input
              type="date"
              value={form.drinkDate || ""}
              onChange={(e) => setForm({ ...form, drinkDate: e.target.value })}
            />
          </label>
          <label className="quiet-field">
            남긴 느낌
            <textarea
              rows={5}
              value={form.brewDetails?.momentNote || form.memo || ""}
              onChange={(e) => setForm(changeCoffeeNote(form, e.target.value))}
            />
          </label>
          <details className="quiet-details">
            <summary>추출 조건도 수정하기</summary>
            <CoffeeForm value={form} onChange={setForm} />
          </details>
          <details
            className="quiet-details"
            onToggle={(e) => setMusicOpen(e.currentTarget.open)}
          >
            <summary>연결한 음악 바꾸기</summary>
            {!loading && musicOpen && (
              <CoffeeSoundtrack
                coffee={form}
                onChange={setForm}
                onBusyChange={setMusicBusy}
              />
            )}
          </details>
        </fieldset>
        <Button
          onClick={save}
          disabled={saving || loading || musicBusy}
          loading={saving}
        >
          {saving ? "저장 중" : "수정한 내용 저장"}
        </Button>
        {message && (
          <p role="alert" className="resource-error">
            {message}
          </p>
        )}
      </section>
    </PageShell>
  );
}
