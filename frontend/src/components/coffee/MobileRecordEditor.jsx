import { useEffect, useRef, useState } from "react";
import { coffeeApi } from "../../api/coffeeApi.js";
import { adaptCoffeeLog } from "../../api/adapters.js";
import { coffeeEditForm, changeCoffeeNote } from "../../utils/coffeeEdit.js";
import { coffeePayload } from "../../utils/brewDetails.js";
export default function MobileRecordEditor({ id, onSaved, onCancel }) {
  const pending = useRef(false);
  const [form, setForm] = useState(null),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(false);
  useEffect(() => {
    let live = true;
    coffeeApi
      .detail(id)
      .then((row) => {
        if (live) setForm(coffeeEditForm(adaptCoffeeLog(row)));
      })
      .catch((e) => {
        if (live) setError(e.message);
      });
    return () => {
      live = false;
    };
  }, [id]);
  async function save() {
    if (!form || pending.current) return;
    pending.current = true;
    setSaving(true);
    setError("");
    try {
      const payload = coffeePayload(form);
      const result = await coffeeApi.update(id, payload);
      onSaved(adaptCoffeeLog({ ...payload, ...result, id }));
    } catch (e) {
      setError(e.message);
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }
  return (
    <div className="mobile-note-editor">
      {!form && !error && <p role="status">원래 기록을 확인하고 있어요…</p>}
      {form && (
        <label>
          감상 수정
          <textarea
            rows={4}
            maxLength={2000}
            value={form.brewDetails?.momentNote || form.memo || ""}
            disabled={saving}
            onChange={(e) => setForm(changeCoffeeNote(form, e.target.value))}
          />
        </label>
      )}
      <div className="action-row">
        <button
          type="button"
          className="primary-button"
          disabled={!form || saving}
          onClick={save}
        >
          {saving ? "저장 중…" : "수정 저장"}
        </button>
        <button
          type="button"
          className="ghost-button"
          disabled={saving}
          onClick={onCancel}
        >
          취소
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
