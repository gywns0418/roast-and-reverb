import { brewSummary } from "../../utils/brewDetails.js";
export default function BrewDetails({
  details,
  waterTemp,
  grindSize,
  brewTime,
}) {
  const summary = brewSummary(details);
  const rows = [
    [
      "기록 시간",
      details.recordedHour === undefined ||
      details.recordedHour === null ||
      details.recordedHour === ""
        ? null
        : `${details.recordedHour}시`,
    ],
    ["원두량", details.doseGrams ? `${details.doseGrams}g` : null],
    ["부은 물 총량", details.waterGrams ? `${details.waterGrams}g` : null],
    [
      "실제 내려온 양",
      details.beverageGrams === undefined ||
      details.beverageGrams === null ||
      details.beverageGrams === ""
        ? null
        : `${details.beverageGrams}g`,
    ],
    ["원두 : 부은 물", summary.ratio],
    ["드리퍼", details.dripper],
    ["필터", details.filter],
    ["그라인더", details.grinder],
    ["분쇄도", grindSize],
    [
      "물 온도",
      waterTemp === null || waterTemp === undefined ? null : `${waterTemp}℃`,
    ],
    [
      "총 추출 시간",
      brewTime === null || brewTime === undefined
        ? details.brewTimeText
        : `${brewTime}초`,
    ],
    [
      "푸어량",
      summary.pours
        ? `${summary.pours.individual.join(" + ")}g (개별) · ${summary.pours.cumulative.join(" → ")}g (누적)`
        : details.pourText,
    ],
    ["로스팅 날짜", details.roastDate],
    ["개봉 날짜", details.openedDate],
    ["후미", details.aftertaste],
    ["식으면서", details.coolingNotes],
    ["만족도", details.ratingText],
    ["다시 마시고 싶은가", details.wouldRepeat],
    ["다음 잔", details.nextExperiment],
  ].filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );
  if (!rows.length && !details.analysisNotes && !details.recipeText)
    return null;
  return (
    <section className="brew-detail">
      <h4>추출 기록</h4>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {details.recipeText && (
        <details>
          <summary>원본 레시피</summary>
          <p className="brew-notes">{details.recipeText}</p>
        </details>
      )}
      {details.analysisNotes && (
        <details>
          <summary>관찰과 해석 / 다음 실험</summary>
          <p className="brew-notes">{details.analysisNotes}</p>
        </details>
      )}
    </section>
  );
}
