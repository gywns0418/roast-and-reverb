import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { adaptCoffeeLog } from "../../api/adapters.js";
import { coffeeLogs } from "../../data/sampleData.js";
import { useApiResource } from "../../hooks/useApiResource.js";

function toInputDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return String(value).replaceAll(".", "-").slice(0, 10);
}

export default function CoffeeEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fallback = adaptCoffeeLog(coffeeLogs.find((item) => String(item.id) === String(id)) || coffeeLogs[0]);
  const { data: coffee } = useApiResource(
    () => coffeeApi.detail(id).then(adaptCoffeeLog),
    fallback,
    [id]
  );
  const [form, setForm] = useState({
    beanName: "",
    roastery: "",
    brewMethod: "",
    roastLevel: "",
    memo: "",
    drinkDate: ""
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setForm({
      beanName: coffee.bean || "",
      roastery: coffee.roastery || "",
      brewMethod: coffee.brew || "",
      roastLevel: coffee.roast || "",
      memo: coffee.memo || "",
      drinkDate: toInputDate(coffee.raw?.drinkDate || coffee.raw?.drink_date || coffee.date)
    });
  }, [coffee]);

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      await coffeeApi.update(id, {
        ...form,
        originCountry: coffee.raw?.originCountry || coffee.raw?.origin_country || "",
        region: coffee.raw?.region || "",
        process: coffee.process || "",
        tasteNote: coffee.raw?.tasteNote || coffee.raw?.taste_note || form.memo,
        acidity: coffee.acidity || 0,
        sweetness: coffee.sweetness || 0,
        bitterness: coffee.bitterness || 0,
        body: coffee.body || 0,
        aroma: coffee.aroma || 0
      });
      navigate(`/coffee/${id}`);
    } catch {
      setMessage("저장에 실패했습니다. 백엔드 서버 상태를 확인해주세요.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell title="커피 기록 수정" eyebrow="Edit coffee" subtitle="원두 정보와 맛 평가를 다시 정리합니다.">
      <section className="panel">
        <div className="form-grid">
          <Input value={form.beanName} onChange={update("beanName")} />
          <Input value={form.roastery} onChange={update("roastery")} />
          <Input value={form.brewMethod} onChange={update("brewMethod")} />
          <Input value={form.roastLevel} onChange={update("roastLevel")} />
        </div>
        <textarea className="textarea" value={form.memo} onChange={update("memo")} />
        <Button onClick={handleSave} disabled={saving} loading={saving}>{saving ? "저장 중" : "수정 저장"}</Button>
        {message && <p className="muted">{message}</p>}
      </section>
    </PageShell>
  );
}
