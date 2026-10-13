import Input from "../common/Input.jsx";
import { readBrewDetails, brewSummary } from "../../utils/brewDetails.js";

export default function CoffeeForm({ value, onChange }) {
  const details = readBrewDetails(value.brewDetails);
  const summary = brewSummary(details);
  const change = (key) => (event) =>
    onChange({ ...value, [key]: event.target.value });
  const changeDetail = (key) => (event) =>
    onChange({
      ...value,
      brewDetails: { ...details, [key]: event.target.value },
    });
  const field = (label, key, props = {}, detail = false) => (
    <label className="brew-field" key={key}>
      <span>{label}</span>
      <Input
        bare
        value={(detail ? details : value)[key] ?? ""}
        onChange={detail ? changeDetail(key) : change(key)}
        {...props}
      />
    </label>
  );
  return (
    <div className="coffee-form">
      <div className="brew-fields">
        {field("원두명", "beanName", { placeholder: "원두명", required: true })}
        {field("로스터리", "roastery", { placeholder: "로스터리" })}
        {field("추출 방식", "brewMethod", {
          placeholder: "핸드드립, 에어로프레스…",
        })}
        {field("로스팅", "roastLevel", { placeholder: "Light, Medium…" })}
        {field("기록 날짜", "drinkDate", { type: "date" })}
        {field(
          "기록 시간 (시)",
          "recordedHour",
          {
            type: "number",
            min: 0,
            max: 23,
            placeholder: "확인한 시간만 입력",
          },
          true,
        )}
      </div>
      <label className="brew-field">
        <span>내가 느낀 맛과 향</span>
        <textarea
          className="textarea"
          value={value.tasteNote || ""}
          onChange={change("tasteNote")}
          placeholder="복숭아 같은 단맛, 차를 닮은 여운…"
          rows={3}
        />
      </label>
      <details className="brew-more">
        <summary>추출 조건과 다음 실험 기록</summary>
        <button
          className="ghost-button brew-preset"
          type="button"
          onClick={() =>
            onChange({
              ...value,
              waterTemp: 92,
              grindSize: "0점 기준 51클릭",
              brewDetails: {
                ...details,
                doseGrams: 16,
                waterGrams: 245,
                grinder: "Timemore C3 ESP",
                pourText: "45 + 100 + 100",
                pourMode: "individual",
              },
            })
          }
        >
          16g · 245g 기준 레시피 채우기
        </button>
        <div className="brew-fields">
          {field(
            "원두량 (g)",
            "doseGrams",
            { type: "number", min: 0.1, step: "0.1" },
            true,
          )}
          {field(
            "부은 물 총량 (g)",
            "waterGrams",
            { type: "number", min: 0.1, step: "0.1" },
            true,
          )}
          {field(
            "실제 내려온 양 (g)",
            "beverageGrams",
            {
              type: "number",
              min: 0,
              step: "0.1",
              placeholder: "물 총량과 별도로 측정",
            },
            true,
          )}
          {field("물 온도 (℃)", "waterTemp", {
            type: "number",
            min: 0,
            max: 100,
          })}
          {field("분쇄도", "grindSize", { placeholder: "0점 기준 51클릭" })}
          {field("총 추출 시간 (초)", "brewTime", {
            type: "number",
            min: 0,
            placeholder: "2분 30초 = 150초",
          })}
          {field("드리퍼", "dripper", {}, true)}
          {field("필터", "filter", {}, true)}
          {field(
            "그라인더",
            "grinder",
            { placeholder: "Timemore C3 ESP" },
            true,
          )}
          {field("로스팅 날짜", "roastDate", { type: "date" }, true)}
          {field("개봉 날짜", "openedDate", { type: "date" }, true)}
        </div>
        <div className="brew-fields">
          <label className="brew-field">
            <span>푸어량 표기</span>
            <select
              className="input"
              value={details.pourMode || "individual"}
              onChange={changeDetail("pourMode")}
            >
              <option value="individual">한 번씩 부은 양</option>
              <option value="cumulative">누적 물량</option>
            </select>
          </label>
          {field(
            "푸어량 (g)",
            "pourText",
            { placeholder: "45 + 100 + 100 또는 45 → 145 → 245" },
            true,
          )}
        </div>
        {(summary.ratio || summary.pours) && (
          <div className="brew-calculation" role="status">
            {summary.ratio && <span>원두 : 부은 물 {summary.ratio}</span>}
            {summary.pours && (
              <span>
                개별 {summary.pours.individual.join(" + ")}g · 누적{" "}
                {summary.pours.cumulative.join(" → ")}g
              </span>
            )}
          </div>
        )}
        {summary.pours &&
          details.waterGrams &&
          Math.abs(summary.pours.total - Number(details.waterGrams)) > 0.1 && (
            <p className="brew-hint">
              푸어량 합계와 부은 물 총량이 다릅니다. 입력값을 확인해 주세요.
            </p>
          )}
        {[
          ["후미", "aftertaste"],
          ["식으면서 달라진 점", "coolingNotes"],
          ["다음 잔에서 바꿔볼 것", "nextExperiment"],
        ].map(([label, key]) => field(label, key, {}, true))}
        <label className="brew-field">
          <span>관찰과 해석 / 다음 실험</span>
          <textarea
            className="textarea"
            value={details.analysisNotes || ""}
            onChange={changeDetail("analysisNotes")}
            rows={4}
            placeholder="관찰한 사실과 가능한 해석을 나누어 적어보세요."
          />
        </label>
        {details.recipeText && (
          <label className="brew-field">
            <span>원본 레시피 메모</span>
            <textarea
              className="textarea"
              value={details.recipeText}
              onChange={changeDetail("recipeText")}
              rows={4}
            />
          </label>
        )}
        <p className="brew-hint">
          모르는 값은 비워두세요. 부은 물과 실제 추출량을 구분하고, 음악은
          실제로 들은 곡만 연결합니다.
        </p>
      </details>
    </div>
  );
}
