import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import CoffeeForm from "../../components/coffee/CoffeeForm.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { adaptCoffeeLog } from "../../api/adapters.js";
import { coffeePayload } from "../../utils/brewDetails.js";
import { coffeeLogs } from "../../data/sampleData.js";
import { useApiResource } from "../../hooks/useApiResource.js";
export default function CoffeeEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fallback = adaptCoffeeLog(
    coffeeLogs.find((item) => String(item.id) === id) || coffeeLogs[0],
  );
  const { data: coffee, loading } = useApiResource(
    () => coffeeApi.detail(id).then(adaptCoffeeLog),
    fallback,
    [id],
  );
  const [form, setForm] = useState({
    beanName: "",
    drinkDate: "",
    brewDetails: {},
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    setForm({
      beanName: coffee.bean,
      roastery: coffee.roastery,
      brewMethod: coffee.brew,
      roastLevel: coffee.roast,
      memo: coffee.memo,
      tasteNote: coffee.raw?.tasteNote || coffee.raw?.taste_note || "",
      drinkDate: coffee.date.replaceAll(".", "-"),
      waterTemp: coffee.waterTemp,
      grindSize: coffee.grindSize,
      brewTime: coffee.brewTime,
      brewDetails: coffee.brewDetails || {},
    });
  }, [coffee]);
  async function save() {
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
      title="커피 기록 수정"
      eyebrow="Edit coffee"
      subtitle="추출 조건과 맛의 변화를 정확히 남겨보세요."
    >
      <section className="panel">
        <fieldset className="coffee-fields" disabled={loading}>
          <CoffeeForm value={form} onChange={setForm} />
        </fieldset>
        <Button onClick={save} disabled={saving || loading} loading={saving}>
          {saving ? "저장 중" : "수정 저장"}
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
